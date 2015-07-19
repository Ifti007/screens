(function(){


var app=angular.module('userTrackApp', ['ui.bootstrap']);
app.config(function($interpolateProvider){
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    });
    
var data={attendees=[Name]};
var members=[
   {memberId:2742669,category:"Member",name:"Imam, Mohsin",phone:"9257086071",company:"Google",email:"mohsin.imam@gmail.com",position:"Enterprise Sales Manager",expDate:"09/21/2014",daysDue:236,address:"49002 Cinnamon Fern Cmn, Unit 432, Fremont, CA, 94539, USA",spouse:"Khan, Drakshan"}
   ,{memberId:2749617,category:"Member",name:"Naseer, Moez",phone:"4088364751",company:"OPEN Silicon Valley",email:"mnaseer@gmail.com",position:"IT Co-Chair",expDate:"1/21/2013",daysDue:366,address:"1401 Red Hawk, O-305, Fremont, CA, 94538, USA"}
   ,{memberId:2755826,category:"Charter Member",name:"Abbasi, Sohaib",phone:"6503855280",company:"Informatica",email:"sohaib.abbasi@informatica.com",expDate:"12/31/2013",daysDue:366}		
   ,{memberId:2755827,category:"Charter Member",name:"Abdul, Bari",phone:"5103641870",company:"Google",email:"bari.abdul@wharton.upenn.edu",expDate:"12/31/2013",daysDue:366,address="323 pilgrim loop, fremont, CA, 94539, USA"}
   ,{memberId:2756787,category:"Student Member",name:"Qayyum, Umair",phone:"8122198954",company:"McAfee",email:"umairqayyum@gmail.com",position:"Product Marketing",expDate:"2/25/2011",daysDue:366,address:"1999 Larsen Place, Santa Clara, CA, 95051, USA"}	
   ,{memberId:2757030,category:"Student Member",name:"Zaidi, Abbas",phone:"4086579395",	company:"HyperBreed.com",email:"buzzaz@gmail.com",position:"Director of Product Development",expDate:"3/9/2016",address:"749 27th St, San Francisco, CA, 94131, USA",spouse:"Haider, Ferman"}
   ,{memberId:2756327,category:"Non-Member",name:"Chughtai, Laiq",phone:"4084314750",email:"laiq_chughtai@hotmail.com"}	
   ,{memberId:2756328,categor:"Non-Member",name:"Chui, Candace",email:"candacechui@mushibo.com"}	
   ];

var attendees=[
    {member:{members[0]},badgePrinted:true,badgePrintDate:"",isRegistered:true,registrationDate:"",type:"Chartered Member"}];


// Sets List header, should be able to save code in html file

app.controller('attendeeListController', function($scope,$http,$modal) {
   $scope.demoMode=true;  //If demoMode is true then sample json in the js is used, controller doesnt attempt to make api calls to 
   getOnLoad=true; //If true then data is fetched as soon as page is loaded otherwise we hook the fetch with search.
   $scope.list=[];

   // Sets List header, should be able to save code in html file
   $scope.itemHeaders=[
                       //{title:"ID",field:"trackedUserId"},
                       {title:"User ID",field:"fields.userInfo.userId"},
                       {title:"User",field:"fields.userInfo.username"},
                       {title:"Application",field:"fields.application.shortName"},
                       {title:"Computers Used",field:"fields.addedComputers",tooltip:"Number of different computers a user have used to login to an application."},
                       {title:"Max Computers",field:"fields.numComputers",tooltip:"Maximum number of unique computers allowed for a user for an application."},
                       {title:"Enforced Active",field:"fields.active",tooltip:"If checked then computer limit is in effect for the user."},
                       {title:"Enforce Start Date",field:"fields.startDate",tooltip:"Time when computer limit restriction was started for the user."},	
                       {title:"Enforce End Date",field:"fields.endDate",tooltip:"Time when computer limit restriction was no longer enforced."}];

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



   // userTrack.list = [
   //   {user_id:101,user_email:'rkrishna@ucd.ca',start_date: '01/01/2011',end_date:null,num_computers:15, is_active:true},
   //   {user_id:102,user_email:'user@email.com',start_date: '02/02/2012',end_date:null,num_computers:5, is_active:true},
   //   {user_id:103,user_email:'harmon@harmon.com',start_date: '09/10/2014',end_date:'06/18/206',num_computers:7, is_active:false}];

    //userTrack.selectedId = userTrack.list[0].user_id;    
    
    /*API: Get the data */
    
   $scope.getList=function(pageNum=1){
    if ($scope.demoMode) 
     {
      result= {"meta":{"total_row_count": 10, "total_pages": 1, "page_num": 1, "page_size": 20, "order_by": "pk"},"data":[{"fields": {"end_date": "2015-05-01T16:22:56.490Z", "num_computers": 11, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "cws_user_for_workspace_Hephaestus_P1@ingenuity.com", "user_id": 15347}, "active": "N", "start_date": "2015-04-27T05:24:16.512Z"}, "model": "usertrack.user_tracked", "pk": 2}, {"fields": {"end_date": null, "num_computers": 2, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "dsmn@ku.edu", "user_id": 101}, "active": "Y", "start_date": "2015-04-27T17:18:44.442Z"}, "model": "usertrack.user_tracked", "pk": 3}, {"fields": {"end_date": null, "num_computers": 3, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "ehovermale@ingenuity.com", "user_id": 102}, "active": "Y", "start_date": "2015-04-29T23:24:49.743Z"}, "model": "usertrack.user_tracked", "pk": 22}, {"fields": {"end_date": null, "num_computers": 5, "application": {"application_name": "Ingenuity Answers", "application_id": 2}, "user": {"user_name": "dsmn@ku.edu", "user_id": 101}, "active": "Y", "start_date": "2015-05-01T23:06:17.975Z"}, "model": "usertrack.user_tracked", "pk": 29}, {"fields": {"end_date": null, "num_computers": 8, "application": {"application_name": "Ingenuity Answers", "application_id": 2}, "user": {"user_name": "cws_user_for_workspace_Hephaestus_P1@ingenuity.com", "user_id": 15347}, "active": "Y", "start_date": "2015-05-01T23:08:07.989Z"}, "model": "usertrack.user_tracked", "pk": 30}, {"fields": {"end_date": null, "num_computers": 8, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "mmaeda@ingenuity.com", "user_id": 109}, "active": "Y", "start_date": "2015-05-01T23:14:56.837Z"}, "model": "usertrack.user_tracked", "pk": 31}, {"fields": {"end_date": null, "num_computers": 5, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "rcho@ingenuity.com", "user_id": 110}, "active": "Y", "start_date": "2015-05-04T22:07:09.141Z"}, "model": "usertrack.user_tracked", "pk": 42}, {"fields": {"end_date": null, "num_computers": 5, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "name5@badinput.com", "user_id": 200}, "active": "Y", "start_date": "2015-05-04T22:07:45.074Z"}, "model": "usertrack.user_tracked", "pk": 43}, {"fields": {"end_date": null, "num_computers": 5, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "tak3030@hotmail.com", "user_id": 250}, "active": "Y", "start_date": "2015-05-04T22:07:55.513Z"}, "model": "usertrack.user_tracked", "pk": 46}, {"fields": {"end_date": null, "num_computers": 5, "application": {"application_name": "Ingenuity Pathway Analysis", "application_id": 1}, "user": {"user_name": "ylu@ingenuity.com", "user_id": 111}, "active": "Y", "start_date": "2015-05-04T22:19:15.792Z"}, "model": "usertrack.user_tracked", "pk": 47}]}
      
      
            $scope.list=result.data;
            //$scope.totalItems = result.meta.total_row_count;;
            //$scope.currentPage = result.meta.page_num;
            //$scope.maxSize = result.meta.page_size;
            $scope.totalItems = result.meta.total_row_count;
            $scope.currentPage = result.meta.page_num;
            $scope.itemsPerPage = result.meta.page_size;
            $scope.sortPredicate = result.meta.order_by;
      return;
     }
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



