var myApp = angular.module("myApp" , []);

myApp.controller("myCtrl", function($scope, $http){	
	/* -- init method: "$scope.init()" -- */

	/* -- Users Methods: Starts Here -- */
	$scope.getAllUsers = function(){		
		var params = {companyId: $scope.user.companyId};		
	 	$http.post('/users/all', params).success(function(data) {	 	
	 		console.log("All Users", data);	
	 		if(data.error == false){	 			
	 			$scope.users = data.users;	
	 		}	 		
	  	});	
	  	$scope.showInviteMsg = false;		
	};
	$scope.removeUser = function(obj){
		var ask = confirm ("Are you sure you want to delete this user?");
		if(ask != true){
			return;
		}
		$scope.users.splice(_.indexOf($scope.users, obj), 1);
	 	$http.post('/users/remove', {_id: obj._id}).success(function(data) {	
	 		console.log("Remove User", obj); 			 		
	 		$scope.showInviteMsg = true;		
	 		$scope.inviteMsgClass = "success";
	 		$scope.inviteMsg = "User Removed Successfully!";
	  	});				  	
	};	
	$scope.inviteUser = function(){		
		if($.trim($scope.userToBeInvited).length == 0){
			return;
		}
	 	$http.post('/users/invite', {receiver: $scope.userToBeInvited, sender: $scope.user.name, companyId: $scope.user.companyId}).success(function(data) {	 	
	 		console.log("Invite!", data);
	 		$scope.showInviteMsg = true;
	 		$scope.inviteMsg = data.message;
	 		if(data.error == false){
 				$scope.inviteMsgClass = "success"; 				
	 		}else{
				$scope.inviteMsgClass = "danger";
	 		}
	  	});
	  	$scope.userToBeInvited = "";
	  	$scope.showInviteMsg = false;
	};	
	/* -- Users Methods: Ends Here -- */

	/* -- Releases Methods: Starts Here -- */
	$scope.getAllReleases = function(){		
		var params = {companyId: $scope.user.companyId};		
	 	$http.post('/releases/all', params).success(function(data) {	 	
	 		console.log("All Releases", data);	
	 		if(data.error == false){	 			
	 			$scope.releases = data.releases;	
	 		}	 		
	  	});			
	};	
	$scope.addNewRelease = function(){
		if($scope.release.title.length == 0){
			$scope.release.title = "No Title Provided.";
		}
		$scope.release.companyId = $scope.user.companyId;		
	 	$http.post('/releases/save', $scope.release).success(function(data) {	 		
	 		if(data.error == false){	 			
	 			console.log("Add release", data); 	
	 			$scope.releases.splice(0, 0, data.release);	
	 			$scope.release.title = "";	 			
	 		}
	  	});			
	};
	$scope.removeRelease = function(obj){
		var ask = confirm ("Are you sure you want to delete this release?");
		if(ask != true){
			return;
		}		
		var ind = _.indexOf($scope.releases, obj);
		if(ind > -1)
		{
			$scope.releases.splice(ind, 1);
		}else{
			return;
		}
	 	$http.post('/releases/remove', {_id: obj._id}).success(function(data) {	
	 		console.log("Remove Release", obj); 			 		
	  	});			
	};	
	/* -- Releases Methods: Ends Here -- */	

	/* -- Sprints Methods: Starts Here -- */
	$scope.getAllSprints = function(){		
		var params = {companyId: $scope.user.companyId};		
	 	$http.post('/sprints/all', params).success(function(data) {	 	
	 		console.log("All Sprints", data);	
	 		if(data.error == false){	 			
	 			$scope.sprints = data.sprints;	
	 		}	 		
	  	});			
	};	
	$scope.addNewSprint = function(){
		if($scope.sprint.title.length == 0){
			$scope.sprint.title = "No Title Provided.";
		}
		$scope.sprint.companyId = $scope.user.companyId;		
	 	$http.post('/sprints/save', $scope.sprint).success(function(data) {	 		
	 		if(data.error == false){	 			
	 			console.log("Add Sprint", data); 	
	 			$scope.sprints.splice(0, 0, data.sprint);	
	 			$scope.sprint.title = "";	 			
	 		}
	  	});			
	};
	$scope.removeSprint = function(obj){
		var ask = confirm ("Are you sure you want to delete this sprint?");
		if(ask != true){
			return;
		}		
		var ind = _.indexOf($scope.sprints, obj);
		if(ind > -1)
		{
			$scope.sprints.splice(ind, 1);
		}else{
			return;
		}
	 	$http.post('/sprints/remove', {_id: obj._id}).success(function(data) {	
	 		console.log("Remove Sprint", obj); 			 		
	  	});			
	};	
	/* -- Sprints Methods: Ends Here -- */	

	/* -- Issues Methods: Starts Here -- */
	$scope.getAllIssues = function(){		
		var params = {companyId: $scope.user.companyId};		
	 	$http.post('/issues/all', params).success(function(data) {	 	
	 		console.log("All Issues", data);	
	 		if(data.error == false){	 			
	 			$scope.issues = data.issues;	
	 		}
	 		$scope.initSocket();
	  	});			
	};
	$scope.addNewIssue = function(){
		if($scope.issue.title.length == 0){
			$scope.issue.title = "No Title Provided.";
		}
		$scope.issue.companyId = $scope.user.companyId;		
	 	$http.post('/issues/save', $scope.issue).success(function(data) {	 		
	 		if(data.error == false){	 			
	 			console.log("Add Issue", data); 	
	 			$scope.issues.splice(0, 0, data.issue);	
	 			$scope.issue.title = "";
	 			$scope.socket.emit('add_issue', data);
	 		}
	  	});			
	};
	$scope.removeIssue = function(obj){
		var ask = confirm ("Are you sure you want to delete this issue?");
		if(ask != true){
			return;
		}
		var ind = _.indexOf($scope.issues, obj);
		if(ind > -1)
		{
			$scope.issues.splice(ind, 1);
		}else{
			return;
		}
	 	$http.post('/issues/remove', {_id: obj._id}).success(function(data) {	
	 		console.log("Remove Issue", obj); 		
	 		$scope.socket.emit('remove_issue', obj);
	  	});			
	};
	$scope.openDetailView = function(obj){
		console.log(obj);
		$scope.selectedIssue = angular.copy(obj);
		delete $scope.selectedIssue.hover;
		$('#myModal').modal({});
	};
	$scope.saveIssue = function(){		
	  	var obj = _.findWhere($scope.issues, {_id: $scope.selectedIssue._id});
	  	if(obj != undefined){
	  		var ind = _.indexOf($scope.issues, obj);
	  		if(ind > -1){
	  			$scope.issues[ind] = $scope.selectedIssue;
	  			$scope.socket.emit('update_issue', $scope.selectedIssue);
	  		}
	  	}		
	  	$('#myModal').modal('hide');
	 	$http.post('/issues/update', $scope.selectedIssue).success(function(data) {	
	 		console.log("Update Issue", data); 			 		
	  	});					
	};
	/* -- Issues Methods: Ends Here -- */

	/* -- Authentication Methods: Starts Here -- */
	$scope.signin = function(){				
	 	$http.post('/users/signin', {email: $scope.user.email, password: $scope.user.password}).success(function(data) {	 	
	 		console.log("SignIn", data);
	 		if(data.error == false){
	 			$scope.view = 'main';
	 			$scope.user = data.user;
	 			$scope.getAllIssues();
	 			$scope.getAllUsers();
	 			$scope.getAllReleases();
	 			$scope.getAllSprints();

	 			$scope.authError = false;
	 			$scope.authErrorMsg = "";
	 		}else{
	 			$scope.authError = true;
	 			$scope.authErrorMsg = data.message;
	 		}
	  	});				  	
	};
	$scope.register = function(){
	 	$http.post('/users/register', $scope.user).success(function(data) {	 	
	 		console.log("Register", data);
	 		if(data.error == false){
	 			$scope.view = 'main';
	 			$scope.user = data.user;
	 			$scope.getAllIssues();
	 			$scope.getAllUsers();
	 		}	 		
	  	});				  			
	};	
	/* -- Authentication Methods: Ends Here -- */	

	/* -- Init Methods: Starts Here -- */
	$scope.init = function(){	
		$scope.view = "signin";			
		$scope.issues = [];
		$scope.issue = {title: "", status: "st-10", severity: "sv-10", user: null};
		$scope.users = [];
		$scope.user = {email: "demo@testing.com", password: "demo", name: "Demo User"};		
		$scope.releases = [];
		$scope.release = {title: ""};
		$scope.sprints = [];
		$scope.sprint = {title: ""};		
	};
	$scope.initSocket = function(){
	  $scope.socket = io();
	  $scope.socket.on('connect', function(){
	  	console.log('Socket Connected!');
	  });
	  $scope.socket.on('add_issue', function (data) {
	  	if(data.issue.companyId != $scope.user.companyId){
	  		return;
	  	}

	    console.log("[Socket] Add Issue", data);	 
	    var obj = _.findWhere($scope.issues, {_id: data.issue._id});
	    if(obj == undefined){
			$scope.issues.splice(0, 0, data.issue);			
			$scope.$digest();  
	    }	    	  	
	  });
	  $scope.socket.on('remove_issue', function (data) {
	  	if(data.companyId != $scope.user.companyId){
	  		return;
	  	}

	    console.log("[Socket] Remove Issue", data);	 
	    var obj = _.findWhere($scope.issues, {_id: data._id});
	    if(obj != undefined){
		    var ind = _.indexOf($scope.issues, obj);	
		    if( ind > -1)   
		    {
		    	$scope.issues.splice(ind, 1);
		    	$scope.$digest();
		    }	    
	    }	    
	  });	  
	  $scope.socket.on('update_issue', function (data) {
	  	if(data.companyId != $scope.user.companyId){
	  		return;
	  	}

	    console.log("[Socket] Update Issue", data);	 
	    var obj = _.findWhere($scope.issues, {_id: data._id});
	    if(obj != undefined){
		    var ind = _.indexOf($scope.issues, obj);	
		    if( ind > -1)   
		    {
		    	$scope.issues[ind] = data;
		    	$scope.$digest();
		    }	    
	    }	    
	  });	  
	};
	/* -- Init Methods: Ends Here -- */

	/* -- Supportive Methods/Variables: Starts Here -- */
	$scope.getUsername = function(email){
		if(email){			
			var obj =  _.findWhere($scope.users, {email: email});
			if(obj != undefined)
				return obj.name;
			else
				return "Select User";			
		}
		else{
			return "Select User";
		}		
	};	
	$scope.getReleaseTitle = function(id){
		if(id){			
			var obj =  _.findWhere($scope.releases, {_id: id});
			if(obj != undefined)
				return obj.title;
			else
				return "Select Release";			
		}
		else{
			return "Select Release";
		}		
	};	
	$scope.getSprintTitle = function(id){
		if(id){			
			var obj =  _.findWhere($scope.sprints, {_id: id});
			if(obj != undefined)
				return obj.title;
			else
				return "Select Sprint";			
		}
		else{
			return "Select Sprint";
		}		
	};	
	$scope.getStatusNarrative = function(code){
		if(code){			
			var obj =  _.findWhere($scope.statuses, {code: code});
			if(obj != undefined)
				return obj.narrative;
			else
				return "";			
		}
		else{
			return "";
		}		
	};
	$scope.statuses = [
		{code: "st-10", narrative: "New"},
		{code: "st-20", narrative: "In Progress"},
		{code: "st-30", narrative: "Resolved"},
		{code: "st-40", narrative: "Closed"}
	];
	$scope.getSeverityNarrative = function(code){
		if(code){
			var obj =  _.findWhere($scope.severities, {code: code});
			if(obj != undefined)
				return obj.narrative;
			else
				return "";
		}
		else{
			return "";
		}
	};
	$scope.severities = [
		{code: "sv-10", narrative: "Normal"},		
		{code: "sv-20", narrative: "Critical"},
		{code: "sv-30", narrative: "Major"},
		{code: "sv-40", narrative: "Blocker"},		
		{code: "sv-50", narrative: "Minor"},
		{code: "sv-60", narrative: "Enhancement"}
	];	
	/* -- Supportive Methods/Variables: Ends Here -- */
	
	$scope.init();	
});