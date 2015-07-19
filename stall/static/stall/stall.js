(function(){


var app=angular.module('stall', ['ui.bootstrap','ngCookies']);
app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    });

app.controller('main', function($scope,$http,$cookies,$log,$modal) {
	$scope.apiUrlAttendeeType='/api/events/attendeeType/';
	$scope.apiUrl='/api/stall/';
	$scope.chargeUrl='/api/charge/';
	$scope.publishableKey='pk_test_wL6PEnRCuKLkocmlHOAHLINg'; //Test
	//$scope.publishableKey='pk_live_daNgar96mhiWN4LWfpPOsxYO';  //Live
	
	$scope.totalAmount = 0.00;
	
	$scope.items=[{id:1,descr:'Fruit Chaat',price:6,qty:0}
			,{id:2,descr:'Soda',price:1.50,qty:0}
			,{id:3,descr:'Chips',price:1.50,qty:0}
			,{id:4,descr:'Dahi Bhalla',price:6,qty:0}]

	$scope.qtyPlus = function (item){
		$log.debug('in qtyPlus');
		$log.debug(item);
		item.qty = item.qty+1;
		$scope.calculateTotal();
	};

	$scope.qtyMinus = function (item){
		$log.debug('in qtyMinus');
		$log.debug(item);
		item.qty = item.qty-1;
		$scope.calculateTotal();
	};

	
	$scope.calculateTotal = function(){
		var tot=0;
		$log.debug('in calculate Total');
		

		for (var i=0; i< $scope.items.length; i++){
			tot = tot + $scope.items[i].price * $scope.items[i].qty; 
		}
		$log.debug('tot'+tot.toString())
		$scope.totalAmount = tot;
	};

	$scope.open = function (amount) {

	    var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'chargeModal',
	      controller: 'chargeModalCtrl',
	      resolve: {
	        amount: function () {
	          return $scope.totalAmount;
	        }
	      }
	    });

	    modalInstance.result.then(function (result) {
	    	$log.debug('modal instanc result');
	    	$log.debug(result);
	    	if (result){
	    	  $scope.lastOrder=[];
	    	  for (var i=0; i< $scope.items.length; i++){
	    		  if ($scope.items[i].qty>0)
	    			  {
	    			  $scope.lastOrder.push($scope.items[i].qty.toString()+' '+$scope.items[i].descr)
	    			  $scope.items[i].qty=0;
	    			  }
	  			}
	    	  $scope.calculateTotal();
	    	  }
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	
});

app.controller('chargeModalCtrl', function ($scope, $modalInstance,$log,$http,$cookies,amount) {

	  $scope.track='';
	  $scope.amount=amount;
	  
	  $scope.chargeUrl='/api/payments/charge/';
	  //$scope.chargeUrl='/events/attendee/charge/';

	  $scope.charge = function (amount) {
		$log.debug('track = '+$scope.track);
		var track = $scope.track
		var t1 = track.substring(track.indexOf('%')+2, track.indexOf('?')-1);  //Track is between %B and at '?
		$scope.cardNumber = t1.split('^')[0];   //Field seperator is ^
		$scope.track='';
	  };
	  
	  $scope.submitPayment = function() {
		  $scope.paymentSuccess='';
		  $scope.paymentErrors='';
		  if ($scope.testMode)
		  {
		    $scope.publishableKey='pk_test_wL6PEnRCuKLkocmlHOAHLINg'; //Test
		  }
		  else
		  {
			  $scope.publishableKey='pk_live_daNgar96mhiWN4LWfpPOsxYO';  //Live
		  }
		  
		  $log.debug($scope.publishableKey)

		  Stripe.setPublishableKey($scope.publishableKey);
		  $log.debug('creating token');
		  Stripe.card.createToken({
			  number: $scope.cardNumber,
			  cvc: $scope.cvc,
			  exp_month: $scope.expMonth,
			  exp_year: $scope.expYear
			}, $scope.stripeResponseHandler);
	  };
	  
	  $scope.stripeResponseHandler = function (status, response) {
		  $log.debug('stripeResponseHandler');
		  $log.debug(response);
		  if (response.error) {
			  $log.debug(response.error);
			  $scope.paymentErrors = response.error.message;
			  $log.debug(response.error);
		    
		  } 
		  else {
		    // response contains id and card, which contains additional card details
		    var token = response.id;
			var amount = $scope.amount * 100 //to convert to cents 
			var data = {};
			data.amount = amount;
			data.stripeToken = token;
			data.stripeEmail = $scope.email;
			data.description = 'dapps.us stalls' 
			
			var request = $http({
				method:'post',
                url: $scope.chargeUrl,
                headers : { "X-CSRFToken":$cookies.get('csrftoken'),'Content-Type': 'application/json' } ,  //,"X-CSRFToken":this.csrfToken
                //headers: {"X-CSRFToken":$cookies.get('csrftoken'),'Content-Type':'application/x-www-form-urlencoded'},
                data: data
                });
			request.success(function(result,status) {
				$log.debug('post success');
				$log.debug(result);
				$log.debug(status);
				if (status==200)
					{
					$scope.paymentSuccess = result.message;
					$modalInstance.close(true);

					}
				else {
					
					$scope.paymentErrors = result.message;
				}
			}).error(function(result,status) {
              $scope.paymentErrors = result.message;
			});


			
		  }
		};

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	});

})();