app.directive('userComputer',function(){
    return {
      templateUrl: function(elem,attr){return 'computers/'+'101';},
       scope: {
       trackId:'=trackid',
       adminMode:'=adminMode'
       },
      controller: function($attrs,$scope,$modal) {
				   //var userTrack = this;
				    $scope.list = [
			   {computer_id:1,track_id:1,track_line_id:1,ram_kb:1024,mac_address:'10:EO:21:30:01',os_user:'/home/bobcat',os_name:'MacOSx',os_version:'10.2',access_dt:'01/02/2011',last_session_id:1234553}
			  ,{computer_id:2,track_id:1,track_line_id:2,ram_kb:1024,mac_address:'A0:EO:21:30:21',os_user:'/home/tomcat',os_name:'windows 7',os_version:'7',access_dt:'05/07/2013',last_session_id:4274553}
		      ,{computer_id:3,track_id:1,track_line_id:3,ram_kb:1024,mac_address:'B0:EO:21:30:51',os_user:'/home/wheel',os_name:'MacOSx',os_version:'9',access_dt:'01/02/2014',last_session_id:6254563}
		      ,{computer_id:4,track_id:2,track_line_id:1,ram_kb:1024,mac_address:'F0:EO:21:E1:AE',os_user:'/home/admin',os_name:'Windows',os_version:'8',access_dt:'01/02/2015',last_session_id:1634656}
		      ,{computer_id:5,track_id:2,track_line_id:2,ram_kb:1024,mac_address:'10:EO:21:B0:E3',os_user:'/home/lluam',os_name:'Ubuntu',os_version:'12.2',access_dt:'01/02/2014',last_session_id:1534567}
		      ,{computer_id:6,track_id:3,track_line_id:1,ram_kb:1024,mac_address:'10:EO:21:30:4F',os_user:'/home/hiag',os_name:'Windows',os_version:'XP',access_dt:'01/02/2013',last_session_id:56274654}
			      ];
		    this.orderBy='computer_id';
		    $scope.delete=function(item){
		    $scope.list.splice($scope.list.indexOf(item),1);};
		    $scope.attributes=function(msg){
		    $modal.open({
		    templateUrl: 'computerattrib/',
      		/*template: '<div class="modal-header"> \
            <h3 class="modal-title">[[msg]]</h3> \
        </div> \
        <div class="modal-body"> \
             \
            <li ng-repeat="item in list"> [[ item.attribute_name]] : [[ item.attribute_value ]] </li> \
        </div>  \
        <div class="modal-footer">  \
            <button ng-if="showYes" class="btn btn-primary" ng-click="ok(\'yes\')">Ok</button>  \
            <button ng-if="showNo" class="btn btn-primary" ng-click="ok(\'no\')">No</button>  \
            <button ng-if="showCancel" class="btn btn-warning" ng-click="cancel()">Cancel</button> \
        </div>', */
      		controller: function ($scope, $modalInstance) {
                         $scope.msg=msg;
                         $scope.ync = 'y';
                         $scope.showYes = ($scope.ync.indexOf('y')>=0);
                         $scope.showNo = ($scope.ync.indexOf('n')>=0);
                         $scope.showCancel = ($scope.ync.indexOf('c')>=0);
                         $scope.list = [
			   			 	{computer_attrib_id:1,computer_id:1,attribute_name:'LICENSE',attribute_value:'Concurrent'}
			  				,{computer_attrib_id:2,computer_id:1,attribute_name:'SESSION_VALID',attribute_value:'Yes'}
		      				,{computer_attrib_id:3,computer_id:1,attribute_name:'OTHER MAC ADDRESS',attribute_value:'AE:01:23:45:FF'}
		      				,{computer_attrib_id:4,computer_id:2,attribute_name:'LICENSE',attribute_value:'TRIAL'}
		      				,{computer_attrib_id:5,computer_id:2,attribute_name:'SESSION_VALID',attribute_value:'Yes'}
		      				,{computer_attrib_id:6,computer_id:3,attribute_name:'LICENSE',attribute_value:'TRIAL'}
			      			];

                  $scope.ok = function (yesNo) {
                            //$modalInstance.close(yesNo);
                             };
                  $scope.cancel = function () {
                           //$modalInstance.dismiss('cancel');
                            };
                    }
                    });
		    };
		   },
	controllerAs: 'userComputer',
    }
   });

