angular.module("changePasswordController", []).controller("changePassCtrl", 
	function($scope, $http, $window, $rootScope, $routeParams){
		
		$scope.newpwd = "";
		$scope.cnfpwd = "";
		$scope.newpwdMsg = "";
		$scope.finalpwdMsg = "";
		$scope.pwdResetSuccess = false;
		$scope.loginUrl = "";
		
		$scope.checkPassValidity = function(modelName) {
    	
			var passw = $scope.newpwd;
			$scope.newpwdMsg = "" ;
			$scope.finalpwdMsg = "";
			var regex_special = /[*@!#%&()^~{}]+/;
			var regex_upper = /[A-Z]+/;

			if(passw.length<8){
				$scope.newpwdMsg = "Password length must be between 8-32 characters.";
			}
			else{
				$scope.newpwdMsg = "";
			}

			if(regex_special.test(passw)){
				$scope.newpwdMsg = $scope.newpwdMsg +"";
			}
			else{
				$scope.newpwdMsg = $scope.newpwdMsg +"Password should contain atleast 1 special symbol.";
			}

			if(regex_upper.test(passw)){
				$scope.newpwdMsg = $scope.newpwdMsg +"";
			}
			else{
				$scope.newpwdMsg = $scope.newpwdMsg +"Password should contain atleast 1 capital letter.";
			}
			
		}
		
		
	$scope.resetPassword = function() {
    	$scope.finalpwdMsg = "";
    	var newpwd = $scope.newpwd;
        var cnfpwd = $scope.cnfpwd;
       
        if(newpwd.length==0 || cnfpwd.length==0){
             $scope.finalpwdMsg = "Fields can't be empty.";
        }

        if(newpwd.length!=cnfpwd.length || cnfpwd != newpwd){
             $scope.finalpwdMsg = "Passwords do not match.";
        }			
		
		if($scope.newpwdMsg != ""){
			$scope.finalpwdMsg = '';		
			$scope.newpwdMsg = $scope.newpwdMsg;
			$scope.newpwd = "";
			$scope.cnfpwd = "";
		}

        if( newpwd != "" && cnfpwd != "" && (newpwd.length==cnfpwd.length) && (cnfpwd == newpwd) ){
            
			// update user password
            //var userId = atob($window.location.href.split("data=")[1]).split("&")[0].split("id=")[1];
            var param1 = $routeParams.param1;
			
            $http({
			 	url : "/tokenizedPassword",
			 	data : {pwd : newpwd, token : param1},
			 	method : "post",
			 	headers: {'Content-Type': 'application/json'},
		    })
		    .success(function(data){
		    	//$scope.loginUrl = "http://"+$window.location.host+"/#/login";
		    	$scope.newpwd = "";
				$scope.cnfpwd = "";
				$scope.newpwdMsg = "";
				$scope.finalpwdMsg = "";
				$scope.pwdResetSuccess = true;
				$scope.loginUrl = "";
		    });
        }
    }
		
});