from django.shortcuts import render_to_response
# Create your views here.
from django.http import HttpResponse

def index(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('events/events.html')
    return HttpResponse("Hello, world.")

def attendee(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('events/attendee.html')
    
