from django.http import HttpResponse
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from usertrack.models import USER_TRACKED, USER, APPLICATION
from events.models import attendee, attendeeType 

from django.core.exceptions import ValidationError
from django.db.models import Q  #For or queries
# import json
import json, math, decimal
from django.core import serializers

import stripe
# import the logging library
import logging



# Get an instance of a logger
logger = logging.getLogger('api')

"""
class DecimalEncoder(json.JSONEncoder):
    def _iterencode(self, o, markers=None):
        if isinstance(o, decimal.Decimal):
            # wanted a simple yield str(o) in the next line,
            # but that would mean a yield on the line with super(...),
            # which wouldn't work (see my comment below), so...
            return (str(o) for o in [o])
        elif isinstance(o, datetime.datetime):
            # wanted a simple yield str(o) in the next line,
            # but that would mean a yield on the line with super(...),
            # which wouldn't work (see my comment below), so...
            return "Hello"  # o.isoformat() 
        return super(DecimalEncoder, self)._iterencode(o, markers)
"""
# Create your views here.
def index(request):
    return HttpResponse("Hello, API.")

@csrf_exempt  # exempt csrf temporarily 
def usertrack(request, page_num="1", page_size="20", search_str=None, order_by='pk'):
    lModel = USER_TRACKED
    lDatabase = 'inguser'

    if request.META.get('CONTENT_TYPE'): content_type = request.META['CONTENT_TYPE']
    
    if request.method == 'GET':
        logger.debug("page_num=" + page_num)
        logger.debug("page_size=" + page_size)
        logger.debug('request.GET:')
        # logger.debug(request.GET.items())
        # logger.debug(request.body)
        logger.debug(request.GET)
        if search_str: logger.debug("search_str=" + search_str)
        
        logger.debug("order_by=" + order_by)
        
        lModel = lModel.objects.using(lDatabase).all()  # get the queryset
        if search_str:  # need to work on search, it could be better.
            try:
            # inner_qs=user.objects.using(lDatabase).filter(user_name__contains=searchStr)
            # lModel=lModel.objects.using(lDatabase).filter(pk__in=inner_qs).order_by(order_by)[(page_num-1)*page_size:page_size]
                logger.debug('Search string :' + search_str)
                lModel = lModel.filter(user__user_name__icontains=search_str)
                # lMode=lModel.objects.using('inguser').raw('SELECT A.TRACK_ID,  A.APPLICATION_ID,A.START_DATE,A.END_DATE,A.NUM_COMPUTERS,A.ACTIVE,A.USER_ID,B.USERNAME as USER_NAME FROM IU_USER_TRACKED A, IU_USER B where a.USER_ID=b.USER_ID')
            except Exception as e:
                logger.debug(e)
         
        
        total_row_count = lModel.count()
        page_num = int(page_num)
        page_size = int(page_size)
        total_pages = int(math.ceil(decimal.Decimal(total_row_count) / decimal.Decimal(page_size)))
        
        logger.debug('total_row_count=' + total_row_count)
        logger.debug('page_num=' + page_num)
        
        try:
            lModel = lModel.order_by(order_by)[(page_num - 1) * page_size:page_num * page_size]
            # lModel=lModel.objects.using('inguser').raw('SELECT A.TRACK_ID,  A.APPLICATION_ID,A.START_DATE,A.END_DATE,A.NUM_COMPUTERS,A.ACTIVE,A.USER_ID,B.USERNAME as USER_NAME FROM IU_USER_TRACKED A, IU_USER B where a.USER_ID=b.USER_ID')
            logger.debug('lModel processed')
            for x in lModel:
                logger.debug(x.user_name)
        except:
            logger.debug('Error getting objects from ' + str(lModel))
        
        s = serializers.serialize('json', lModel, use_natural_foreign_keys=True)  # not sure what will happen to decimal field here, keep an eye
        # s=s+',{"total_row_count":'+str(total_row_count)+'}'
        # We add some meta data to help UI with pagination
        meta = {}
        meta['total_row_count'] = total_row_count
        meta['page_num'] = page_num
        meta['total_pages'] = total_pages
        meta['page_size'] = page_size
        meta['order_by'] = order_by
        meta = json.dumps(meta)
        s = '{"meta":' + meta + ',"data":' + s + '}'
        
        logger.debug(s)
        
        return HttpResponse(s, content_type='application/json', status=200) 
    
    elif request.method == 'POST':
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = json.loads(request.body)
        else:
            data = request.POST
        
        logger.debug('Incoming data to POST')
        logger.debug(data['fields']) 
        lPk = data.get('pk', 0)  # gets pk from data, 0 if pk is not in data
        if data['fields']: data = data['fields']
        
        # convert user data to USER model instance
        if data['user']: data['user'] = USER(**data['user'])   
        
        # convert application data to APPLICATION model instance
        if data['application']: data['application'] = APPLICATION(**data['application']) 
        
        logger.info('data:')
        logger.info(data)
         
        currRow = lModel(**data)  # convert incoming data to model dictionary
        
        # For Update
        if lPk > 0:  # if pk is already in incoming data then we would make python update instead of insert
            logger.debug('Updating data');
            # currRow=lModel.objects.using(lDatabase).get(	pk=lPk)
            currRow.pk = lPk
            # assigning incoming data to the row that was fetched for update
            # if currRow:
            #    for attr, value in data['fields'].iteritems(): 
            #      setattr(currRow, attr, value)
            # currRow.modified_dt=timezone.now()
            # currRow.modifiedby=lUser
            # logger.debug(currRow)
            # For Insert
            # if incoming data has no pk or if it had pk but if that pk didnt exist in the database for update
        if lPk <= 0:
            logger.debug('Inserting data');
            # currRow=lModel.objects.create(**data)
            # if data.get('pk'):
            #   del data['pk']   # delete so that id is automatically generated
            # if data['fields']: data=data['fields']  #we are interested in fields only. Its common for django serializer to put data in fields object
            # currRow=lModel(**data)
            # logger.debug('currRow')
            # logger.debug(currRow)
            # currRow.created_dt=timezone.now()
            # currRow.createdby=lUser
        
        try:
            # currRow.full_clean().using(lDatabase)
            logger.debug('Saving')
            currRow.save(using=lDatabase)
            currRow = lModel.objects.using(lDatabase).get(pk=currRow.pk)  # we retrieve the row back so that we get correct formatting for serialization
            # msgOut.hasSucceeded=True
            # msgOut.pk=currRow.pk
            # msgOut.addMessage(unicode(_('Saved Successfully')),'SavedSuccess')
            # except IntegrityError as e:
            # 	   msgOut.hasSucceeded=False
            # 	   msgOut.addMessage(str(e),'IntegrityError')
            # 	   logger.debug(e)
            
            # s = serializers.serialize("json", [currRow,])  #use serializer for django model
            # logger.debug(currRow._meta.get_all_field_names())
            logger.debug(data)
            logger.debug(currRow)
            # Unable to serialize currRow to json so using data instead
            # s=json.dumps(data,use_decimal=True)
            
            s = serializers.serialize('json', [currRow, ], use_natural_foreign_keys=True)  # not sure what will happen to decimal field here, keep an eye
            
            return HttpResponse(s, content_type='application/json', status=200)
        except ValidationError as e:
            logger.debug('Exception Validation Error:')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)
        except Exception as e:
            logger.debug('Exception: ')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)
        
    elif request.method == 'DELETE':
        logger.debug('Deleting')
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = json.loads(request.body)
        else:
            data = request.POST
       
        lPk = data.get('pk', 0)  # gets pk from data, 0 if pk is not in data
        logger.info('data:')
        logger.info(data)
        if not lPk: 
            logger.debug('No pk was provided to delete')
            # return

      
        try:
            lModel.objects.using(lDatabase).get(pk=lPk).delete()
            return HttpResponse("", content_type='application/json', status=204)  # 204 NO Content, ie delete was successful
        except Exception as e:
            logger.debug('Exception: ')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)

