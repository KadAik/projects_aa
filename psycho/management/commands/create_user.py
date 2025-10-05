
from django.core.management.base import BaseCommand
from django.core.management import CommandError

from django.contrib.auth import get_user_model

import getpass

User = get_user_model()

class Command(BaseCommand):
    help = """
    Create a new user with the given username and password.

    Usage: python manage.py create_user <username> <password>
    Example: python manage.py create_user john_doe secret123
    """
    
    def add_arguments(self, parser):
        """
        Add arguments to the command.
        """
        # Positional arguments for username and password
        parser.add_argument('p_username', type=str, nargs='?', help='The username for the new user.')
        parser.add_argument('p_password', type=str, nargs='?', help='The password for the new user.')
        
        # Optional arguments
        parser.add_argument('--email', type=str, help='The email address for the new user.', default=None)
        parser.add_argument('--username', type=str, help='The username for the new user.', default=None)
        parser.add_argument('-p', '--password', type=str, help='The password for the new user.', default=None)
        
        # Should the user been created interactively ? This is the default behavior if no positional or optional arguments are provided.
        parser.add_argument('-i', '--interactive', action='store_true', help='Create the user interactively.')
        
    def get_password(self, prompt='Password: '):
        """
        Get the password from the user.
        """
        self.stdout.write('Please enter the password ...')
        password1 = getpass.getpass(prompt)
        if not password1:
            raise CommandError('Password cannot be empty.')

        password2 = getpass.getpass('Confirm Password: ')
        if password1 != password2:
            raise CommandError('Passwords do not match.')
        
        return password1
    
    def handle(self, *args, **options):
        """
        Handle the command execution.
        """
        self.stdout.write('Creating a new user ...')
        self.stdout.write('-------------------------------------')
        self.stdout.write(f"args: {args}")
        self.stdout.write(f"options: {options}")
        is_interactive = options['interactive']
        missing_positional_args = not options.get('p_username') and not options.get('p_password')
        missing_optional_args = not options.get('username') and not options.get('password')
        
        self.stdout.write(f"Interactive mode: {is_interactive}")
        self.stdout.write(f"Missing positional args: {missing_positional_args}")
        self.stdout.write(f"Missing optional args: {missing_optional_args}")

        if is_interactive or (missing_positional_args and missing_optional_args):
            # If no arguments are provided, prompt for username and password
            # If interactive mode is enabled, prompt for username and password
            self.stdout.write('Please enter the username ...')
            username = input('Username: ').strip()
            if not username:
                raise CommandError('Username cannot be empty.')
            if User.objects.filter(username=username).exists():
                raise CommandError(f'User with username "{username}" already exists.')
    
            password = self.get_password()
            
            self.stdout.write('Please enter the email address ...')
            email = input('Email: ').strip()
            if not email:
                raise CommandError('Email cannot be empty.')
            if User.objects.filter(email=email).exists():
                raise CommandError(f'User with email "{email}" already exists.')
            
            User.objects.create_user(username=username, password=password, email=email)
            self.stdout.write(self.style.SUCCESS(f'User "{username}" created successfully.'))
            return
            
        username = options.get('p_username') or options['username']
        password = options.get('p_password') or options['password']
        email = options.get('email')
        
        if not username:
                raise CommandError('Username cannot be empty.')
        if User.objects.filter(username=username).exists():
            raise CommandError(f'User with username "{username}" already exists.')
        
        if username is not None and password is None:
            password = self.get_password()
        
        if not email:
            self.stdout.write('Please enter the email address ...')
            email = input('Email: ').strip()
            if not email:
                raise CommandError('Email cannot be empty.')
            
        if User.objects.filter(email=email).exists():
            raise CommandError(f'User with email "{email}" already exists.')
        
        User.objects.create_user(username=username, password=password, email=email)
        self.stdout.write(self.style.SUCCESS(f'User "{username}" created successfully.'))