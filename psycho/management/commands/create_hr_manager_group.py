from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

from psycho.models import HRManagerProfile


class Command(BaseCommand):
    """
    Creates an 'HR Manager' group and assigns necessary permissions to it.
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "name",
            type=str,
            nargs="?",
            default="HR Manager",
            help="Name of the group to create or update.",
        )

    def handle(self, *args, **options):
        name = options.get("name")
        self.stdout.write(f"\nCreating or updating group: {name}")
        self.stdout.write("-------------------------------------")

        group, created = Group.objects.get_or_create(name=name)

        if created:
            self.stdout.write(
                self.style.SUCCESS(f"✅ Group '{name}' successfully created.")
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"⚠️  Group '{name}' already exists — updating permissions."
                )
            )

        # Get the content type for the HRManagerProfile model
        content_type = ContentType.objects.get_for_model(HRManagerProfile)

        permissions_data = [
            ("can_manage_applications", "Can manage applications"),
            ("can_manage_applicants_profiles", "Can manage applicants profiles"),
        ]

        created_permissions = []
        for codename, name_label in permissions_data:
            perm, perm_created = Permission.objects.get_or_create(
                codename=codename,
                name=name_label,
                content_type=content_type,
            )
            created_permissions.append(perm)
            if perm_created:
                self.stdout.write(
                    self.style.SUCCESS(f"  ➕ Created permission '{codename}'")
                )
            else:
                self.stdout.write(f"  ⚙️  Permission '{codename}' already exists")

        # Add permissions to group
        group.permissions.add(*created_permissions)

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Permissions successfully assigned to group '{group.name}'"
            )
        )
