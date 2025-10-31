from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import transaction


def ensure_group_permissions(model, group_name, custom_perms=None):
    """
    Ensure the given group exists and has all required permissions
    for the specified model (both default + custom ones).

    Args:
        model (models.Model): The Django model to base permissions on.
        group_name (str): The name of the group to ensure.
        custom_perms (list[str], optional): List of custom permission codenames.

    Returns:
        Group: The created or updated group instance.
    """
    if custom_perms is None:
        custom_perms = []

    with transaction.atomic():
        # Ensure the group exists
        group, created = Group.objects.get_or_create(name=group_name)

        # If group already exists and we're not forcing an update, check if permissions are already correct
        if not created and _group_has_correct_permissions(group, model, custom_perms):
            return group  # Skip all the work if permissions are already set

        # Get content type for the model
        content_type = ContentType.objects.get_for_model(model)

        # Default model-level permissions
        default_perms = [
            f"add_{model._meta.model_name}",
            f"change_{model._meta.model_name}",
            f"delete_{model._meta.model_name}",
            f"view_{model._meta.model_name}",
        ]

        # Merge all permission codenames
        all_codenames = default_perms + custom_perms

        # Fetch existing permissions
        existing_permissions = Permission.objects.filter(content_type=content_type)
        existing_codenames = set(
            existing_permissions.values_list("codename", flat=True)
        )

        # Create missing custom permissions if needed
        for codename in custom_perms:
            if codename not in existing_codenames:
                Permission.objects.create(
                    codename=codename,
                    name=codename.replace("_", " ").capitalize(),
                    content_type=content_type,
                )

        # Re-fetch all permissions (default + custom)
        permissions = Permission.objects.filter(
            content_type=content_type, codename__in=all_codenames
        )

        # Remove existing permissions for this model's content type
        group.permissions.remove(*group.permissions.filter(content_type=content_type))

        # Then add the new ones
        group.permissions.add(*permissions)

        return group


def _group_has_correct_permissions(group, model, custom_perms):
    """
    Check if the group already has the correct permissions for the given model.
    """
    content_type = ContentType.objects.get_for_model(model)

    # Expected permission codenames
    default_perms = [
        f"add_{model._meta.model_name}",
        f"change_{model._meta.model_name}",
        f"delete_{model._meta.model_name}",
        f"view_{model._meta.model_name}",
    ]
    expected_codenames = set(default_perms + custom_perms)

    # Get current permissions for this content type
    current_permissions = group.permissions.filter(content_type=content_type)
    current_codenames = set(current_permissions.values_list("codename", flat=True))

    return current_codenames == expected_codenames