app.directive('userEmailList',function(){
    return {
      template: '<input type="text" ng-model="selected" placeholder="Type in email" typeahead="user as user.userEmail for user in users | filter:$viewValue | limitTo:8"  typeahead-on-select="onSelect($item, $model, $label)" class="form-control">',
       scope: {
       userEmail:'=userEmail',
       userID:'=userId',
       },
      controller: function($attrs,$scope,$http) {
				$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
				$scope.users = [{'userID':101,'userEmail':'chung@epri.com'},
								{'userID':102,'userEmail':'damed@ingenuity.com'},
								{'userID':103,'userEmail':'wer2fmya@yahoo.com'},
								{'userID':104,'userEmail':'eraser@qiagen.com'},
								{'userID':105,'userEmail':'new@wellsfargo.com'},
								{'userID':106,'userEmail':'drugged@pfizer.com'},
								{'userID':107,'userEmail':'just@dapps.com'}	];
				$scope.onSelect=function($item, $model, $label) {
				 console.log("onSelect($item, $model, $label) ");
				 $scope.userID=$item.userID;
				 $scope.userEmail=$item.userEmail;
				 console.log('$scope.userID='+$scope.userID);
				 console.log('$scope.userEmail'+$scope.userEmail);
				 //console.log($item);
				 //console.log($model);
				 //console.log($label);
				 
				};
		   },
	controllerAs: 'userEmail',
    }
   });
   
app.directive('userComputerAttribute',function(){
    return {
      templateUrl: function(elem,attr){return 'computerattrib';},
       scope: {
       computerId:'=computerid'
       },
      controller: function($attrs,$scope) {
				   //var userTrack = this;
				    $scope.list = [
			   {computer_attrib_id:1,computer_id:1,attribute_name:'LICENSE',attribute_value:'Concurrent'}
			  ,{computer_attrib_id:2,computer_id:1,attribute_name:'SESSION_VALID',attribute_value:'Yes'}
		      ,{computer_attrib_id:3,computer_id:1,attribute_name:'OTHER MAC ADDRESS',attribute_value:'AE:01:23:45:FF'}
		      ,{computer_attrib_id:4,computer_id:2,attribute_name:'LICENSE',attribute_value:'TRIAL'}
		      ,{computer_attrib_id:5,computer_id:2,attribute_name:'SESSION_VALID',attribute_value:'Yes'}
		      ,{computer_attrib_id:6,computer_id:3,attribute_name:'LICENSE',attribute_value:'TRIAL'}
			      ];
		    this.orderBy='computer_id';
		   },
	controllerAs: 'userComputer',
    }
   });


})();
      
