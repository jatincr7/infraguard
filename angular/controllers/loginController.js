angular.module("loginController", []).controller("loginCtrl",
	function ($scope, $http, $log, $window, $rootScope, $document) {

		$scope.loginMsg = "";
		$scope.loginFailed = false;
		$rootScope.title = " - Login";
		$rootScope.visible_mfa = false;
		$rootScope.mfaReset = false;
		$rootScope.pwdReset = false;
		$rootScope.modal_class = "";
		$rootScope.mfa_err_msg = "";
		$rootScope.email = "";
		$rootScope.userEmail = "";
		$rootScope.pwdMsg = '';
		$rootScope.userName = "";
		$rootScope.googleMail = "";
		$scope.isgmail = false;

		var body = angular.element($document[0].body);
		var emailPattern = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;


		$http.get('environment.properties').then(function (response) {
			mailMFAResetCredentialsUrl = response.data.mailMFAResetCredentialsUrl;
			pwdResetCredentialsUrl = response.data.pwdResetCredentialsUrl;
		});

		$scope.uname_blur = function () {
			$scope.loginFailed = false;
		};

		$scope.passw_blur = function () {
			$scope.loginFailed = false;
		};


		
		//Google sign  in begains//	
		var auth2;
	
		$scope.user = {};

		$window.appStart = function () {
			console.log('appStart()');
			gapi.load('auth2', initSigninV2);
			auth2 = gapi.auth2.getAuthInstance();
		};
	

		var initSigninV2 = function () {
			console.log('initSigninV2()');
			auth2.isSignedIn.listen(signinChanged);
			auth2.currentUser.listen(userChanged);

			if (auth2.isSignedIn.get() == true) {
				auth2.signIn();

			}
		};	

		var signinChanged = function (isSignedIn) {
			console.log('signinChanged() = ' + isSignedIn);
			if (isSignedIn) {
				
				//$scope.isgmail = true;
				//scope.login()
				//redirecting to the infraguard  after google login//
			}

			if (isSignedIn) {

				console.log('the user must be signed in to print this');
				var googleUser = auth2.currentUser.get();
				var authResponse = googleUser.getAuthResponse();
				var profile = googleUser.getBasicProfile();
				$scope.user.id = profile.getId();
				$scope.user.fullName = profile.getName();
				$scope.user.firstName = profile.getGivenName();
				$scope.user.lastName = profile.getFamilyName();
				$scope.user.photo = profile.getImageUrl();
				$scope.user.email = profile.getEmail();
				$scope.user.domain = googleUser.getHostedDomain();

				$scope.user.idToken = authResponse.id_token;
				$scope.user.expiresAt = authResponse.expires_at;
				console.log(profile)
				//$scope.txtEmail = profile.getEmail();

				//Getting user information from google//
			
				$scope.signOut()
				// alert('user sign out')
				$scope.disconnect()
				
				$scope.isgmail = true;
				$scope.txtEmail = profile.getEmail();
				$scope.txtPassw = ''
			
				$scope.login()
				$scope.$digest();
				//alert('user sign in 2 ')
				console.log('2')
				//if the user user is already signed in signout the user and disconnect from his google account//


			} else {
				console.log('the user must not be signed in if this is printing');
				$scope.user = {};
				$scope.$digest();
			}
		};

		var userChanged = function (user) {
			console.log('userChanged()');
			
		};

		$scope.signOut = function () {
			console.log('signOut()');
			auth2.signOut().then(function () {

				signinChanged(false);
			});
			console.log(auth2);
		};

		$scope.disconnect = function () {
			console.log('disconnect()');
			auth2.disconnect().then(function () {
				signinChanged(false);
			});
			console.log(auth2);
		};

		// Google  signin ends//



	


	



		//App Login is gmail true when login through google//


         debugger;

		
		$scope.login = function () {

			
			var email = $scope.txtEmail;
			var passw = $scope.txtPassw;
			var isgmail = $scope.isgmail


			if (email == undefined || passw == undefined) {
				$scope.loginMsg = "All Fields are required.";
				$scope.loginFailed = true;
				return false;
			}
		// 	if(isgmail&&data.error){
        //  $scope.loginMsg=data.error
        //   $scope.loginFailed = true;
		//    return false
	


		// 	}
			else {
				$scope.loginMsg = "";
				$scope.loginFailed = false;
			}
			if(isgmail){
				var json = { email: email, passw: passw, isgmail: $scope.isgmail };
			}else{
			
			var json = { email: email, passw: passw, isgmail: $scope.isgmail };
			}
			$http({
				url: "/loginAction",
				data: json,
				method: "post",
				headers: { 'Content-Type': 'application/json' },
			})
				.success(function (data) {
					if(isgmail&&data.success==0){
						$scope.txtEmail='';
						$scope.textPassw='';
						$scope.loginFailed=true;
						$scope.loginMsg=data.error
						return false;
					}
					if(isgmail&&data.success==1){
						$scope.loginFailed=false
						$scope.loginMsg=""
					
					}

					if (data.success == 1) {
						$rootScope.userEmail = data.email;
						$rootScope.userName = data.uname;
						if (data.mfa == 0) {
							var url = "/";
							$window.location.href = url;
							$scope.loginMsg = "Login Valid";
						}
						else {
							// show popup to enter mfa , match and then login
							showMFAModal();
						}
					}
					else {
						$scope.loginMsg = data.error;
						$scope.loginFailed = true;
					}
				})
				.error(function (err) {

				});
		};


		showMFAModal = function () {
			console.log(" showMFAModal called & visible_mfa = " + $rootScope.visible_mfa);
			$rootScope.visible_mfa = $rootScope.visible_mfa ? false : true;
			$rootScope.errName = false;
			$rootScope.mfakey = "";
			$rootScope.mfa_err_msg = "";
			if ($rootScope.visible_mfa) {
				body.addClass("overflowHidden");
				$rootScope.modal_class = "modal-backdrop fade in";
			} else {
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
		};


		$rootScope.showResetPopup = function (type) {
			if (type == "mfa") {
				$rootScope.mfaReset = $rootScope.mfaReset ? false : true;
				$rootScope.visible_mfa = $rootScope.visible_mfa ? false : true;
				$rootScope.mfa_err_msg = '';
			} else if (type == "pwd") {
				$rootScope.email = '';
				$rootScope.pwdReset = $rootScope.pwdReset ? false : true;
				$rootScope.pwdMsg = '';
			}
		}

		$rootScope.close = function (value) {
			if (value == "mfakey_ok") {
				var mfakey = "";
				mfakey = $rootScope.mfakey;
				console.log("mfakey = : " + mfakey);
				if (mfakey == undefined || mfakey.trim().length <= 0 || mfakey.trim().length < 6) {
					$rootScope.mfa_err_msg = "Please enter your 6-digit/Backup Key.";
					return;
				} else {
					console.log(" mfa ok ");
					$http({
						url: "/matchMFAToken",
						data: { email: $rootScope.userEmail, token: mfakey },
						method: "post",
						headers: { 'Content-Type': 'application/json' },
					})
						.success(function (data) {
							if (data.success == 1) {
								var url = "/";
								$window.location.href = url;
								$scope.loginMsg = "Login Valid";
								$rootScope.visible_mfa = $rootScope.visible_mfa ? false : true;
								body.removeClass("overflowHidden");
								$rootScope.modal_class = "";
							} else {
								$rootScope.mfa_err_msg = data.errmsg;
							}

						});
				}

			}
			else if (value == "mfakey_cancel") {
				console.log(" mfa cancel ");
				$rootScope.visible_mfa = $rootScope.visible_mfa ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
			else if (value == "mfaResetCancel") {
				$rootScope.mfaReset = $rootScope.mfaReset ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
			else if (value == "mfaResetOk") {

				$http({
					url: "/resetMFAToken",
					data: { email: $rootScope.userEmail, userName: $rootScope.userName },
					method: "post",
					headers: { 'Content-Type': 'application/json' },
				})
					.success(function (data) {
						if (data.success == 1) {
							var mfaCredentials = {
								baseurl: $window.location.host,
								backupCode: data.secret,
								email: $rootScope.userEmail
							};
							$http({
								url: mailMFAResetCredentialsUrl,
								data: mfaCredentials,
								method: "post",
								headers: { 'Content-Type': 'application/json' },
							}).success(function (data) {
							});
							$rootScope.mfaReset = $rootScope.mfaReset ? false : true;
							body.removeClass("overflowHidden");
							$rootScope.modal_class = "";
						} else {
							$rootScope.mfa_err_msg = data.errmsg;
						}
					});
			} else if (value == "pwdResetCancel") {

				$rootScope.pwdReset = $rootScope.pwdReset ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";

			} else if (value == "pwdResetOk") {

				if (emailPattern.test($rootScope.email)) {
					$rootScope.pwdMsg = "";
					$http({
						method: "post",
						url: "/checkEmail",
						data: { email: $rootScope.email },
						headers: "{Content-Type : application/json}"
					})
						.success(function (data) {
							if (data.found == 1) {
								// send mail with reset password link

								$rootScope.pwdMsg = "You will receive an email.";
								var href = "id=" + data.result.id + "&timeStamp=" + Date.now();
								var encodedString = btoa(href); // base64 encode the parameters for password reset
								var psswdResetUrl = "http://" + $window.location.host + "/resetPassword?data=" + encodedString;
								var pwdReset = {
									psswdResetUrl: psswdResetUrl,
									email: data.result.email
								};
								$http({
									url: pwdResetCredentialsUrl,
									data: pwdReset,
									method: "post",
									headers: { 'Content-Type': 'application/json' },
								})
									.success(function (data) {
										console.log(" mail sent " + data);
										$rootScope.pwdReset = $rootScope.pwdReset ? false : true;
										body.removeClass("overflowHidden");
										$rootScope.modal_class = "";
									});
							} else {
								$rootScope.pwdMsg = "This email is not registered.";
							}
						});
				}
				else {
					$rootScope.pwdMsg = "Email is invalid.";
				}
			}
		};

	});

