from django.contrib import admin

from psycho.models import ApplicantProfile, User, Application, AdminProfile, HRManagerProfile, University


@admin.register(ApplicantProfile)
class ApplicantAdmin(admin.ModelAdmin):
    readonly_fields = ['user', 'date_registered', 'date_updated']
    search_fields = ['email', 'phone']
    fields = ['user', 'first_name', 'last_name', 'email', 'phone', 'gender', 'date_of_birth']
    list_display = ['first_name', 'last_name', 'date_registered', 'date_updated']


@admin.register(AdminProfile)
class Admin(admin.ModelAdmin):
    readonly_fields = ['date_created', 'date_updated', 'user']


admin.site.register(User)

admin.site.register(Application)

admin.site.register(HRManagerProfile)

admin.site.register(University)
