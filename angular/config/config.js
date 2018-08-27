angular.module("myApp", ["ngRoute", "loginController", "signupController", "homeController", 
"passwValidation", "changePasswordController"]).config(
function($routeProvider){
	$routeProvider
	.when("/", {
        //templateUrl : "/pages/homePageContent.html",
        //controller : "homeController"
		templateUrl : "/pages/login.html",
		controller : "loginCtrl"
    })
	.when("/login", {
	templateUrl : "/pages/login.html",
	controller : "loginCtrl"
	})
	.when("/signup", {
		templateUrl : "/pages/register.html",
		controller : "signupCtrl"
	})
	.when("/changepassword/:param1", {
		templateUrl : "/pages/changepassword.html",
		controller : "changePassCtrl"
	})
	.otherwise({
		redirectTo : "/"
	});
});