@csrf_exempt  # exempt csrf temporarily        
def attendee(request,model_name = 'attendeeType', page_num="1", page_size="20", search_str=None, order_by='pk', lDatabase='default'):
    #lDatabase = 'inguser'
    mod = __import__('events.models',fromlist=model_name)
    lModel = getattr(mod,model_name)
    logger.debug('request:')
    logger.debug(request)

    if request.META.get('CONTENT_TYPE'): content_type = request.META['CONTENT_TYPE']
    
    if request.method == 'GET':
        logger.debug("page_num=" + page_num)
        logger.debug("page_size=" + page_size)
        logger.debug('request.GET:')
        logger.debug(request.GET)
        if search_str: logger.debug("search_str=" + search_str)
        logger.debug("order_by=" + order_by)
        lModel = lModel.objects.using(lDatabase).all()  # get the queryset
        if search_str:  # need to work on search, it could be better.
            try:
                logger.debug('Search string :' + search_str)
                if model_name=='attendeeType':
                    lModel = lModel.filter(attendeeType__icontains=search_str)
                elif model_name=='attendee':
                    lModel = lModel.filter(Q(firstName__icontains=search_str)|Q(lastName__icontains=search_str)|Q(email__icontains=search_str))
                    
            except Exception as e:
                logger.debug(e)
        total_row_count = lModel.count()
        page_num = int(page_num)
        page_size = int(page_size)
        total_pages = int(math.ceil(decimal.Decimal(total_row_count) / decimal.Decimal(page_size)))
        #logger.debug('total_row_count=' + str(total_row_count))
        #logger.debug('page_num=' + str(page_num))
        try:
            lModel = lModel.order_by(order_by)[(page_num - 1) * page_size:page_num * page_size]
            
        except:
            logger.debug('Error getting objects from ' + str(lModel))
        
        s = serializers.serialize('json', lModel, use_natural_foreign_keys=True)  # not sure what will happen to decimal field here, keep an eye
        meta = {}
        meta['total_row_count'] = total_row_count
        meta['page_num'] = page_num
        meta['total_pages'] = total_pages
        meta['page_size'] = page_size
        meta['order_by'] = order_by
        meta = json.dumps(meta)
        s = '{"meta":' + meta + ',"data":' + s + '}'
        #logger.debug(s)
        
        return HttpResponse(s, content_type='application/json', status=200) 
    
    elif request.method == 'POST':
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = request.body
            if type(data) is bytes:
                data = json.loads(data.decode())
            else:
                data = json.loads(data)
        else:
            data = request.POST
        
        logger.debug('Incoming data to POST')
        logger.debug(data['fields']) 
        lPk = data.get('pk', 0)  # gets pk from data, 0 if pk is not in data
        if data.get('fields'): data = data['fields']
        logger.info('data:')
        logger.info(data)
        
        
        if data.get('attendeeType'):
            logger.debug(data)
            at = attendeeType(**data['attendeeType'])
            data['attendeeType'] = at 
 
        currRow = lModel(**data)  # convert incoming data to model dictionary
        
        # For Update
        if lPk > 0:  # if pk is already in incoming data then we would make python update instead of insert
            logger.debug('Updating data')
            currRow.pk = lPk
        if lPk <= 0:
            logger.debug('Inserting data')
        
        try:
            logger.debug('Saving')
            currRow.save(using=lDatabase)
            #currRow = lModel.objects.using(lDatabase).get(pk=currRow.pk)  # we retrieve the row back so that we get correct formatting for serialization
            logger.debug(data)
            logger.debug(currRow)
            
            s = serializers.serialize('json', [currRow, ], use_natural_foreign_keys=True)  # not sure what will happen to decimal field here, keep an eye
            return HttpResponse(s, content_type='application/json', status=200)

        except (ValidationError , Exception) as e:
            logger.debug('Exception handler:')
            logger.debug(e)
            s = json.dumps({"error":e})
            return HttpResponse(s, content_type='application/json', status=400)
        
    elif request.method == 'DELETE':
        logger.debug('Deleting')
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = request.body
            if type(data) is bytes:
                data = json.loads(data.decode())
            else:
                data = json.loads(data)
        else:
            data = request.POST
       
        lPk = data.get('pk', 0)  # gets pk from data, 0 if pk is not in data
        logger.info('data:')
        logger.info(data)
        if not lPk: 
            logger.debug('No pk was provided to delete')
            # return

      
        try:
            lModel.objects.using(lDatabase).get(pk=lPk).delete()
            return HttpResponse("", content_type='application/json', status=204)  # 204 NO Content, ie delete was successful
        except Exception as e:
            logger.debug('Exception: ')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)

