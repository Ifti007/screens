from django.shortcuts import render_to_response
# Create your views here.
from django.http import HttpResponse

def index(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('usertrack/usertrack.html')
    return HttpResponse("Hello, world.")

def usercomputers(request,puser_id=0):
    return render_to_response('usertrack/usertrackcomputers.html')

def computerattrib(request):
    return render_to_response('usertrack/usertrackcomputerattributes.html')









##curl http://localhost:9000/api/usertrack/
##curl -X POST http://localhost:9000/api/usertrack/ -d "title=hello world&description=a whole new world"
##curl -X PUT http://localhost:9000/api/usertrack/101 -d "title=hello world&description=be nice"
##curl -X PUT http://localhost:9000/api/usertrack/101 -d "title=hello world&description=be nice&completed=True"
##curl -X DELETE http://localhost:9000/api/usertrack/101

#curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3000/api/login

#curl -H "Content-Type: application/json" -X POST -d '{ "pk": 0, "fields":{"active":true,"application_id":1,"application_name":"IPA","num_computers":5,} }' http://localhost:8000/api/usertrack
