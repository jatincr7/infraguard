angular.module("GoogleCtrl", []).controller("GoogleCtrl",
	function($scope, $http , $window, $rootScope, $document){
                            $scope.loginMsg = "";
                            $scope.loginFailed = false;
                            $rootScope.title = " - Login";
                            $rootScope.visible_mfa = false;
                            $rootScope.mfaReset = false;
                            $rootScope.pwdReset = false;
                            $rootScope.modal_class = "";
                            $rootScope.mfa_err_msg = "";
                            $rootScope.userEmail = "";
                            $rootScope.email = "";
                            $rootScope.pwdMsg = '';
                            $rootScope.userName = "";
                            $rootScope.googleMail="";
                            var body = angular.element($document[0].body);
                            var emailPattern = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
                    
                            $http.get('environment.properties').then(function (response) {
                            mailMFAResetCredentialsUrl = response.data.mailMFAResetCredentialsUrl;
                            pwdResetCredentialsUrl = response.data.pwdResetCredentialsUrl;
                            });
                    
                            $scope.uname_blur = function() {
                                          $scope.loginFailed = false;
                            };
                    
                            $scope.passw_blur = function() {
                                          $scope.loginFailed = false;
                            };

                            $scope.onSignIn=function(googleUser) {
                                          console.log('hello')
                                                        // Useful data for your client-side scripts:
                                                        var profile = googleUser.getBasicProfile();
                                                        googleMail=profile.getEmail();
                                                        console.log('email'+googleMail)
                                                        alert(googleMail)
                                          
                                                  var id_token = googleUser.getAuthResponse().id_token;
                                                  console.log(id_token)
                                          
                                                        
                                                        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
                                                        console.log('Full Name: ' + profile.getName());
                                                        console.log('Given Name: ' + profile.getGivenName());
                                                        console.log('Family Name: ' + profile.getFamilyName());
                                                        console.log("Image URL: " + profile.getImageUrl());
                                                        console.log("Email: " + profile.getEmail());
                                          
                                                        $scope.login = function(){
                                                                      var email = $scope.googleMail;
                                                                      var passw = "";
                                                                      if(email == undefined || passw == undefined){
                                                                                    $scope.loginMsg = "All Fields are required.";
                                                                                    $scope.loginFailed = true;
                                                                                    return false;
                                                                      }
                                                                      else{
                                                                                    $scope.loginMsg = "";
                                                                                    $scope.loginFailed = false;	
                                                                      }
                                                                      var json = {email : email, passw :'',isgmail:true};
                                                                      $http({
                                                                                    url : "/loginAction",
                                                                                    data : json,
                                                                                    method : "post",
                                                                                    headers: {'Content-Type': 'application/json'},
                                                                                    })
                                                                      .success(function(data){
                                                                                    if(data.success==1){
                                                                                                  $rootScope.userEmail = data.email;
                                                                                                  $rootScope.userName = data.uname;
                                                                                      if(data.mfa==0){
                                                                                                    var url =  "/";
                                                                                                    $window.location.href = url;
                                                                                                    $scope.loginMsg = "Login Valid";
                                                                                        }
                                                                                      else{
                                                                                                    // show popup to enter mfa , match and then login
                                                                                      showMFAModal();
                                                                                      }
                                                                                    }
                                                                                    else{
                                                                                                  $scope.loginMsg = data.error;
                                                                                                  $scope.loginFailed = true;
                                                                                    }
                                                                      })
                                                                      .error(function(err) {
                                          
                                                                      });
                                                        };
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                                        window.onSignIn = onSignIn;
                                                  }
                                          })