from rest_framework import permissions


class GuestPostPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if not obj.is_active and request.user != obj.owner:
                return False
            return True

        if request.user == obj.owner:
            return True

        return False
