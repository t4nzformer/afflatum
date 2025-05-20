from django.contrib import admin
from .models import UserProfile, Project, Comment, Like

admin.site.register(UserProfile)
admin.site.register(Project)
admin.site.register(Comment)
admin.site.register(Like)
