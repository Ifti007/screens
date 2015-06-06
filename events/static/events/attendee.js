(function(){


var app=angular.module('event-attendee', ['ui.bootstrap','ngCookies']);
app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    });
    

app.controller('add-controller', function($scope,$http,$cookies,$log) {
	$scope.apiUrlAttendeeType='/api/events/attendeeType/';
	$scope.apiUrl='/api/events/attendee/';
	$scope.chargeUrl='/events/attendee/charge/';
	//$scope.publishableKey='pk_test_wL6PEnRCuKLkocmlHOAHLINg'; --Test
	$scope.publishableKey='pk_live_daNgar96mhiWN4LWfpPOsxYO';  //Live
	$scope.add = function(){
		$scope.item={}
		$scope.item.amount=0;
		$scope.item.fields={};
		$scope.payButtonText='Save';
		$scope.isSuccess=false;
		$scope.message=null;
		$scope.item.message=null;
		$scope.item.fields.attendeeType={};
	}
	$scope.add();
	
    //API get attendee type list
    $scope.getAttendeeTypes = function(){
       $scope.attendeeTypes = [];
   	   var url=$scope.apiUrlAttendeeType;
   	$http.get(url).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
           $scope.attendeeTypes=[];
	            $scope.attendeeTypes=data.data;

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
   	};
   	
   	$scope.getAttendeeTypes();
   	
	$scope.onAttendeeTypeSelect=function($item, $model, $label) {
		 console.log("onAttendeeTypeSelect($item, $model, $label) ");
		 console.log($item);
		 $scope.item.fields.attendeeType.pk=$item.pk;
		 $scope.item.fields.attendeeType.name = $item.fields.name;
		 $scope.item.amount = $item.fields.price;
		 console.log($item);
		 console.log($model);
		 //console.log($label);
		 
		};
		
	$scope.save = function(){
		//$scope.pay($scope.item.amount);
		if ($scope.item.amount > 0) 
			$scope.pay($scope.item.amount);
		else
			$scope.registerAttendee();
	};
	
	$scope.registerAttendee = function(){
		$log.debug('registering attendee');
		$scope.payButtonText='Registering';
		$log.debug($scope.apiUrl);
		
		
		var request = $http({
			method:'post',
            url: $scope.apiUrl,
            headers : { "X-CSRFToken":$cookies.get('csrftoken'),'Content-Type': 'application/json' } ,  //,"X-CSRFToken":this.csrfToken
            //headers: {"X-CSRFToken":$cookies.get('csrftoken'),'Content-Type':'application/x-www-form-urlencoded'},
            data: $scope.item
            });
		
		request.success(function(result,status) {
			$log.debug('post success registration');
			$log.debug(result);
			$log.debug(status);
			if (status==200)
				{
				$scope.isSuccess=true;
				$scope.payButtonText = "Attendee Registered";
				$scope.result = result;

				}
			else {
				$scope.isSuccess=false;
				$scope.message = "Attendee Not Registered";
			}
		}).error(function(result,status) {
          $scope.isSuccess=false;
          $scope.message = "Attendee Not Registered";
		}); 

	};


	$scope.pay = function(amount){
		$scope.payButtonText='Charging';
		var handler = StripeCheckout
		.configure({
			key : $scope.publishableKey,
			image : '/events/static/events/open_logo.png',
			token : function(token) {
				$log.debug('inside token');
				$log.debug(token);
				amount = amount * 100 //to convert to cents 
				$scope.item.stripeToken=token.id;
				$scope.item.stripeEmail=token.email;
				var data = {};
				data.amount=amount;
				data.stripeToken=token.id;
				data.stripeEmail=token.email;
				
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
						$scope.isSuccess=true;
						$scope.registerAttendee();
						$scope.payButtonText = "Amount Charged";
						$scope.item.message = "Amount Charged";
						$scope.result = result;

						}
					else {
						$scope.isSuccess=false;
						$scope.item.message = "Amount Not Charged and attendee is not registered";
					}
				}).error(function(result,status) {
                  $scope.isSuccess=false;
                  $scope.item.message = "Amount Not Charged and attendee is not registered";
				});
				// Use the token to create the charge with a server-side script.
				// You can access the token ID with `token.id`
			}
		});
		$log.debug(handler);
					handler
							.open({
								name : 'dapps.us Events',
								description : 'Open Forum 2015 Registration',
								amount : $scope.item.amount * 100
							});
					
				};
				
});

// Sets List header, should be able to save code in html file

