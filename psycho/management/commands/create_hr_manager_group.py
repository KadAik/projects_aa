from django.core.management.base import BaseCommand
from psycho.utils.shared.utils import ensure_group_permissions
from psycho.models import ApplicantProfile, Application, HRManagerProfile


class Command(BaseCommand):
    """
    Creates or updates the 'HR Manager' group and assigns all required permissions.
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
        group_name = options.get("name", "HR Manager")

        self.stdout.write(f"\nEnsuring group: {group_name}")
        self.stdout.write("-------------------------------------")

        # Define custom permissions specific to HR Manager
        applicants_custom_perms = [
            "can_manage_applicants_profiles",
        ]
        applications_custom_perms = [
            "can_manage_applications",
        ]

        try:
            for model, custom_perms in [
                (ApplicantProfile, applicants_custom_perms),
                (Application, applications_custom_perms),
            ]:
                hr_manager_group = ensure_group_permissions(
                    model, "HR Manager", custom_perms
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f"✅ Group '{group_name}' successfully ensured with permissions:"
                )
            )

            for perm in hr_manager_group.permissions.all():
                self.stdout.write(f"   • {perm.codename}")

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error ensuring group '{group_name}': {e}")
            )
