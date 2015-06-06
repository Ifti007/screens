from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^attendee/$', views.attendee, name='attendee'),
    url(r'^badgereprint/(?P<id>[0-9]*)/$', views.badgeReprint, name='badgeReprint'),
    url(r'^badges/$', views.badges, name='badges'),
    url(r'^attendee/charge/$', views.attendeeCharge, name='attendeeCharge'),
    url(r'^attendeetype$', views.attendeeType, name='attendeeType'),
    url(r'^membercategory$', views.memberCategory, name='memberCategory'),
    
]
