from django.shortcuts import render, render_to_response
from django.http import HttpResponse

# Create your views here.

def index(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('stall/stall.html')
    #return HttpResponse("Hello, world.")

def chargeModal(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('stall/chargeModal.html')
    #return HttpResponse("Hello, world.")