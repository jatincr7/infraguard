var dashBoard = angular.module('dashBoard',["ngRoute","profileController", "HelpController",
"companyDetailController","projectDetailController","createProjectController","fileUploadDirective",
"companyService","serverController","manageUsersController","mfaPageController","roleController",
"serverDetailsController","sshController","cronManagementController","cronDetailController","automationController",
"runScriptController","scriptHistoryController","scriptHistoryDetailController","projectCronController",
"projectCronDetailController","companyCronController","listInstancesController","projectInstanceController","userTrailController","searchServerController","homePageController","documentController"]);

dashBoard.config(function($routeProvider){
	$routeProvider
	.when("/", {
        templateUrl : "pages/home.html",
        controller : "homePageController"
    })
	.when("/company", {
        templateUrl : "pages/companyDetails.html",
        controller : "profileController",
		resolve:{
		"check":function(accessFac,$location){  
			//console.log(accessFac);
			if( accessFac.split(",").indexOf("company") > -1 ){	
				//$location.path('/company');
			}else{
				$location.path('/');
				alert("You don't have access here");
			}
			}
		}
		
    })
    .when("/project", {
        templateUrl : "pages/projectDetails.html",
        controller : "companyDetailController"
    })
    .when("/server", {
        templateUrl : "pages/serverDetails.html",
        controller : "serverController"
    })
    .when("/profile", {
        templateUrl : "pages/userProfile.html",
        controller : "profileController",
		resolve:{
		"check":function(accessFac,$location){  
			
			if( accessFac.split(",").indexOf("profile") > -1 ){				
				//$location.path('/profile');
			}else{
				$location.path('/');
				alert("You don't have access here");
			}
			}
		}
    })
    .when("/mfa", {
        templateUrl : "pages/mfaPage.html",
        controller : "mfaPageController"
    })
    .when("/users", {
        templateUrl : "pages/manageUsers.html",
        controller : "manageUsersController"
    })
    .when("/administration", {
        templateUrl : "pages/administration.html",
        controller : "roleController",
		resolve:{
		"check":function(accessFac,$location){  
			console.log(accessFac);
			if( accessFac.split(",").indexOf("administration") > -1 ){				
				//$location.path('/administration');
			}else{
				$location.path('/');
				alert("You don't have access here");
			}
			}
		}
    })
    .when("/serverDetails", {
        templateUrl : "pages/eachServerDetails.html",
        controller : "serverDetailsController"
    })
    .when("/ssh", {
        templateUrl : "pages/ssh.html",
        controller : "sshController"
    })
    .when("/cron", {
        templateUrl : "pages/cronManagement.html",
        controller : "cronManagementController"
    })
    .when("/automation", {
        templateUrl : "pages/automation.html",
        controller : "automationController",
		resolve:{
		"check":function(accessFac,$location){  
			
			if( accessFac.split(",").indexOf("automation") > -1 ){				
				//$location.path('/automation');
			}else{
				$location.path('/');
				alert("You don't have access here");
			}
			}
		}
    })
    .when("/cronDetails", {
        templateUrl : "pages/cronDetails.html",
        controller : "cronDetailController"
    })
    .when("/runScript", {
        templateUrl : "pages/runScript.html",
        controller : "runScriptController"
    })
    .when("/scriptHistory", {
        templateUrl : "pages/scriptHistory.html",
        controller : "scriptHistoryController"
    })
    .when("/scriptHistoryDetails", {
        templateUrl : "pages/scriptHistoryDetails.html",
        controller : "scriptHistoryDetailController"
    })
//    .when("/projectCron", {
//        templateUrl : "pages/projectCrons.html",
//        controller : "projectCronController"
//    })
    .when("/projectCronDetails", {
        templateUrl : "pages/projectCronDetails.html",
        controller : "projectCronDetailController"
    })
//    .when("/companyCron", {
//        templateUrl : "pages/companyCron.html",
//        controller : "companyCronController"
//    })
//    .when("/listInstances", {
//        templateUrl : "pages/listInstances.html",
//        controller : "listInstancesController"
//    })
    .when("/projectInstances", {
        templateUrl : "pages/projectListInstances.html",
        controller : "projectInstanceController"
    })
    .when("/userTrail", {
        templateUrl : "pages/userTrail.html",
        controller : "userTrailController"
    })
    .when("/processes", {
        templateUrl : "pages/processes.html",
        controller : "serverDetailsController"
    })
    .when("/searchServer", {
        templateUrl : "pages/searchServer.html",
        controller : "searchServerController"
    })
	.when("/documentation", {
        templateUrl : "pages/documentation.html",
        controller : "documentController"
    })
    .when("/getlogs",{
     templateUrl:"pages/viewLogs.html",
     controller:"searchServerController"
    })
    .otherwise({
        redirectTo : "/"
    });
});


dashBoard.factory('accessFac', function($window){
	
	var menuData = $window.localStorage.getItem('menuData');
	this.access = menuData;
	
	return this.access;
});