@csrf_exempt  # exempt csrf temporarily
def memberCategory(request, page_num="1", page_size="20", search_str=None, order_by='pk', lDatabase='default'):
    lModel = '' #MEMBER_CATEGORY
    #lDatabase = 'inguser'

    if request.META.get('CONTENT_TYPE'): content_type = request.META['CONTENT_TYPE']
    
    if request.method == 'GET':
        logger.debug("page_num=" + page_num)
        logger.debug("page_size=" + page_size)
        logger.debug('request.GET:')
        logger.debug(request.GET)
        if search_str: logger.debug("search_str=" + search_str)
        logger.debug("order_by=" + order_by)
        lModel = lModel.objects.using(lDatabase).all()  # get the queryset
        if search_str:  # need to work on search, it could be better.
            try:
                logger.debug('Search string :' + search_str)
                lModel = lModel.filter(category__icontains=search_str)
            except Exception as e:
                logger.debug(e)
        total_row_count = lModel.count()
        page_num = int(page_num)
        page_size = int(page_size)
        total_pages = int(math.ceil(decimal.Decimal(total_row_count) / decimal.Decimal(page_size)))
        logger.debug('total_row_count=' + str(total_row_count))
        logger.debug('page_num=' + str(page_num))
        try:
            lModel = lModel.order_by(order_by)[(page_num - 1) * page_size:page_num * page_size]
            logger.debug('lModel processed')
        except:
            logger.debug('Error getting objects from ' + str(lModel))
        
        s = serializers.serialize('json', lModel, use_natural_foreign_keys=True)  # not sure what will happen to decimal field here, keep an eye
        meta = {}
        meta['total_row_count'] = total_row_count
        meta['page_num'] = page_num
        meta['total_pages'] = total_pages
        meta['page_size'] = page_size
        meta['order_by'] = order_by
        meta = json.dumps(meta)
        s = '{"meta":' + meta + ',"data":' + s + '}'
        logger.debug(s)
        
        return HttpResponse(s, content_type='application/json', status=200) 
    
    elif request.method == 'POST':
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = request.body
            if type(data) is bytes:
                data = json.loads(data.decode())
            else:
                data = json.loads(data)
        else:
            data = request.POST
        
        logger.debug('Incoming data to POST')
        logger.debug(data['fields']) 
        lPk = data.get('pk', 0)  # gets pk from data, 0 if pk is not in data
        if data['fields']: data = data['fields']
        
        logger.info('data:')
        logger.info(data)
         
        currRow = lModel(**data)  # convert incoming data to model dictionary
        
        # For Update
        if lPk > 0:  # if pk is already in incoming data then we would make python update instead of insert
            logger.debug('Updating data')
            currRow.pk = lPk
        if lPk <= 0:
            logger.debug('Inserting data')
        
        try:
            logger.debug('Saving')
            currRow.save(using=lDatabase)
            currRow = lModel.objects.using(lDatabase).get(pk=currRow.pk)  # we retrieve the row back so that we get correct formatting for serialization
            logger.debug(data)
            logger.debug(currRow)
            
            s = serializers.serialize('json', [currRow, ], use_natural_foreign_keys=True)  # not sure what will happen to decimal field here, keep an eye
            return HttpResponse(s, content_type='application/json', status=200)

        except ValidationError as e:
            logger.debug('Exception Validation Error:')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)
        except Exception as e:
            logger.debug('Exception: ')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)
        
    elif request.method == 'DELETE':
        logger.debug('Deleting')
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = request.body
            if type(data) is bytes:
                data = json.loads(data.decode())
            else:
                data = json.loads(data)
        else:
            data = request.POST
       
        lPk = data.get('pk', 0)  # gets pk from data, 0 if pk is not in data
        logger.info('data:')
        logger.info(data)
        if not lPk: 
            logger.debug('No pk was provided to delete')
            # return

      
        try:
            lModel.objects.using(lDatabase).get(pk=lPk).delete()
            return HttpResponse("", content_type='application/json', status=204)  # 204 NO Content, ie delete was successful
        except Exception as e:
            logger.debug('Exception: ')
            logger.debug(e)
            s = json.dumps({"error":str(e.message)})
            return HttpResponse(s, content_type='application/json', status=400)

