from django.urls import path

from . import views

urlpatterns = [
    path('', view=views.index),
    path('allReports', view=views.allReports),
    path('report', view=views.reportData, name='reportData'),
]
