from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TransactionTestCase


class TestPopulateCompositionCentresMigration(TransactionTestCase):
    """Test the composition centres data migration"""

    app = "psycho"
    migrate_from = "0001_initial"
    migrate_to = "0002_seed_composition_centres"

    def setUp(self):
        """Set up test by migrating to the state before our migration"""
        super().setUp()
        self.executor = MigrationExecutor(connection)

        # Migrate back to 0001_initial (before the data migration)
        self.executor.migrate([(self.app, self.migrate_from)])

        # Clear any existing data that might be there
        old_apps = self.executor.loader.project_state(
            [(self.app, self.migrate_from)]
        ).apps
        CompositionCentre = old_apps.get_model(self.app, "CompositionCentre")
        CompositionCentre.objects.all().delete()

    def test_populate_composition_centres(self):
        """Test that the migration correctly populates composition centres"""

        # Get the model at the 0001_initial state
        old_apps = self.executor.loader.project_state(
            [(self.app, self.migrate_from)]
        ).apps
        CompositionCentre = old_apps.get_model(self.app, "CompositionCentre")

        # Verify no centres exist before migration
        self.assertEqual(CompositionCentre.objects.count(), 0)

        # Run the migration forward to 0002
        self.executor.loader.build_graph()
        self.executor.migrate([(self.app, self.migrate_to)])

        # Get the model at the new state
        new_apps = self.executor.loader.project_state(
            [(self.app, self.migrate_to)]
        ).apps
        CompositionCentre = new_apps.get_model(self.app, "CompositionCentre")

        # Verify the expected data was created
        expected_names = [
            "Cotonou",
            "Porto-Novo",
            "Lokossa",
            "Parakou",
            "Abomey",
            "Natitingou",
        ]

        actual_count = CompositionCentre.objects.count()
        self.assertEqual(
            actual_count,
            len(expected_names),
            f"Expected {len(expected_names)} centres but found {actual_count}",
        )

        # Verify all expected centres exist
        names = set(CompositionCentre.objects.values_list("name", flat=True))
        for name in expected_names:
            self.assertIn(name, names, f"Expected centre '{name}' not found in {names}")

        # Verify each centre has a location
        for centre in CompositionCentre.objects.all():
            self.assertTrue(
                centre.location, f"Centre {centre.name} is missing a location"
            )
