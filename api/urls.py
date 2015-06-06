from django.conf.urls import url

from . import views
import events

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^usertrack/search/(?P<search_str>[A-Za-z0-9]*)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/orderby/(?P<order_by>[A-Za-z0-9_-]*)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/page/(?P<page_num>[0-9]+)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)/search/(?P<search_str>[A-Za-z0-9]*)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/$', views.usertrack, name='usertrack'),

    url(r'^events/(?P<model_name>attendee|attendeeType)/$', views.attendee, name='attendee'),
    url(r'^events/(?P<model_name>attendee|attendeeType)/page/(?P<page_num>[0-9]+)$', views.attendee, name='attendee'),
    url(r'^events/(?P<model_name>attendee|attendeeType)/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)$', views.attendee, name='attendee'),
    url(r'^events/(?P<model_name>attendee|attendeeType)/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)/search/(?P<search_str>[A-Za-z0-9]*)$', views.attendee, name='attendee'),
    
    url(r'^event/membercategory/$', views.memberCategory, name='memberCategory'),
    url(r'^event/membercategory/page/(?P<page_num>[0-9]+)$', views.memberCategory, name='memberCategory'),
    url(r'^event/membercategory/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)$', views.memberCategory, name='memberCategory'),
    url(r'^event/membercategory/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)/search/(?P<search_str>[A-Za-z0-9]*)$', views.memberCategory, name='memberCategory'),


]