app.controller('list-controller', function($scope,$http,$modal,$log) {
	$scope.list=[];
	$scope.listAttendeeType=[];
	$scope.apiUrl='/api/events/attendee/';
	$scope.apiUrlAttendeeType='/api/events/attendeeType/';
	$scope.apiUrlBadgeReprint='/events/badgereprint/'
	$log.debug('logging');
	
   // Sets List header, should be able to save code in html file
   $scope.itemHeaders=[
                       {title:"id",field:"pk"}
                       ,{title:"First Name",field:"fields.firstName",tooltip:"Attendee First Name"}
                       ,{title:"Last Name",field:"fields.lastName",tooltip:"Attendee Last Name"}
                       ,{title:"Attendee Type",field:"fields.attendeeType.name",tooltip:"Attendee Type"}
                       ,{title:"Company",field:"fields.company",tooltip:"Company"}
                       ,{title:"Title",field:"fields.title",tooltip:"Title"}
                       ,{title:"Email",field:"fields.email",tooltip:"Email"}
                       ,{title:"Badge Print Date",field:"fields.badgePrintDate",tooltip:"Badge print date if baage is printed"}
                       ,{title:"Badge Pick Date",field:"fields.badgePickDate",tooltip:"Badge pick up date"}
                       //,{title:"Registration Date",field:"fields.registrationDate",tooltip:"Registration Date"}
                       ];

   $scope.sort=function(header){
   	   $scope.sortPredicate = header.field;
   	   $scope.sortReverse = ! $scope.sortReverse;
   };
   /* Pagination */
   $scope.itemsPerPage=10;
   $scope.itemsPerPageOptions=[5,10,15,20,25,100];

   $scope.pageChanged = function() {
    $log.debug('Page changed to: ' + $scope.currentPage);
    $scope.getList($scope.currentPage);
   };

   
   /* Alerts */
   $scope.alerts = [
     { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
     { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
      ];
   $scope.alerts = [];
   $scope.addAlert = function(msg,type) {
	      				type = type || 'info';
                          $scope.alerts.push({msg: msg,type:type});
                          };

   $scope.closeAlert = function(index) {
       $scope.alerts.splice(index, 1);
       };
    
    /* End Alerts */
    /*API reprint badge */
       $scope.badgeReprint = function(item){
    	   $log.debug('Reprint Badge');
    	   $log.debug($scope.apiUrlBadgeReprint+item.pk);
   		var request = $http({
			method:'post',
            url: $scope.apiUrlBadgeReprint+item.pk+'/',
            headers : { 'Content-Type': 'application/json' } ,  //,"X-CSRFToken":this.csrfToken
            //headers: {"X-CSRFToken":$cookies.get('csrftoken'),'Content-Type':'application/x-www-form-urlencoded'},
            data: $scope.item
            });
		
		request.success(function(result,status) {
			if (status==200)
				{
				item.fields.badgePrintDate=null;
				}
			else {
			    $log.debug('Unable to set badge to reprint');
			}
		}).error(function(result,status) {
			$log.debug('Unable to set badge to reprint');
		}); 
    	   
       };
       
     /*API: Get the data */
    
   $scope.getList=function(pageNum){
	   pageNum = pageNum || 1;
   $scope._isBusy=true;  //Busy indicator
   var url=$scope.apiUrl+'page/'+pageNum||1;
    if ($scope.itemsPerPage)
     {url=url+'/size/'+$scope.itemsPerPage;}
    if ($scope.searchStr)
    {url=url+'/search/'+$scope.searchStr;} 
    $log.debug('url='+url);
    var request = $http({
    				method:'get',
                    url: url
                    //transformRequest: transformRequestAsFormRequest,
                    //headers : { 'Content-Type': 'application/json' } ,  //,"X-CSRFToken":this.csrfToken
                    //headers: {"X-CSRFToken":this.csrfToken},x-www-form-urlencoded
                    
                    //also you can send parameters instead of complex url, good for api calls
                    /*params: { page : pageNum || 1 ,  
                              perpage : $scope.itemsPerPage || '' ,
                              searchstr : $scope.searchStr ||'%',
                              orderby : $scope.orderBy || 'pk'} */
                    });
    request.success(function(result,status){
       $log.debug('Status = '+status.toString());
       $log.debug(result);
       //$log.debug(JSON.stringify(data));
        if (status==200)
          {
            $scope.list=[];
            $scope.list=result.data;
            $scope.totalItems = result.meta.total_row_count;
            $scope.currentPage = result.meta.page_num;
            $scope.itemsPerPage = result.meta.page_size;
            $scope.sortPredicate = result.meta.order_by;

          }  
        $scope._isBusy=false;   
        }).error(function() {$scope._isBusy=false; });
    
    //$scope.getList();

    
   };


   
   });






})();
      
