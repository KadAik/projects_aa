import os
from django.core.management.base import BaseCommand
from django.db import connections
from django.utils.connection import ConnectionDoesNotExist
from django.db.utils import OperationalError
from django.core.exceptions import ImproperlyConfigured


class Command(BaseCommand):
    help = "Check if the configured database(s) are reachable and correctly configured."
    

    def add_arguments(self, parser):
        parser.add_argument(
            "--alias",
            type=str,
            default="default",
            help="Database alias to check (default: 'default')"
        )

    def handle(self, *args, **options):
        alias = options["alias"]

        self.stdout.write(f"Django settings module: {os.environ['DJANGO_SETTINGS_MODULE']}")

        self.stdout.write(f"Checking database connection for alias: '{alias}'...")

        try:
            conn = connections[alias]
        except ConnectionDoesNotExist as e:
            self.stderr.write(self.style.ERROR(f"Connection {alias} does not exist: {e}"))
            self.exitcode = 1
            return

        try:
            conn.ensure_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1;")
                result = cursor.fetchone()

            if result == (1,):
                self.stdout.write(self.style.SUCCESS(f"✅ Database '{alias}' is reachable and healthy."))
                self.stdout.write(f"DB ENGINE: {conn.settings_dict['ENGINE']}")
                self.exitcode = 0
            else:
                self.stderr.write(self.style.ERROR(f"⚠️ Unexpected query result: {result}"))
                self.exitcode = 1

        except ImproperlyConfigured as e:
            self.stderr.write(self.style.ERROR(f"Improper configuration: {e}"))
            self.exitcode = 1
        except OperationalError as e:
            self.stderr.write(self.style.ERROR(f"Database server error: {e}"))
            self.exitcode = 1
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Unexpected error: {e}"))
            self.exitcode = 1
        finally:
            try:
                if conn.connection:
                    conn.close()
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"⚠️ Error failed to close connection while exiting: {e}"))
                