def paymentCharge(request):
    #response_html = 'events/attendee.html'
    #logger.debug('Attendee view')
    if request.META['CONTENT_TYPE']: content_type = request.META['CONTENT_TYPE']
    if request.method == 'POST':
        data = {}
        if 'x-www-form-urlencoded' in content_type or 'application/json' in content_type:
            data = request.body
            if type(data) is bytes:
                data = json.loads(data.decode())
            else:
                data = json.loads(data)
        else:
            data = request.POST
        # Set your secret key: remember to change this to your live secret key in production
        # See your keys here https://dashboard.stripe.com/account/apikeys
        
        # Test
        stripe.api_key = "sk_test_MOTIi9CNcj88J1V9Nys8V6am"  
        
        #live
        #stripe.api_key = "sk_live_0OZFn5fmVgdv2UJa8hHcQiDs"  #Live

        #post = post.decode()
        logger.debug(data) 
        # Get the credit card details submitted by the form
        token = data.get('stripeToken')
        amount = data.get('amount',0)
        email = data.get('stripeEmail',None)
        description = data.get('description','dapps.us')
        
        # Create the charge on Stripe's servers - this will charge the user's card
        try:
            charge = stripe.Charge.create(
                                          amount=amount, # amount in cents, again
                                          currency="usd",
                                          source=token,
                                          receipt_email=email,
                                          description=description
                                          )
            msg='Card was successfully charged'
            status=200
        

        except (stripe.error.CardError,stripe.error.InvalidRequestError) as e:
            
            
            logger.debug(e.json_body)
            err = e.json_body.get('error')
            msg = err.get('message','CardError or InvalidRequestError at server')
            #logger.debug(msg)
            status=400
            return HttpResponse(json.dumps({'message':msg}), content_type='application/json', status=status)
        
        logger.debug(msg)
        logger.debug(status)
        return HttpResponse(json.dumps({'message':msg}), content_type='application/json', status=status)
