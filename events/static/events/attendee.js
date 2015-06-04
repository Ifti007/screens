(function(){


var app=angular.module('event-attendee', ['ui.bootstrap']);
app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    });
    


// Sets List header, should be able to save code in html file

app.controller('listController', function($scope,$http,$modal,$log) {
	$scope.list=[];
	$scope.listAttendeeType=[];
	$scope.apiUrl='/api/event/attendee/';
	$scope.apiUrlAttendeeType='/api/event/attendeetype/';
	$log.debug('logging');
	
   // Sets List header, should be able to save code in html file
   $scope.itemHeaders=[
                       {title:"Name",field:"fields.member.name",tooltip:"Attendee Name"}
                       ,{title:"Attendee Type",field:"fields.attendeeType.attendeeType",tooltip:"Attendee Type"}
                       ,{title:"Company",field:"fields.member.company",tooltip:"Company"}
                       ,{title:"Title",field:"fields.member.position",tooltip:"Title"}
                       ,{title:"Email",field:"fields.member.email",tooltip:"Email"}
                       ,{title:"Badge Print Date",field:"fields.badgePrintDate",tooltip:"Badge print date if baage is printed"}
                       ,{title:"Badge Pick Date",field:"fields.badgePickDate",tooltip:"Badge pick up date"}
                       ,{title:"Registration Date",field:"fields.registrationDate",tooltip:"Registration Date"}
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
   $scope.addAlert = function(msg,type='info') {
                          $scope.alerts.push({msg: msg,type:type});
                          };

   $scope.closeAlert = function(index) {
       $scope.alerts.splice(index, 1);
       };
    
    /* End Alerts */
    /*API: Get the data */
    
   $scope.getList=function(pageNum=1){
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

    
   };
   
   /*API: Save Data */
   $scope.save=function(item){
     item._isBusy=true;
     var currItem=angular.copy(item._edits);
     //currItem.pk=item.pk; //inject pk here so that it can be saved in database
     $log.debug('Saving');
     $log.debug(currItem);
 
     var request = $http({
    				method:'post',
                    url: $scope.apiUrl,
                    //transformRequest: transformRequestAsFormRequest,
                    headers : { 'Content-Type': 'application/json','charset':'utf-8'},
                    //contentType: 'application/json; charset=utf-8',
                    //,"X-CSRFToken":this.csrfToken } ,
                    //headers: {"X-CSRFToken":this.csrfToken},x-www-form-urlencoded
                    data: item._edits
                    });
     request.success(function(data,status){
     $log.debug('status='+status);
        // Reset line item with 
        //$scope.addAlert('Saved','success');
        $scope.addAlert('Saved','success');
        currItem=angular.copy(item._edits.fields)
        $log.debug('currItem');
        $log.debug(currItem);
        $log.debug('data.fields:');
        $log.debug(data[0].fields);

        if (data[0].fields)
         {
          $log.debug('In data.fields');
          $log.debug(item.fields);
          item.fields=data[0].fields;
          item.pk=data[0].pk;
         }
        else
         {
          $log.debug('In else data.fields');
          $log.debug(currItem);
          item.fields=currItem;
         }
         $log.debug(data);
         item._isBusy=false;
         item._addMode=false;
         item._editMode=false;
         item._edits={};

        })
        .error(function(data,status)
          {
           item._isBusy=false;
           $log.debug('save error: '+data);
           $log.debug(data);
           $scope.addAlert('Error Saving: '+data.error||'','danger');
          });
     };
     
     
     /*API: Delete Item */
   $scope.deleteItem=function(item){
     currItem=item;
           item._isBusy=true;
           $log.debug('Deleting');
            var request = $http({
    				method:'delete',
                    url: $scope.apiUrl,
                    //transformRequest: transformRequestAsFormRequest,
                    headers : { 'Content-Type': 'application/json',"X-CSRFToken":this.csrfToken } ,
                    //headers: {"X-CSRFToken":this.csrfToken},x-www-form-urlencoded
                    data: currItem
                    });
     		request.success(function(data,status){
     		$log.debug('delete return http status='+status);
     		// Reset line item with 
     		item._isBusy=false;
     		$log.debug($scope.list.indexOf(item));
     		$scope.list.splice($scope.list.indexOf(item),1);
     		}).error(function(){item._isBusy=false;});
         };

    $scope.edit = function(item){
     var currItem=angular.copy(item);
     item._edits={};
     item._edits=currItem;
     $log.debug('item._edits');
     $log.debug(item._edits);
     item._editMode=true;
    };    

    $scope.undo = function(item){
    item._edits={};
    item._editMode=false;
    if (item._addMode){
       index = $scope.list.indexOf(item);
       $scope.list.splice(index,1);
       item._addMode=false;
       }
     };
     
    $scope.revert = function(item){
     item._edits={};
     item._editMode=false;
     };    
     
    $scope.add = function(){
      //push item being edited to a list to retrieve later if user cancels the edit. Use pk to retrieve the item later on
     $scope._addMode=true;
     
     item._addMode=true; 
     item._edits={};
     item._edits.pk=0;
     item._edits.fields={};
     item.pk=0
    // $scope.sortPredicate = item.pk;
    // $scope.sortReverse = false;

     };
     
     //API get attendee type list
     $scope.getListAttendeeType=function(){
    	   
    	   var url=$scope.apiUrlAttendeeType;
    	   $log.debug('calling url'+url);
    	   var request = $http({
    	    				method:'get',
    	                    url: url
    	                    });
    	    request.success(function(result,status){
    	       log.debug(JSON.stringify(result));
    	        if (status==200)
    	          {
    	            $scope.listAttendeeType=[];
    	            $scope.listAttendeeType=result.data;
    	          }  
    	        });            
    	   };

     
   //$scope.getList();
    $log.debug('About to call get list');
    $scope.getListAttendeeType();
   
   });






})();
      
