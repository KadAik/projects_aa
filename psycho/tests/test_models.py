from django.test import TestCase
from model_bakery import baker


class ApplicantProfileModelTest(TestCase):

    def setUp(self):
        pass

    def test_fields_normalization(self):
        profile = baker.make(
            "psycho.ApplicantProfile",
            first_name=" leaNdre  ",
            last_name=" sMith  ",
            phone="+2290198987878",  # baker doesn't support PhoneNumberField yet
        )
        self.assertEqual(
            profile.first_name,
            "Leandre",
            "First name should be capitalized and stripped of whitespace.",
        )
        self.assertEqual(
            profile.last_name,
            "SMITH",
            "Last name should be capitalized and stripped of whitespace.",
        )

    def test_file_upload_paths(self):
        profile = baker.make(
            "psycho.ApplicantProfile",
            first_name="John",
            last_name="Doe",
            phone="+2290198987878",
        )
        print(profile)

        birth_cert_path = profile.birth_certificate.field.upload_to(
            profile, "mybirthcert.PDF"
        )
        self.assertEqual(
            birth_cert_path,
            "applicant_profiles/birth_certificates/doe_john_birth_certificate.pdf",
            "Birth certificate upload path is incorrect.",
        )

        criminal_record_path = profile.criminal_record.field.upload_to(
            profile, "record.DOCX"
        )
        self.assertEqual(
            criminal_record_path,
            "applicant_profiles/criminal_records/doe_john_criminal_record.docx",
            "Criminal record upload path is incorrect.",
        )
