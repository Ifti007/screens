from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^usertrack/search/(?P<search_str>[A-Za-z0-9]*)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/orderby/(?P<order_by>[A-Za-z0-9_-]*)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/page/(?P<page_num>[0-9]+)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/page/(?P<page_num>[0-9]+)/size/(?P<page_size>[0-9]+)/search/(?P<search_str>[A-Za-z0-9]*)$', views.usertrack, name='usertrack'),
    url(r'^usertrack/$', views.usertrack, name='usertrack'),
]
