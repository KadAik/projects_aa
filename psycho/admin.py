import csv
from django.contrib import admin
from django.http import HttpResponse
from django.urls import reverse
from django.utils.html import format_html
from django.utils import timezone
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from psycho.models import (
    ApplicantProfile,
    CompositionCentre,
    User,
    Application,
    AdminProfile,
    HRManagerProfile,
    University,
    Review,
    ApplicationStatusHistory,
)


@admin.register(ApplicantProfile)
class ApplicantAdmin(admin.ModelAdmin):
    readonly_fields = ["user", "date_registered", "date_updated"]
    search_fields = ["email", "phone"]

    list_display = ["first_name", "last_name", "date_registered", "date_updated"]


@admin.register(AdminProfile)
class Admin(admin.ModelAdmin):
    readonly_fields = ["date_created", "date_updated", "user"]


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        "applicant",
        "tracking_id",
        "composition_centre",
        "status",
        "date_submitted_fr",
        "uploaded_files_preview",
    ]

    @admin.display(description="Soumis le")
    def date_submitted_fr(self, obj):
        # Format date in French style: DD/MM/YYYY HH:MM
        return timezone.localtime(obj.date_submitted).strftime("%d/%m/%Y")

    list_editable = ["status"]
    list_filter = ["status", "composition_centre", "date_submitted"]
    search_fields = ["tracking_id", "applicant__first_name", "applicant__last_name"]
    ordering = ["-date_submitted"]
    actions = ["export_as_csv"]

    @admin.display(description="Fichiers")
    def uploaded_files_preview(self, obj):
        """Display uploaded file links (if any)."""
        links = []
        file_fields = [
            "birth_certificate",
            "criminal_record",
            "baccalaureate_certificate",
            "highest_degree_certificate",
        ]
        for field in file_fields:
            f = getattr(obj.applicant, field, None)
            if f and hasattr(f, "url"):
                verbose_name = obj.applicant._meta.get_field(field).verbose_name
                links.append(
                    format_html(
                        '<a href="{}" target="_blank">{}</a>', f.url, verbose_name
                    )
                )
        return format_html("<br>".join(links)) if links else "-"

    @admin.action(description="Exporter les candidatures sélectionnées en CSV")
    def export_as_csv(self, request, queryset):
        """Export selected applications as CSV."""
        meta = self.model._meta
        field_names = [
            "tracking_id",
            "applicant__first_name",
            "applicant__last_name",
            "applicant__email",
            "applicant__phone",
            "composition_centre__name",
            "status",
            "date_submitted",
        ]

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f"attachment; filename={meta.verbose_name_plural}.csv"
        )
        response.write("\ufeff")  # UTF-8 BOM for Excel compatibility

        writer = csv.writer(response)
        # Write headers
        writer.writerow(
            [
                "ID de suivi",
                "Prénom",
                "Nom",
                "Email",
                "Téléphone",
                "Centre de composition",
                "Statut",
                "Date de soumission",
            ]
        )

        # Write data rows
        for obj in queryset:
            writer.writerow(
                [
                    obj.tracking_id,
                    obj.applicant.first_name,
                    obj.applicant.last_name,
                    obj.applicant.email,
                    f"\t{obj.applicant.phone}",  # To force phone number as text, not number (avoid scientific notation),
                    obj.composition_centre.name if obj.composition_centre else "",
                    obj.get_status_display(),
                    timezone.localtime(obj.date_submitted).strftime("%d/%m/%Y %H:%M"),
                ]
            )

        return response


@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    pass


admin.site.register(HRManagerProfile)

admin.site.register(University)

admin.site.register(Review)

admin.site.register(ApplicationStatusHistory)
admin.site.register(CompositionCentre)
