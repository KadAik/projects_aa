#!/bin/bash

# ------------------------------------------------------------------
# update_services.sh
#
# Pull Docker Compose images and restart services.
# - If no service is specified → ALL services are pulled/restarted.
# - Supports --exclude "<wildcard>" to ignore services.
# ------------------------------------------------------------------

set -e  # Exit on any error

# -----------------------------
# ------ Configuration  -------
# -----------------------------

# Absolute path project directory
PROJECT_DIR="${PROJECT_DIR:-/home/mdnadmin/psycho/tests/app}"

# Path to the host .env file (NOT inside any container!)
ENV_FILE="$PROJECT_DIR/.env"

# Path to docker-compose.yml
COMPOSE_FILE="$PROJECT_DIR/compose.yml"

# Ensure files exist
if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "ERROR: docker-compose.yml not found at: $COMPOSE_FILE"
    exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo "ERROR: .env file not found at: $ENV_FILE"
    exit 1
fi

# Base docker compose command
DC="docker compose --env-file $ENV_FILE -f $COMPOSE_FILE"

# --- END CONFIGURATION --------------------------------------------

# -----------------------------
# Argument parsing
# -----------------------------
exclude_patterns=()
services=()

show_help() {
    cat <<EOF
Usage: $0 [OPTIONS] [SERVICE1 SERVICE2 ...]

Pull images and restart Docker Compose services.

OPTIONS:
  --exclude PATTERN      Exclude services matching a wildcard (e.g. "*backup")
  --exclude=PATTERN      Same as above
  -h, --help             Show this help message

EXAMPLES:

  # Update all services except backup ones
  $0 --exclude "*backup"

  # Update only web and api services
  $0 web api

  # Update web and api, but exclude anything ending in "-cache"
  $0 --exclude "*-cache" web api

  # Exclude multiple patterns
  $0 --exclude "*backup" --exclude "worker-*"

  # Dry-run (just show which will be restarted)
  DRY_RUN=1 $0 --exclude "*backup"
EOF
}

# Parse command-line options
while [[ "$#" -gt 0 ]]; do
    case "$1" in
        --exclude)
            shift
            exclude_patterns+=("$1")
            ;;
        --exclude=*)
            exclude_patterns+=("${1#*=}")
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            services+=("$1")
            ;;
    esac
    shift
done


# -----------------------------
# Exclusion matching function
# -----------------------------
is_excluded() {
    local name=$1
    for pattern in "${exclude_patterns[@]}"; do
        if [[ "$name" == $pattern ]]; then
            return 0  # excluded
        fi
    done
    return 1  # allowed
}


# -----------------------------
# Pull images
# -----------------------------
pull_images() {
    if [ "${#services[@]}" -ne 0 ]; then
        echo "Pulling images for: ${services[*]}"
        $DC pull "${services[@]}"
    else
        echo "Pulling ALL images (no services specified)..."
        $DC pull
    fi
}


# -----------------------------
# Restart containers
# -----------------------------
run_containers() {
    echo "Building service list with exclusions..."

    local final_services=()

    if [ "${#services[@]}" -ne 0 ]; then
        # Filter provided services
        for s in "${services[@]}"; do
            if is_excluded "$s"; then
                echo "Skipping excluded service: $s"
            else
                final_services+=("$s")
            fi
        done
    else
        # Load all services from compose
        while IFS= read -r svc; do
            if is_excluded "$svc"; then
                echo "Skipping excluded service: $svc"
            else
                final_services+=("$svc")
            fi
        done < <($DC config --services)
    fi

    if [ "${#final_services[@]}" -eq 0 ]; then
        echo "No services left to restart after exclusions. Nothing to do."
        return 0
    fi

    echo "Final services to restart: ${final_services[*]}"

    if [[ "$DRY_RUN" == "1" ]]; then
        echo "(DRY RUN) No containers will be stopped or started."
        return 0
    fi

    if [ "${#services[@]}" -eq 0 ]; then
        # No specific services provided → restart everything
        echo "No specific services provided. Restarting ALL services..."
        $DC down
        $DC up -d
    else
        # Restart only the selected ones
        echo "Restarting only: ${final_services[*]}"
        for svc in "${final_services[@]}"; do
            $DC stop "$svc" || true
            $DC up -d --no-deps "$svc"
        done
    fi
}



# -----------------------------
# Execution
# -----------------------------
echo "============================="
echo "   Updating Docker Services"
echo "============================="

echo "Pulling images ..."
pull_images
echo "Images pulled"

echo "Launching containers ..."
run_containers

echo "Done."
