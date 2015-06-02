(function(){


var app=angular.module('eventApp', ['ui.bootstrap']);
app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    });
    


// Sets List header, should be able to save code in html file

app.controller('attendeeController', function($scope,$http,$modal) {
	var members=[
	             {memberId:2742669,category:"Member",name:"Imam, Mohsin",phone:"9257086071",company:"Google",email:"mohsin.imam@gmail.com",position:"Enterprise Sales Manager",expDate:"09/21/2014",daysDue:236,address:"49002 Cinnamon Fern Cmn, Unit 432, Fremont, CA, 94539, USA",spouse:"Khan, Drakshan"}
	             ,{memberId:2749617,category:"Member",name:"Naseer, Moez",phone:"4088364751",company:"OPEN Silicon Valley",email:"mnaseer@gmail.com",position:"IT Co-Chair",expDate:"1/21/2013",daysDue:366,address:"1401 Red Hawk, O-305, Fremont, CA, 94538, USA"}
	             ,{memberId:2755826,category:"Charter Member",name:"Abbasi, Sohaib",phone:"6503855280",company:"Informatica",email:"sohaib.abbasi@informatica.com",expDate:"12/31/2013",daysDue:366}		
	             ,{memberId:2755827,category:"Charter Member",name:"Abdul, Bari",phone:"5103641870",company:"Google",email:"bari.abdul@wharton.upenn.edu",expDate:"12/31/2013",daysDue:366,address:"323 pilgrim loop, fremont, CA, 94539, USA"}
	             ,{memberId:2756787,category:"Student Member",name:"Qayyum, Umair",phone:"8122198954",company:"McAfee",email:"umairqayyum@gmail.com",position:"Product Marketing",expDate:"2/25/2011",daysDue:366,address:"1999 Larsen Place, Santa Clara, CA, 95051, USA"}	
	             ,{memberId:2757030,category:"Student Member",name:"Zaidi, Abbas",phone:"4086579395",	company:"HyperBreed.com",email:"buzzaz@gmail.com",position:"Director of Product Development",expDate:"3/9/2016",address:"749 27th St, San Francisco, CA, 94131, USA",spouse:"Haider, Ferman"}
	             ,{memberId:2756327,category:"Non-Member",name:"Chughtai, Laiq",phone:"4084314750",email:"laiq_chughtai@hotmail.com"}	
	             ,{memberId:2756328,categor:"Non-Member",name:"Chui, Candace",email:"candacechui@mushibo.com"}	
	             ];
    var attendeeType=[
       	              {typeId:0,attendeeType:"Attendee",price:100}
       	              ,{typeId:1,attendeeType:"Member Attendee",price:80}
       	              ,{typeId:2,attendeeType:"Chartered Member",price:0}
       	              ,{typeId:3,attendeeType:"Speaker",price:0}
       	              ,{typeId:4,attendeeType:"Volunteer",price:0}
       	              ,{typeId:5,attendeeType:"Sponsor",price:0}
       	              ,{typeId:6,attendeeType:"Guest",price:0}
       	            ];

    var  payments=[
      	              {paymentId:0,price:100,amountCharged:100,paymentMethod:"Credit Card",receiptEmail:"receipt@email.com",couponCode:""}
      	              ,{paymentId:1,price:80,amountCharged:80,paymentMethod:"Credit Card",receiptEmail:"receipt@email.com",couponCode:""}
      	            ];

	          var attendees=[
	              {attendeeId:1,member:members[0],isBadgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"01/01/2015",attendeeType:attendeeType[0],payment:payments[0]}
	              ,{attendeeId:2,member:members[1],isBadgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[1],payment:payments[1]}
	              ,{attendeeId:3,member:members[2],isBadgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[2]}
	              ,{attendeeId:4,member:members[3],isBadgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[3]}
	              ,{attendeeId:5,member:members[4],isBadgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[4]}
	              ,{attendeeId:6,member:members[5],isBadgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[4]}
	              ,{attendeeId:7,member:members[6],isBadgePrinted:false,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[5]}
	              ,{attendeeId:8,member:members[7],isBadgePrinted:false,badgePrintDate:"",isRegistered:true,registrationDate:"05/10/2015",attendeeType:attendeeType[6]}
	              ];

	          

	          
	         	              

	

	$scope.list=attendees;
	
   // Sets List header, should be able to save code in html file
   $scope.itemHeaders=[
                       //{title:"ID",field:"trackedUserId"},
                       {title:"Attendee Type",field:"attendeeType.attendeeType",tooltip:"Either attendee is a vendor, regular, member attendee,speaker, panelist, volunteer"}
                       ,{title:"Name",field:"member.name"}
                       ,{title:"Company",field:"member.company"}
                       ,{title:"Membership Type",field:"member.category"}
                       ,{title:"Membership Expired",field:"member.expDate"}
                       //,{title:"Registered",field:"fields.isRegistered",tooltip:"Already registered for the event."}
                       ,{title:"Registration Date",field:"registrationDate",tooltip:"Date attendee registered for the event."}
                       //,{title:"Badge Printed",field:"fields.isBadgePrinted",tooltip:"Has the badge printed for the attendee"}
                       ,{title:"Badge Print Date",field:"badgePrintDate",tooltip:"When the badge was printed."}
                       ,{title:"Amount Charged",field:"payment.amountCharged",tooltip:"Amount charged for the registration."}
                       ];

   $scope.sort=function(header){
   	   $scope.sortPredicate = header.field;
   	   $scope.sortReverse = ! $scope.sortReverse;
   };

   /* Pagination */
   $scope.itemsPerPage=10;
   $scope.itemsPerPageOptions=[5,10,15,20,25,100];

   //$scope.setPage = function (pageNo) {
   //   $scope.currentPage = pageNo;
   // };

   $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
    $scope.getList($scope.currentPage);
   };

    
    /*API: Get the data */
    
   $scope.getList=function(pageNum=1){
    $scope._isBusy=true;  //Busy indicator
    var url='/api/usertrack/page/'+pageNum;
    if ($scope.itemsPerPage)
     {url=url+'/size/'+$scope.itemsPerPage;}
    if ($scope.searchStr)
    {url=url+'/search/'+$scope.searchStr;} 
    console.log('url='+url);
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
       console.log('Status = '+status.toString());
       console.log(result);
       //console.log(JSON.stringify(data));
        if (status==200)
          {
            $scope.list=[];
            $scope.list=result.data;
            //$scope.totalItems = result.meta.total_row_count;;
            //$scope.currentPage = result.meta.page_num;
            //$scope.maxSize = result.meta.page_size;
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
     console.log('Saving');
     console.log(currItem);
     if ($scope.demoMode) {
         item.fields=angular.copy(item._edits.fields)
         console.log(data);
         item._isBusy=false;
         item._addMode=false;
         item._editMode=false;
         item._edits={};
        return;
     }
 
     delete currItem.fields.application_name; // since these are non db fields, they should be taken out at server side though
     delete currItem.fields.user_name;
     var request = $http({
    				method:'post',
                    url: '/api/usertrack/',
                    //transformRequest: transformRequestAsFormRequest,
                    headers : { 'Content-Type': 'application/json',"X-CSRFToken":this.csrfToken } ,
                    //headers: {"X-CSRFToken":this.csrfToken},x-www-form-urlencoded
                    data: currItem
                    });
     request.success(function(data,status){
        console.log('status='+status);
        // Reset line item with 
        //$scope.addAlert('Saved','success');
        $scope.addAlert('Saved','success');
        currItem=angular.copy(item._edits.fields)
        console.log('currItem');
        console.log(currItem);
        console.log('data.fields:');
        console.log(data[0].fields);

        if (data[0].fields)
         {
          console.log('In data.fields');
          console.log(item.fields);
          item.fields=data[0].fields;
          item.pk=data[0].pk;
         }
        else
         {
          console.log('In else data.fields');
          console.log(currItem);
          item.fields=currItem;
         }
         console.log(data);
         item._isBusy=false;
         item._addMode=false;
         item._editMode=false;
         item._edits={};

        })
        .error(function(data,status)
          {
           item._isBusy=false;
           console.log('save error: '+data);
           console.log(data);
           $scope.addAlert('Error Saving: '+data.error||'','danger');
          });
     };
     
     
     /*API: Delete Item */
   $scope.delete=function(item){
     currItem=item;
     var response = $scope.dialogBox('Are you sure you want to delete user '+item.fields.user.user_name+' ?','yc');
     
     response.result.then(function (yesNo) {
        if (yesNo=='yes')
         {
           item._isBusy=true;
           if ($scope.demoMode)
           {
            item._isBusy=false;
     		console.log($scope.list.indexOf(item));
     		$scope.list.splice($scope.list.indexOf(item),1);
     		return;
           }
           console.log('Deleting');
            var request = $http({
    				method:'delete',
                    url: '/api/usertrack/',
                    //transformRequest: transformRequestAsFormRequest,
                    headers : { 'Content-Type': 'application/json',"X-CSRFToken":this.csrfToken } ,
                    //headers: {"X-CSRFToken":this.csrfToken},x-www-form-urlencoded
                    data: currItem
                    });
     		request.success(function(data,status){
     		console.log('delete return http status='+status);
     		// Reset line item with 
     		item._isBusy=false;
     		console.log($scope.list.indexOf(item));
     		$scope.list.splice($scope.list.indexOf(item),1);
     		}).error(function(){item._isBusy=false;});
         }
        else console.log('Not Deleting');
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
       });

   };

  
    $scope.edit = function(item){
      //push item being edited to a list to retrieve later if user cancels the edit. Use pk to retrieve the item later on
     
     var currItem=angular.copy(item);
     item._edits={};
     item._edits=currItem;
     console.log('item._edits');
     console.log(item._edits);
     
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
     var item={};
     item._editMode=true; 
     item._addMode=true; 
     item._edits={};
     item._edits.pk=0;
     item._edits.fields={};
     item._edits.fields.active='Y';
     item._edits.fields.user={};
     item._edits.fields.user.user_id=101;
     item._edits.fields.user.user_name='test@email.com';
     item._edits.fields.application={};
     item._edits.fields.application.application_id=1;
     item._edits.fields.application.application_name='IPA';
     item._edits.fields.num_computers=5;
     item._edits.fields.start_date=new Date();
     $scope.list.push(item);};    
     
    
    
    $scope.fieldChanged = function(item,fieldName)
      {
        if (fieldName=='active')
          {
           if (item._edits.fields.active=='Y') 
             {
              item._edits.fields.start_date=new Date()
              item._edits.fields.end_date=null;
             }
           if (item._edits.fields.active=='N')
            {
              item._edits.fields.end_date=new Date();
            } 
          
          }
        
      };


  

   $scope.getList();
   
   
   

   });






})();
      
