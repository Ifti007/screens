from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^attendee$', views.attendee, name='attendee'),
    url(r'^attendeetype$', views.attendeeType, name='attendeeType'),
    url(r'^membercategory$', views.memberCategory, name='memberCategory'),
    
]
