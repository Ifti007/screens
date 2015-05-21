from django.shortcuts import render,render_to_response
from django.views.decorators.http import require_http_methods

# Create your views here.
from django.http import HttpResponse
from models import USER_TRACKED

def index(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('usertrack/usertrack.html')
    return HttpResponse("Hello, world.")

def usercomputers(request,puser_id=0):
    return render_to_response('usertrack/usertrackcomputers.html')

def computerattrib(request):
    return render_to_response('usertrack/usertrackcomputerattributes.html')


@require_http_methods(["POST"])
def save(request,pModelName):
   msgOut=Messages()
   lUser = request.META['USER']
   logger.debug(request)
   logger.debug(request.body);
   
   #if request.method != 'POST':
   #  return HttpResponse('Expecting POST')
   data={}
   if request.META['CONTENT_TYPE'] == 'x-www-form-urlencoded' or request.META['CONTENT_TYPE'] == 'application/json':
       data=json.loads(request.body)
   else:
       data=request.POST

   lModel=getModelFromName(pModelName)
   lPk=data['pk']
   if lPk and lPk > 0:   #if pk is already in incoming data then we would make python update instead of insert
       currRow=lModel.objects.get(pk=lPk)
       #assigning incoming data to the row that was fetched for update
       if currRow:
           for attr, value in data.iteritems(): 
             setattr(currRow, attr, value)
           currRow.modified_dt=timezone.now()
           currRow.modifiedby=lUser
       
   # if incoming data has no pk or if it had pk but if that pk didnt exist in the database for update
   if lPk<=0 or not currRow:
       #currRow=lModel.objects.create(**data)
       del data['pk']   # delete so that id is automatically generated
       currRow=lModel(**data)
       currRow.created_dt=timezone.now()
       currRow.createdby=lUser
   
   try:
       currRow.full_clean()
       currRow.save()
       msgOut.hasSucceeded=True
       msgOut.pk=currRow.pk
       msgOut.addMessage(unicode(_('Saved Successfully')),'SavedSuccess')
   #except IntegrityError as e:
   #	   msgOut.hasSucceeded=False
   #	   msgOut.addMessage(str(e),'IntegrityError')
   #	   logger.debug(e)
   except ValidationError as e:
       logger.debug('Validation Error')
       logger.debug(e.error_dict)
       msgOut.addFieldError(e.message_dict) #send e.message_dict for simple messages or e.error_dict with ValidationError object
       msgOut.addMessage(unicode(_('Not saved')),'SavedFailed')

   
   except Exception as e:
   	   msgOut.hasSucceeded=False
   	   msgOut.addMessage(str(e),'Exception')
   	   logger.debug(e)
   	   #msgOut.addMessage(unicode(_('Error encounterd saving')),'SavedError')
   
   logger.debug(currRow)
   logger.debug(msgOut.outputJSON())
   
   return HttpResponse(msgOut.outputJSON(),content_type='application/json')   

@require_http_methods(["GET"])
def get(request,pURI,pSearchStr=None,pOrderBy=None,pPageSize=None,pPageNumber=None):
   mod = __import__('models',fromlist=pURI)
   lModel = getattr(mod,pModel)
   lModel = USER_TRACKED
   #s=serializers.serialize("json",lModel.objects.all())
   s=json.dumps(list(lModel.objects.values()),cls=DecimalEncoder)
   return HttpResponse(s,content_type='application/json') 





##curl http://localhost:9000/api/usertrack/
##curl -X POST http://localhost:9000/api/usertrack/ -d "title=hello world&description=a whole new world"
##curl -X PUT http://localhost:9000/api/usertrack/101 -d "title=hello world&description=be nice"
##curl -X PUT http://localhost:9000/api/usertrack/101 -d "title=hello world&description=be nice&completed=True"
##curl -X DELETE http://localhost:9000/api/usertrack/101

#curl -H "Content-Type: application/json" -X POST -d '{"username":"xyz","password":"xyz"}' http://localhost:3000/api/login

#curl -H "Content-Type: application/json" -X POST -d '{ "pk": 0, "fields":{"active":true,"application_id":1,"application_name":"IPA","num_computers":5,} }' http://localhost:8000/api/usertrack