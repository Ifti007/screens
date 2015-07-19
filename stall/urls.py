from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^chargeModal$', views.chargeModal, name='chargeModal'),
]

