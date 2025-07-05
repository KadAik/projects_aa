### AdminProfileSerializer
- An existing admin profile should normally have a user linked to it.
    - The user might be a None, in this case a test should be implemented. Use `to_representation` to test before display. For example, override the `to_representation` method in your serializer to check if the user is `None` and handle it appropriately:
      ```python
      def to_representation(self, instance):
          representation = super().to_representation(instance)
          if instance.user is None:
              representation['user'] = 'No user linked'
          return representation
      ```
    