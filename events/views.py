from django.shortcuts import render,render_to_response, RequestContext
from django.views.decorators.http import require_http_methods
from django.template.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.exceptions import ValidationError
from django.http import HttpResponse

from . import models

import logging
import stripe
import json
from django.utils import timezone
#import exceptions

logger = logging.getLogger('events')

def index(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('events/events.html')
    return HttpResponse("Hello, world.")

def badges(request):
    
    #data = attendee.objects.exclude(badgePrintDate__isnull=True).exclude(badgePrintDate__exact='')
    data={}
    data = models.attendee.objects.filter(badgePrintDate__isnull=True)
    #logger.debug('Badges data:')
    #logger.debug(data)
    for s in data:
        s.badgePrintDate = timezone.now()
        s.save()
    response_html = 'events/badges.html'
    
    #logger.debug('Badges view')
    if request.method == 'GET':
        return render_to_response(response_html,{'data':data}
                                  ,context_instance=RequestContext(request))


def attendee(request):
    response_html = 'events/attendee.html'
    logger.debug('Attendee view')
    if request.method == 'GET':
        return render_to_response(response_html,context_instance=RequestContext(request))

def attendeeCharge(request):
    response_html = 'events/attendee.html'
    logger.debug('Attendee view')
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
        stripe.api_key = "sk_test_MOTIi9CNcj88J1V9Nys8V6am"
        #post = post.decode()
        logger.debug(data) 
        # Get the credit card details submitted by the form
        token = data.get('stripeToken')
        amount = data.get('amount',0)
        
        # Create the charge on Stripe's servers - this will charge the user's card
        try:
            charge = stripe.Charge.create(
                                          amount=amount, # amount in cents, again
                                          currency="usd",
                                          source=token,
                                          description="charge for amount"
                                          )
            msg='Card was successfully charged'
            status=200

        except (stripe.error.CardError,stripe.error.InvalidRequestError) as e:
            msg = 'error  occured when charging card'
            logger.debug(msg)
            status=400
            return HttpResponse(json.dumps({'message':msg}), content_type='application/json', status=status)
        
        logger.debug(msg)
        logger.debug(status)
        return HttpResponse(json.dumps({'message':msg}), content_type='application/json', status=status)
            
def attendeeType(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('events/attendeetype.html')

def memberCategory(request):
    #return render(request, 'usertrack/usertrack.html')
    return render_to_response('events/membercategory.html')
