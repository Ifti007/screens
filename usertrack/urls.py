from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^computers/(?P<puser_id>[0-9]+)$', views.usercomputers, name='usercomputers'),
    url(r'^computerattrib/$', views.computerattrib, name='usertrack'),
]
