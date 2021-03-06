var app = angular.module("serverDetailsController", []);
        app.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
        }]);
 app.controller("serverDetailsController",
     function ($scope, $rootScope, $http, companyService, $window, $timeout, $document) {
		 $rootScope.autoUpdateScript = '';
        $scope.visible = false;
		$scope.IsAppDisabled = '';
	$rootScope.autoAppID="";
	$scope.IsVisible = false;
	$rootScope.autoRotateEmail = '';
	$rootScope.IsRotateVisible = false;
	$scope.servers = "";
	$rootScope.listStatus = false;
	$rootScope.userExist = true;
	$rootScope.userEmail = "";
	$rootScope.user_err_msg = "";
	$rootScope.privilege = "user";
	$rootScope.visible_server = false;
	$rootScope.visible_command = false;
	$rootScope.visibleLockdown = false;
	$rootScope.visibleUnlock = false;
	$rootScope.visibleProcessList = false;
	$rootScope.visibleGetAccessKey = false;
        $rootScope.lastRun = '';
        $rootScope.serverStatus = '';
        $rootScope.topMemory =[];
        $rootScope.topCPU =[];
        $rootScope.windowTopMemory =[];
        $rootScope.windowTopCPU =[];
        $rootScope.searchBarAllowed = 0;
        $rootScope.cronInfo = "Type the schedule of the maintenance window in the form of a CRON expression.";
        $rootScope.durationInfo = "Type the duration of the maintenance window in hours.";
        $rootScope.cutOffInfo = "Type the number of hours before the end of the maintenance window that the system should stop scheduling new tasks of execution.";
	//$rootScope.modal_class = "modal-backdrop fade in loader";
    $rootScope.server_err_msg = "";
	$scope.users = [];
	var serverName = "";
	var local_index = -1;
	var body = angular.element($document[0].body);
	var ip_addr = "";
	var user_obj = {};
	var emailPattern = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var mailUserCredentialsUrl="";
    var serverPageDetailsUrl="";
    $scope.createStyle={display:'none'};
    
    if ($rootScope.count == 1){
        $('#tab8').prop("checked", true);
        $rootScope.tab = $('#tab8').prop("checked");
        $rootScope.count = 0;
    } else if ($rootScope.count == 2){
        $('#tab5').prop("checked", true);
        $rootScope.tab = $('#tab5').prop("checked");
        $rootScope.count = 0;
    }
    var sCount = true;
            var id = companyService.getId();
            if (id == undefined) {
                id = $window.localStorage.getItem('serverId');
            }
            $window.localStorage.setItem('serverId', id);
            companyService.setId(null);
               $http({
                method: "post",
                url: "/serverDetails",
                data:{'server_id':id},
                headers: {"Content-Type": "application/json"}
               })
                    .success(function (data){
                         $('#content5 > span').text("");
                         $rootScope.topMemory =[];
                         $rootScope.topCPU =[];
                         $rootScope.windowTopMemory =[];
                         $rootScope.windowTopCPU =[];
                         $rootScope.platfrom = data.platfrom;
                        // $rootScope.modal_class="";
                        if(data.response !="N/A"){
                         if(data.platfrom=="L"){
                            var array1 = data.response.split("\n");
                            var array = array1.slice(0,6);
                            array.push(array1.slice(6).join("\n"));
                            $rootScope.homeDir = array[0];
                            $rootScope.diskSpace = array[1];
                            var disk = array[1].split(/(\s+)/);
                            $rootScope.diskSpace = disk[4]+"/"+disk[2]+" ("+disk[8]+")";
                            $rootScope.CPU = array[2];
                            var memory = array[3].split(/(\s+)/);
                            $rootScope.memorySpace = (memory[4]/1024).toFixed(2)+"GB/"+(memory[2]/1024).toFixed(2)+"GB"+" ("+((memory[4]/memory[2]*100).toFixed(2))+"%)";
                            var osVersion = array[4];
                            osVersion = osVersion.replace(/NAME=/g, '');
                            osVersion = osVersion.replace(/VERSION=/g, '');
                            osVersion = osVersion.replace(/"/g, '');
                            $rootScope.osVersion = osVersion;
                            var bufferCache = array[5].replace(/cache:         /g, '');
                            bufferCache  = bufferCache.replace(/cache:     /g, '');
                            bufferCache  = bufferCache.replace(/buffers/g, '');
                            bufferCache  = bufferCache.replace(/\+/g,'')
                            bufferCache  = bufferCache.replace(/\-/g,'')
                            bufferCache  = bufferCache.replace(/\//g, '');
                            bufferCache = bufferCache.split("        ");
                            $rootScope.buffer = (bufferCache[0]/1024).toFixed(2)+"GB";
                            $rootScope.cache  = (bufferCache[1]/1024).toFixed(2)+"GB";
                            $rootScope.topMemoryProcess = array[6].split("\n");
                            var j=0;
                            for(var i=0;i<$rootScope.topMemoryProcess.length-1;i++){
                                if(i<15){
                                    $rootScope.topMemory[i] = cleanArray($rootScope.topMemoryProcess[i].split(" "));
                                }else{
                                    $rootScope.topCPU[j] = cleanArray($rootScope.topMemoryProcess[i].split(" "));
                                    j++;
                                }

                            }
                     }else{
                            var array2 = data.response.split("\n");
                            var array3 = array2.slice(0,11);
                            array3.push(array2.slice(11).join("\n"));
//                            $rootScope.HomeDir = array3[0];
//                            $rootScope.diskSpace = array3[1];
//                            var disk = array3[1].split(/(\s+)/);
//                            $rootScope.diskSpace = disk[4]+"/"+disk[2]+" ("+disk[8]+")";
                            $rootScope.CPU = array2[2]+"%";
                            var memory1 = array2[0];
                            var memory2 = array2[1];
                            var os1 = array2[3].replace(/OS Name:/g, '');
                            var os2 = array2[4].replace(/OS Version:/g, '');
                            var ds1 = array2[5].replace(/Total # of free bytes        :/g, '');
                            var ds2 = array2[6].replace(/Total # of bytes             :/g, '');
                            $rootScope.diskSpace = (ds1.trim()/(1024*1024*1024)).toFixed(2)+"GB/"+" "+(ds2.trim()/(1024*1024*1024)).toFixed(2)+"GB"+" ("+((ds1.trim()/ds2.trim()*100).toFixed(2))+"%)"; 
                            $rootScope.osVersion = os1.trim()+" "+os2.trim();
                            $rootScope.memorySpace = (memory2/(1024*1024)).toFixed(2)+"GB/"+(memory1/(1024*1024)).toFixed(2)+"GB"+" ("+((memory2/memory1*100).toFixed(2))+"%)";
//                            $rootScope.osVersion = array3[4];
                            $rootScope.buffer = '';
                            $rootScope.cache  = '';
                            $rootScope.windowTopMemoryProcess = array3[11].split("\n");
                            var j=0;
                            for(var i=0;i<$rootScope.windowTopMemoryProcess.length-3;i++){
                                if(i<20){
                                    $rootScope.windowTopMemory[i] = cleanArray($rootScope.windowTopMemoryProcess[i].split(" "));
                                }else{
                                    $rootScope.windowTopCPU[j] = cleanArray($rootScope.windowTopMemoryProcess[i].split(" "));
                                    j++;
                                }

                            }
                     }
                  }
             });
			 
			 $rootScope.getMenuData = function(){
						
					$http({
					url : "/getMenuData",
					method : "GET"
				})
				.success(function(data){     
					
				   if(data.success == 1){				   
						$rootScope.menus = data.msg.menus;		
				   }else{
						$rootScope.menus = '';
				   }

				});

				};
				$rootScope.getMenuData();	

				
				//automatic keyrotation 
				$rootScope.getKeyRotationDaysData = function(){
						
					$http({
					url : "/getKeyRotationDaysData",
					method : "GET"
				})
				.success(function(data){     
					
				   if(data.success == 1){				   
						$rootScope.rotationkeys = data.msg.rotationdays;		
				   }else{
						$rootScope.rotationkeys = '';
				   }

				});

				};
				$rootScope.getKeyRotationDaysData();	
				
				$rootScope.getKeyRotationUserData = function(serverid){
						
					$http({
					url : "/getKeyRotationUserData",
					data: {serverId:serverid},
					method : "POST"
				})
				.success(function(data){     
					
				   if(data.success == 1){				   
						$rootScope.userautorotation = data.msg.userautorotation;		
				   }else{
						$rootScope.userautorotation = '';
				   }

				});

				};
				$rootScope.getKeyRotationUserData(id);	
			
			
				$rootScope.autoRotateKeys = function(action,event,serverid){
				
				if(action == 'select-rotatekey'){
					
					var id = event.target.value;
					if(id != ''){
						$rootScope.keyId = id;
						$rootScope.IsRotateVisible = true;
					}
				}
				if(action == 'submit-rotatekey'){
					
					var rotateEmail = angular.element(document.querySelector( '#autoRotateEmail' ))[0].value;
					if(rotateEmail == ""){
						
						alert('Please enter an email');
						return false;
					}
					if(emailPattern.test(rotateEmail) == false){
						
						alert('Incorrect format of email.');
						return false;
					}
					
					if (confirm("Do you want to add the scheduler for key rotation?")) {
						
						$rootScope.modal_class = "modal-backdrop fade in loader";
						$rootScope.serverId = serverid;
						$http({
								method: "post",
								url: "/createAutoKeyRotation",
								data: {serverId:$rootScope.serverId,keyId:$rootScope.keyId,email:rotateEmail},
								headers: {"Content-Type": "application/json"}
						})
						.success(function (data){
							
							body.removeClass("overflowHidden");
							$rootScope.modal_class = "";
							if(data.success==1){
								
								alert('Scheduler has been created.');
								$rootScope.getKeyRotationUserData($rootScope.serverid);	
								
							}else{
								alert('Error occurred while creating scheduler.');
							}
							
						});
					}
					
				}				
				if(action == 'update-rotatekey'){
					
					var rotateKeyDay = angular.element(document.querySelector( '#rotateKeyDay' ))[0].value;
					if (confirm("Do you want to update the scheduler for key rotation?")) {
						
						$rootScope.modal_class = "modal-backdrop fade in loader";
						$rootScope.serverId = serverid;
						$http({
								method: "post",
								url: "/updateAutoKeyRotation",
								data: {keyId:event,rid:rotateKeyDay},
								headers: {"Content-Type": "application/json"}
						})
						.success(function (data){
							
							body.removeClass("overflowHidden");
							$rootScope.modal_class = "";
							if(data.success==1){
								
								alert('Scheduler has been updated.');
								$rootScope.getKeyRotationUserData($rootScope.serverid);	
								
							}else{
								alert('Error occurred while creating scheduler.');
							}
							
						});
					}
				}
				if(action == 'delete-rotatekey'){
					
					var rotateKeyDay = angular.element(document.querySelector( '#rotateKeyDay' ))[0].value;
					if (confirm("Do you want to delete the scheduler for key rotation?")) {
						
						$rootScope.modal_class = "modal-backdrop fade in loader";
						$rootScope.serverId = serverid;
						$http({
								method: "post",
								url: "/deleteAutoKeyRotation",
								data: {keyId:event},
								headers: {"Content-Type": "application/json"}
						})
						.success(function (data){
							
							body.removeClass("overflowHidden");
							$rootScope.modal_class = "";
							if(data.success==1){
								
								alert('Scheduler has been deleted.');
								$rootScope.getKeyRotationUserData($rootScope.serverid);	
								$rootScope.IsRotateVisible = false;
								
							}else{
								alert('Error occurred while creating scheduler.');
							}
							
						});
					}
				}
				
				};		
			
				$rootScope.changeTab = function (id,url) {            
						window.location = url;
				};
				
			 
                $rootScope.clickAutomation = function () {
                    $rootScope.response = "";
                    $rootScope.Output = false;
                };
                $rootScope.clearRunCommand = function () {
                    $rootScope.responseCommand = "";
                    $('.scriptToRun').val("");
                    $rootScope.Output = false;
                };
                $rootScope.backKey = function(){
                    $rootScope.count = 2;
                };
             $rootScope.startStopInstance = function (server_id){
                 Captcha();
                 document.getElementById('CaptchaInput').value ="";
                 $rootScope.warningMsg = "";
                 $rootScope.heading = ""; 
                 $rootScope.url = ""; 
                 $rootScope.success_msg = ""; 
                 $rootScope.error_msg = ""; 
                 $rootScope.serverId = server_id;
                  if($('.instance').prop("checked") == true){
                      $rootScope.heading = "Start Instance";
                      $rootScope.warningMsg = "This action will start the server which will add cost to your bill. Do you want to continue ?";
                      $rootScope.url = "startInstances";
                      $rootScope.success_msg = "Instance has started successfully.";
                      $rootScope.error_msg = "There is some error to start instances.";
                  }else{
                      $rootScope.heading = "Stop Instance";
                      $rootScope.warningMsg = "This action will stop the server.If data is not backed up on EBS volume, it will be lost. Do you want to continue ?"; 
                      $rootScope.url = "stopInstances"; 
                      $rootScope.success_msg = "Instance has stopped successfully.";
                      $rootScope.error_msg = "There is some error to stop instances.";
                  }
                  $rootScope.start_stop_instance = $rootScope.start_stop_instance ? false : true;
                  if($rootScope.start_stop_instance){
                       body.addClass("overflowHidden");
                       $rootScope.modal_class = "modal-backdrop fade in";
                  }else{
                       body.removeClass("overflowHidden");
                       $rootScope.modal_class = "";
                  }
             };
             $rootScope.createPatchMW = function (server_id){
                $rootScope.serverId = server_id;
                $rootScope.patchName = "";
                $rootScope.duration = "";
                $rootScope.cutOff = "";
                $rootScope.operationType = "";
                $rootScope.errName = false;
                $rootScope.errSpace = false;
                $rootScope.errLetter = false;
                $rootScope.errCron = false;
                $rootScope.errDuration = false;
                $rootScope.errCutoff = false;
                $rootScope.errCut = false;
                $rootScope.erroptype = false;
               $rootScope.patch_window = $rootScope.patch_window ? false : true;
               if($rootScope.patch_window){
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
               }else{
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
               }
             };
			 
			 $rootScope.installPatchBaselineMW = function (server_id){					
					
					if($rootScope.patches == ""){
						alert('No missing patches');
						return false;
					}else{
						
						if (confirm("Do you want to install the patches?")) {
							
							$rootScope.modal_class = "modal-backdrop fade in loader";
							$rootScope.serverId = server_id;
							$http({
									method: "post",
									url: "/installPatchBaselineMW",
									data: {serverId:$rootScope.serverId},
									headers: {"Content-Type": "application/json"}
							})
							.success(function (data){
								
								body.removeClass("overflowHidden");
								$rootScope.modal_class = "";
								if(data.success==1){
									
									if(data.response == 'Failure'){
										alert('Status Failed : Patches are not installed properly');
									}else{
										alert('Status Success : Patches are installed properly');
									}
									
									$rootScope.patches = '';
								}else{
									alert('Error occurred while installing patches.');
								}
								
							});
						}
					
					}			 
			 };
			 
			 $rootScope.installPatchMW = function (server_id){
                $rootScope.serverId = server_id;
                
				var patchName       = 'InsPatch';
				var minute          = '*';
				var hour            = '*';
				var day_of_month    = '*';
				var month           = '*';
				//var day_of_week     = $rootScope.day_of_week;
				var day_of_week     = "?";
				var year            = "*";
				var duration        = 4;
				var cutOff          = 1;
				var operationType   = 'Install';
				var cron            = "cron(" + minute + " " + hour + " " + day_of_month + " " + month + " " + day_of_week + " " + year+ ")";
				var cronvalue       = "cron(" + $rootScope.cronvalue+" *)";
                                              
				$http({
					method: "post",
					url: "/createPatchMW",
					data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType,patchScript:0},
					headers: {"Content-Type": "application/json"}
			   })
			   .success(function (data){
                          
                    if(data.success==1){
                                
					if( data.platform != 'Linux' ){
					
						$rootScope.modal_class = "";

						$http({
							method: "post",
							url: "/patchList",
							data: {serverId: $rootScope.serverId},
							headers: {"Content-Type": "application/json"}
						})
						.success(function (data) {
							$rootScope.patchList = data;
							alert("Patch MW has been created successfully.");
						});
					}else{
				
						var dataResponse = JSON.parse(data.response);
						var WindowId    = dataResponse['WindowId'];
						$http({
							method: "post",
							url: "/createPatchMW",
							data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType,patchScript:1,WindowId:WindowId},
							headers: {"Content-Type": "application/json"}
						})
						.success(function (data){

							if(data.success==1){

								var dataResponse = JSON.parse(data.response);
								var WindowTargetId    = dataResponse['WindowTargetId'];
								$http({
									method: "post",
									url: "/createPatchMW",
									data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType,patchScript:2,WindowId:WindowId,WindowTargetId:WindowTargetId},
									headers: {"Content-Type": "application/json"}
								})
								.success(function (data){
        
									if(data.success==1){
										
										$rootScope.modal_class = "";

										$http({
											method: "post",
											url: "/patchList",
											data: {serverId: $rootScope.serverId},
											headers: {"Content-Type": "application/json"}
										})
										.success(function (data) {
											$rootScope.patchList = data;
											alert("Patch MW has been created successfully.");
										});
										
									}
                                });
                             }
                        });
					}				
                                
				  }else if (data.success==0){
						alert("There is some error to add patch MW.Please try again.");
				  }
				});
				
				
				$timeout( function(){
					
					$http({
						 method: "post",
						 url: "/deleteInsPatchMW",
						 data: {serverId:$rootScope.serverId},
						 headers: {"Content-Type": "application/json"}
					})
                    .success(function (data) {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                        if(data.success==1){
                            $rootScope.patchList.splice($rootScope.deleteIndex , 1);
                        }else if (data.success==0){
                            alert("There is some problem to delete this patch. Please try again.");
                        }
                    });
					
				}, 420000 );
				
             };
			 
              $rootScope.deletePatchMW = function (server_id,window_id,patch_id,index){
                $rootScope.serverId = server_id;
                $rootScope.windowId = window_id;
                $rootScope.patchId = patch_id;
                $rootScope.deleteIndex = index;
                $rootScope.delete_patch = $rootScope.delete_patch ? false : true;
                if($rootScope.delete_patch){
                     body.addClass("overflowHidden");
                     $rootScope.modal_class = "modal-backdrop fade in";
                }else{
                     body.removeClass("overflowHidden");
                     $rootScope.modal_class = "";
                }      
              };
              $rootScope.executionDetails = function (server_id,window_id){
                 $rootScope.modal_class = "modal-backdrop fade in loader"; 
                 $http({
                     method: "post",
                     url: "/patchExecutionDetails",
                     data: {serverId:server_id,windowId:window_id},
                     headers: {"Content-Type": "application/json"}
                  })
                    .success(function (data) {
                        $rootScope.modal_class = ""; 
                        $rootScope.patchExecutionData = data.output.WindowExecutions;
                        $rootScope.patchExecutionDetails = $rootScope.patchExecutionDetails ? false : true;
                        if($rootScope.patchExecutionDetails){
                             body.addClass("overflowHidden");
                             $rootScope.modal_class = "modal-backdrop fade in";
                        }else{
                             body.removeClass("overflowHidden");
                             $rootScope.modal_class = "";
                        }   
                    });
              };
             $rootScope.LoadPatches = function (server_id){
                 $rootScope.modal_class = "modal-backdrop fade in loader";
                 $http({
                     method: "post",
                     url: "/patchManagement",
                     data: {serverId:server_id},
                     headers: {"Content-Type": "application/json"}
                  })
                    .success(function (data) {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                        if(data.success==1){
                            $rootScope.patches = data.output.Patches;
                        }else if (data.success==0){
                            $rootScope.patches = data.output;
                        }
                    });
             };
			 
			 $rootScope.ShowCloudTrail = function (instanceId,serverId){
                 $rootScope.modal_class = "modal-backdrop fade in loader";
                 $http({
                     method: "post",
                     url: "/CloudTrail",
                     data: {instanceId:instanceId,serverId:serverId},
                     headers: {"Content-Type": "application/json"}
                  })
                    .success(function (data) {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                        if(data.success==1){
                            var cloudTrail = data.output;
                            $rootScope.cloudTrail=[];
                            for(var i=0;i<cloudTrail.Events.length;i++){
                                $rootScope.cloudTrail[i] = cloudTrail.Events[i];
                                $rootScope.cloudTrail[i].CloudTrailEvent = JSON.parse(cloudTrail.Events[i].CloudTrailEvent);
                            }
                        }else if (data.success==0){
                            $rootScope.cloudTrailError = data.output;
                        }
                    });
             };
			 
             $rootScope.LoadCloudTrail = function (instanceId,serverId){
                 $rootScope.modal_class = "modal-backdrop fade in loader";
                 $http({
                     method: "post",
                     url: "/CloudTrail",
                     data: {instanceId:instanceId,serverId:serverId},
                     headers: {"Content-Type": "application/json"}
                  })
                    .success(function (data) {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                        if(data.success==1){
                            var cloudTrail = data.output;
                            $rootScope.cloudTrail=[];
                            for(var i=0;i<cloudTrail.Events.length;i++){
                                $rootScope.cloudTrail[i] = cloudTrail.Events[i];
                                $rootScope.cloudTrail[i].CloudTrailEvent = JSON.parse(cloudTrail.Events[i].CloudTrailEvent);
                            }
                        }else if (data.success==0){
                            $rootScope.cloudTrailError = data.output;
                        }
                    });
             };
             $rootScope.downloadPrivateKeyModal = function (server_id, server_user_id, uname, privateKey) {
                        $rootScope.serverId = server_id;
                        $rootScope.serverUserId = server_user_id;
                        $rootScope.uname = uname;
			$rootScope.privateKey=privateKey;
                        var blob = new Blob([$rootScope.privateKey], { type: 'text/plain' }),
                        url = $window.URL || $window.webkitURL;
                        $rootScope.fileUrl = url.createObjectURL(blob);
                        $http({
                            method: "post",
                            url: "/DownloadKeyTrail",
                            data: {server_user_id: server_user_id, serverId: server_id},
                            headers: {"Content-Type": "application/json"}
                            })
                                .success(function (data) {
                                });
            };
             $rootScope.deleteServerUser = function (username,server_user_id,server_id,user_index){
                user_obj = {};
		user_obj.uname = username;
		user_obj.serverId = server_id;
		user_obj.search = 1;
                user_obj.serveruserId = server_user_id;
                $rootScope.userIndex = user_index;
                $rootScope.delete_server_user = $rootScope.delete_server_user ? false : true;
		if($rootScope.delete_server_user) {
                   body.addClass("overflowHidden");
                   $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                   body.removeClass("overflowHidden");
                   $rootScope.modal_class = "";
               }
             };
             $rootScope.cleanMemory = function (script,serverIp,val){
                var confirm_msg ='';
                var success_msg ='';
                var failure_msg ='';
                var script_id;
                if(val=="1"){
                    confirm_msg = "Are you sure want to free pagecache?";
                    success_msg = "pagecache has been free successfully.";
                    failure_msg = "There is some error to free pagecache.";
                    script_id = "-2";
                }else if(val=="2"){
                    confirm_msg = "Are you sure want to free dentries and inodes?";
                    success_msg = "dentries and inodes has been free successfully.";
                    failure_msg = "There is some error to free dentries and inodes.";
                    script_id = "-3";
                }else{
                    confirm_msg = "Are you sure want to free  free pagecache, dentries and inodes?";
                    success_msg = "pagecache, dentries and inodes has been free successfully.";
                    failure_msg = "There is some error to free pagecache, dentries and inodes.";
                    script_id = "-4";
                }
                if(confirm(confirm_msg)){
                   $rootScope.modal_class = "modal-backdrop fade in loader";
                    $http({
                     method: "post",
                     url: "/runScript",
                     data: {script:script,serverIp:serverIp,serverId:id,script_id:script_id},
                     headers: {"Content-Type": "application/json"}
                  })
                    .success(function (data) {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                        if(data.success==1){
                            alert(success_msg);
                        }else if (data.success==0){
                            alert(failure_msg);
                        }
                    });
                }
             };
             $rootScope.refreshUserList = function (server_id){
                 $rootScope.modal_class = "modal-backdrop fade in loader";
                 $http({
				url: "/refreshUserList",
				method: "POST",
				data:{'serverId':server_id},
				headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
                                if(data.success==1){
                                    alert("User list has been refreshed successfully.");
                                    $rootScope.serverUserList = data.output;
                                }else{
                                    alert("There is some error to refresh user list.Please try again.");
                                }
				$rootScope.modal_class = "";
			});
             };
                $rootScope.showRotateKeyModal = function (server_id,server_user_id,uname,uemail){
                        $rootScope.serverId =  server_id;
                        $rootScope.serverUserId =  server_user_id;
                        $rootScope.uname =  uname;
                        $rootScope.uemail =  uemail;
                        $rootScope.emailError = false;
                        $('#sendKey').prop('checked',true);
                        $rootScope.inputEmail = false;
                        if (uemail != ""){
                            $rootScope.Email = uemail;
                        }else {
                            $rootScope.Email = "";
                        }
                        $rootScope.server_rotate_key = $rootScope.server_rotate_key ? false : true;
                        if($rootScope.server_rotate_key) {
                            body.addClass("overflowHidden");
                            $rootScope.modal_class = "modal-backdrop fade in";
                        } else {
                            body.removeClass("overflowHidden");
                            $rootScope.modal_class = "";
                        }
                };
                $rootScope.sendRotateKey = function(){
                    if ($('#sendKey').prop('checked') == false){
                            $rootScope.inputEmail = true;
                            $rootScope.emailError = false;
                        } else {
                            $rootScope.inputEmail = false;
                            if ($rootScope.uemail != ""){
                            $rootScope.Email = $rootScope.uemail;
                            } else {
                            $rootScope.Email = "";
                            }
                        }
                };
                 $rootScope.createServerScriptModel = function (project_id){
                        $rootScope.serverArray = [];
                        $rootScope.serverArray.push(id);
                        $rootScope.projectId = project_id;
                        $rootScope.create_script = $rootScope.create_script ? false : true;
                        $rootScope.scriptName = "";
                        $rootScope.scriptDesc = "";
                        $rootScope.script = "";
                        $rootScope.create_script_err_msg = "";
                        $rootScope.showParameter = false;
                        $rootScope.parameters = [];
                        $rootScope.errName = false;
                        $rootScope.errDesc = false;
                        $rootScope.errScript = false;
                        if ($rootScope.create_script) {
                            body.addClass("overflowHidden");
                            $rootScope.modal_class = "modal-backdrop fade in";
                        } else {
                            body.removeClass("overflowHidden");
                            $rootScope.modal_class = "";
                        }
            };
            $rootScope.showPass = function () {
                $rootScope.showPassword = true;
            };
            $rootScope.hidePass = function () {
                $rootScope.showPassword = false;
            };
            /* $rootScope.addParameter = function () {
                var text = $('#textArea').val();
                var lines = text.split(/\r|\r\n|\n/);
                var count = lines.length;
                if ($rootScope.scriptName != "" && $rootScope.scriptDesc != "" && $rootScope.script != "") {
                    if (count == 1) {
                        $rootScope.showParameter = true;
                        $rootScope.parameters.push({});
                        $rootScope.create_script_err_msg = "";
                    } else {
                        $rootScope.parameters.splice(0);
                        $rootScope.create_script_err_msg = "Parameters allowed only for one line script";
                    }
                } else {
                    $rootScope.create_script_err_msg = "Please fill all the details";
                }
            };
            $rootScope.deleteParameter = function (parIndex) {
                $rootScope.parameters.splice(parIndex, 1);
            }; */
            $rootScope.showOutputModel = function (script,script_output){
                $rootScope.trailScript = script;
                $rootScope.trailScriptOutput = script_output;
                $rootScope.trail_output = $rootScope.trail_output ? false : true;
                if($rootScope.trail_output){
                     body.addClass("overflowHidden");
                     $rootScope.modal_class = "modal-backdrop fade in";
                }else{
                     body.removeClass("overflowHidden");
                     $rootScope.modal_class = "";
                }
            };
             $scope.showOptions = function(index) {
		if(local_index != index){
			$scope.visible = false;
		}
		local_index = index;
		$scope.visible = $scope.visible ? false : true;
	};
            $rootScope.loginToServer = function (globalhost,serverId,companyId,instanceId,customerIAMId,agentVersion,region,globalHostname,vpcId){
                if(customerIAMId==null){
                    alert("Login credentials are not assigned for this server. Please contact Administrator.");
                    return;
                }
                if(agentVersion < 2){
                    alert("SSH feature is not updated on this server. Please contact Administrator.");
                    return;
                }
                if(instanceId == null){
                    alert("Instance id is not updated on this server. Please contact Administrator.");
                    return;
                }
                if(globalHostname == null){
                    alert("Gloab hostname is not updated on this server. Please contact Administrator.");
                    return;
                }
                if(region == null){
                    alert("Region is not updated on this server. Please contact Administrator.");
                    return;
                }
                if(vpcId == null){
                    alert("VPC id is not updated on this server. Please contact Administrator.");
                    return;
                }
                $rootScope.modal_class = "modal-backdrop fade in loader";
                $http({
                        method: "post",
                        url: "/createSecurityGroup",
                        data:{'serverId':serverId,'companyId':companyId , 'instanceId':instanceId},
                        headers: {"Content-Type": "application/json"}
                    })
                    .success(function (data){
                        if(data.success==1){
                            var code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                            $http({
                                    method: "post",
                                    url: "/addLoginCode",
                                    data:{'code':code},
                                    headers: {"Content-Type": "application/json"}
                                })
                                .success(function (data){
                                    if(data.success==1){
                                        $rootScope.modal_class="";
                                       window.open("http://"+globalhost+":5256/index.php?c="+code+"&id="+data.row_id);
                                    }
                             });
                        }else{
                           $rootScope.modal_class="";
                           alert(data.err_desc); 
                        }
                 });
    };
            $http({
                method: "post",
                url: "/getEachServerPageDetails",
                headers: {"Content-Type": "application/json"},
                data: {id: id}
            })
                    .success(function (data) {
                        for (var x in data) {
                            var users = [];
                            data[x].users = [];
                            if (data[x].userList != null)
                                users = data[x].userList.toString().split(",");
                            data[x].users = users;
                        }
                        $scope.servers = data;
						$rootScope.serverid = $scope.servers[0].id;
                        $rootScope.instanceDetails = JSON.parse($scope.servers[0].raw_data);
                        $rootScope.homeDir = $scope.servers[0].home_directory;
                        $rootScope.CPU = $scope.servers[0].cpu_per;
                        $rootScope.diskSpace = $scope.servers[0].disk_per;
                        $rootScope.memorySpace = $scope.servers[0].memory_per;
                        $rootScope.osVersion = $scope.servers[0].os_version;
                        $rootScope.buffer = $scope.servers[0].buffer;
                        $rootScope.cache = $scope.servers[0].cache;
                        $rootScope.topMemory = [];
                        $rootScope.topCPU = [];
                        $rootScope.instaceFlag =$scope.servers[0].instance_flag; 
						
						if($scope.servers[0].PublicIpAddress !="" && $scope.servers[0].PublicIpAddress != undefined && $scope.servers[0].PublicIpAddress != null){
							
							$rootScope.PublicIpAddress = $scope.servers[0].PublicIpAddress;
						}else{
							$rootScope.PublicIpAddress = $rootScope.instanceDetails.PublicIpAddress;
						}
						
						
						
						//Progress Bar code 

                        if($rootScope.CPU == null){
                          $rootScope.cpuPercentage = 0;
                        }else{
                          var cpuValue = $rootScope.CPU.slice(0, -1);
                          if(cpuValue == 'undefined'){
                            $rootScope.cpuPercentage = 0;
                          }else{
                            $rootScope.cpuPercentage = cpuValue;
                          }
                        }
                        
                        $rootScope.cpuWidth = $rootScope.cpuPercentage + '%';
                        console.log($rootScope.cpuWidth);

                        if($rootScope.diskSpace == null){
                          $rootScope.diskPercentage = 0;
                        }else{
                          var diskValue = $rootScope.diskSpace.split('(').pop().split('%').shift();
                          if(diskValue == 'NaN'){
                            $rootScope.diskPercentage = 0;
                          }else{
                            $rootScope.diskPercentage = diskValue;
                          }
                        }
                        $rootScope.diskWidth = $rootScope.diskPercentage + '%';
                        console.log($rootScope.diskWidth);


                        if($rootScope.memorySpace == null){
                          $rootScope.memoryPercentage = 0;
                        }else{
                          var memValue = $rootScope.memorySpace.split('(').pop().split('%').shift();
                          if(memValue == 'NaN'){
                            $rootScope.memoryPercentage = 0;
                          }else{
                            $rootScope.memoryPercentage = memValue;
                          }
                        }
                        $rootScope.memoryWidth = $rootScope.memoryPercentage + '%';
                        console.log($rootScope.memoryWidth);

                        //Progress Bar code
						
						
                        var group_name='';
                        var group_id='';
                        if ($rootScope.instanceDetails !=null){
                        for(var i=0 ; i < $rootScope.instanceDetails.SecurityGroups.length ; i++){
                            group_name += $rootScope.instanceDetails.SecurityGroups[i].GroupName+" , ";
                            group_id += $rootScope.instanceDetails.SecurityGroups[i].GroupId+" , ";
                            }
                        }
                        $rootScope.groupName = group_name.replace(/,\s*$/, "");
                        $rootScope.groupId = group_id.replace(/,\s*$/, "");
                        if ($scope.servers == null) {
                            $scope.servers = [];
                        }
                    });

            $rootScope.close = function(value) {
	  	if(value == "user_ok"){	
			//var required_cond = $rootScope.emailForm.userEmail.$error.required;
			if ($rootScope.emailValid == true){
                            $rootScope.listStatus = false;
                            $rootScope.emailError = true;
                            $rootScope.emailValid = false;	
                            return;
			} else if ($rootScope.userEmail == "" || $rootScope.userEmail == undefined){
                            $rootScope.emailError = true;
                            return;
                        } else {
							
							if(user_obj.serverId != undefined && user_obj.serverId != null && user_obj.serverId != ''){
								
								$rootScope.visible_add_user = $rootScope.visible_add_user ? false : true;
								$rootScope.modal_class = "modal-backdrop fade in loader";
								$http({
									url: "/addUserToServer",
									method: "POST",
									data: user_obj,
									headers: {"Content-Type": "application/json"}
								})
								.success(function(data){
                                if(data.success==1){
                                    alert("User has been added successfully.");
                                }else if(data.success==2){
                                    alert("Sorry! This user already exists.");
                                }else {
                                    alert("There is some error to add this user.Please try again.");
                                }
                                $rootScope.modal_class = "";
									//if(data.privateKey != undefined){
												//email snippet here]
									//     				if(user_obj.search ==2){
									//     				var userCredentials = {uname : user_obj.user.uname, passw :user_obj.user.passw,email:user_obj.user.email,serverIp:ip_addr};
									//						$http({
									//					 	url : mailUserCredentialsUrl,
									//					 	data : userCredentials,
									//					 	method : "post",
									//					 	headers: {'Content-Type': 'application/json'},
									//					    }).success(function(data){
									//					 	    });
									//					}
									//}
								});
								
							}else{
								
								alert("This email address is not associated with us.");
								return false;
							}
							
                            
			}
		}
		else if(value == "user_cancel"){
			$rootScope.visible_add_user = $rootScope.visible_add_user ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
		else if(value == "deleteUserOk"){
			$rootScope.modal_class = "";
                        $rootScope.visible_delete_user = $rootScope.visible_delete_user ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in loader";
			var required_cond = $rootScope.deleteUserForm.userName.$error.required;
			$rootScope.listStatus = false;
			$rootScope.users = [];
			if (required_cond == undefined) {
			$http({
				url: "/deleteUserFromServer",
				method: "POST",
				data: user_obj,
				headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
                                if(data.success==1){
                                    $rootScope.serverUserList.splice($rootScope.userIndex , 1);
                                    alert("User has been deleted successfully.");
                                }else{
                                    alert("There is some error to delete this user.Please try again.");
                                }
				$rootScope.modal_class = "";
			});

			}
		}else if(value == "user_delete_ok"){
			$rootScope.modal_class = "";
                        $rootScope.delete_server_user = $rootScope.delete_server_user ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in loader";
			$rootScope.listStatus = false;
			$rootScope.users = [];
			if (required_cond == undefined) {
			$http({
				url: "/deleteUserFromServer",
				method: "POST",
				data: user_obj,
				headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
                                if(data.success==1){
                                    $rootScope.serverUserList.splice($rootScope.userIndex , 1);
                                    alert("User has been deleted successfully.");
                                }else{
                                    alert("There is some error to delete this user.Please try again.");
                                }
				$rootScope.modal_class = "";
			});

			}
		}else if(value == "user_delete_cancel"){
			$rootScope.delete_server_user = $rootScope.delete_server_user ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
		else if(value == "deleteUserCancel"){
			$rootScope.visible_delete_user = $rootScope.visible_delete_user ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		} 
		else if(value == "serverLockdownCancel"){

			$rootScope.visibleLockdown = $rootScope.visibleLockdown ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
		else if(value == "serverLockdownOk"){
                        $rootScope.visibleLockdown = $rootScope.visibleLockdown ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
                        $rootScope.modal_class = "modal-backdrop fade in loader";
			var data = {serverId: ip_addr};
			$http({
			url: "/lockDownServer",
			method: "POST",
			data: data,
			headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
                            $rootScope.modal_class = "";
                            if(data.success==1){
                                alert("Server Lockdown successfully.");
                                location.reload();
                            }else{
                                alert("There is some error to Lockdown server");
                            }
			});
		}
		else if(value == "serverUnlockCancel"){

			$rootScope.visibleUnlock = $rootScope.visibleUnlock ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
		else if(value == "serverUnlockOk"){
                        $rootScope.visibleUnlock = $rootScope.visibleUnlock ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
                        $rootScope.modal_class = "modal-backdrop fade in loader";
			var data = {serverId: ip_addr};
			$http({
			url: "/unlockServer",
			method: "POST",
			data: data,
			headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
                            $rootScope.modal_class = "";
                            if(data.success==1){
                                alert("Server Lockdown successfully.");
                                location.reload();
                            }else{
                                alert("There is some error to Lockdown server");
                            }					
			});
		}
		else if(value == "privilegeOk"){
			var required_cond = $rootScope.privilegeForm.userName.$error.required;
			user_obj.userRole = $rootScope.privilege;
			if(required_cond == undefined) {
			$http({
				url: "/changeUserPrivilege",
				method: "POST",
				data: user_obj,
				headers: {"Content-Type": "application/json"}
			})
			.success(function(data){
				if(data.success == 0){
					$rootScope.userExist = false;
				}
				else {
				$rootScope.visible_privilege = $rootScope.visible_privilege ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
				$rootScope.userExist = true;
				}
			});

			}
		}
		else if(value == "privilegeCancel"){
			$rootScope.visible_privilege = $rootScope.visible_privilege ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}

		else if(value == "server_cancel"){
				$rootScope.visible_server = $rootScope.visible_server ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
		else if(value == "server_ok"){
					var sname = "";
					$rootScope.errName = false;
					sname = $rootScope.serverName;
					if(sname == undefined || sname.trim().length <= 0){
						$rootScope.errName = true;
						return;
					}else{
						$rootScope.errName = false;
						serverName = sname.trim();
						$rootScope.visible_server = false;
						body.removeClass("overflowHidden");
						$rootScope.modal_class = "";
						$scope.showCommandModal();
					}
				
			}
			else if(value == "command"){
				$rootScope.visible_command = $rootScope.visible_command ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
			else if(value == "processListCancel"){

			$rootScope.visibleProcessList = $rootScope.visibleProcessList ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
			}
			else if(value == "processListOk"){
	            $rootScope.visibleProcessList = $rootScope.visibleProcessList ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
				
			}else if(value == "getAccessKeyCancel"){

			$rootScope.visibleGetAccessKey = $rootScope.visibleGetAccessKey ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
			}
			else if(value == "getAccessKeyOk"){
				
	            $rootScope.visibleGetAccessKey = $rootScope.visibleGetAccessKey ? false : true;
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
				// call method to generate new access key-pair and update agentActivities
				$http({
				url: "/getAccessKey",
				method: "POST",
				data: {serverId:ip_addr,name:$rootScope.name},
				headers: {"Content-Type": "application/json"}
				})
				.success(function(data){
					
					

				});
			}else if(value == "cronjob_cancel"){
			$rootScope.visible_cronjob = $rootScope.visible_cronjob ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}else if (value == "cronjob_ok") {
                    var job_command = "";
                    var job_name = "";
                    var minute = $rootScope.minute;
                    var hour = $rootScope.hour;
                    var day_of_month = $rootScope.day_of_month;
                    var month = $rootScope.month;
                    var day_of_week = $rootScope.day_of_week;
					var cronvalue = $rootScope.cronvalue;
                    var servers = [];
                        for (var x in $scope.servers){
                            servers[x] = $scope.servers[x].id;
                        }
                    $rootScope.errName = false;
                    $rootScope.errCommand = false;
                    job_name = $rootScope.jobName;
                    job_command = $rootScope.jobCommand;
                    if (job_name == undefined || job_name.trim().length <= 0) {
                        $rootScope.errName = true;
                        return;
                    } else if (job_command == undefined || job_command.trim().length <= 0) {
                        $rootScope.errCommand = true;
                        return;
                    } else {
                        $rootScope.modal_class = "";
                        $rootScope.visible_cronjob = $rootScope.visible_cronjob ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in loader";
                        $rootScope.errName = false;
                        $rootScope.errCommand = false;
                        $http({
                            method: "POST",
                            url: "/createProjectCron",
                            data: {job_name: job_name, job_command: job_command.trim(), minute: minute, hour: hour, day_of_month: day_of_month, month: month, day_of_week: day_of_week,servers:servers, projectId:id, cronvalue:cronvalue,serverId:id},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            $rootScope.modal_class ="";
                            if (data.success == 1) {
                                var result_data = {job_name: job_name, job_command: job_command.trim(), id: data.row_id, minute: minute, hour: hour, day_of_month: day_of_month, month: month, day_of_week: day_of_week};
                                $rootScope.CronJobs.push(result_data);
                                alert("cron has been added successfully.");
                            } else if (data.success == 0) {
                                $rootScope.cron_job_err_msg = "Internal Error!";
                                alert("Internal Error!");
                            } else if (data.success == 2) {
                                $rootScope.cron_job_err_msg = data.err_desc;
                                alert(data.err_desc);
                            }
                        });
                    }
                }       else if(value == "edit_cronjob_cancel"){
			$rootScope.edit_cronjob = $rootScope.edit_cronjob ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}       else if (value == "edit_cronjob_ok") {
                        var job_command = $rootScope.jobCommand;
                        var job_name = $rootScope.jobName;
                        var minute = $rootScope.minute;
                        var hour = $rootScope.hour;
                        var day_of_month = $rootScope.day_of_month;
                        var month = $rootScope.month;
                        var day_of_week = $rootScope.day_of_week;
                        var oldCronDetails = $rootScope.oldCronDetails;
						var cronvalue = $rootScope.cronvalue;
                        var servers = [];
                        for (var x in $scope.servers){
                            servers[x] = $scope.servers[x].id;
                        }
                        $rootScope.modal_class = "";
                        $rootScope.edit_cronjob = $rootScope.edit_cronjob ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in loader";
                        $http({
                            method: "POST",
                            url: "/editProjectCron",
                            data: {job_name: job_name, job_command: job_command.trim(), minute: minute, hour: hour, day_of_month: day_of_month, month: month, day_of_week: day_of_week, oldCronDetails: oldCronDetails, servers:servers, projectId:id,serverId:id},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            $rootScope.modal_class ="";
                            if (data.success == 1) {
                                var result_data = {job_name: job_name, job_command: job_command.trim(), id: data.row_id, minute: minute, hour: hour, day_of_month: day_of_month, month: month, day_of_week: day_of_week};
                                $rootScope.CronJobs.splice($rootScope.jobIndex, 1, result_data);
                                alert("Cron has been edited successfully");
                            } else if (data.success == 0) {
                                $rootScope.cron_job_err_msg = "Internal Error!";
                                alert("Internal Error!");
                            } else if (data.success == 2) {
                                $rootScope.cron_job_err_msg = data.err_desc;
                                alert(data.err_desc);
                            }
                        });
                }
                        else if(value == "delete_cron_cancel"){
                                $rootScope.delete_cron_from_server = $rootScope.delete_cron_from_server ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                        }
                        else if(value == "delete_cron_from_server_ok"){
                            var cronId = "";
                            var serverId = "";
                            var cronDetails = "";
                            var serverIp = "";
                            var server_job_name = "";
                            cronId = $rootScope.cronId;
                            serverId = $rootScope.serverId;
                            cronDetails = $rootScope.cronDetails;
                            serverIp= $rootScope.serverIp;
                            server_job_name = $rootScope.server_job_name;
                            $rootScope.modal_class = "";
                            $rootScope.delete_cron_from_server = $rootScope.delete_cron_from_server ? false : true;
                            body.removeClass("overflowHidden");
                            $rootScope.modal_class = "modal-backdrop fade in loader";
                            $http({
				url: "/deleteCronFromServer",
				method: "POST",
				data: {cronId:cronId,serverId:serverId,cronDetails:cronDetails,serverIp:serverIp,server_job_name:server_job_name},
				headers: {"Content-Type": "application/json"}
				})
				.success(function(data){
                                    $rootScope.modal_class = "";
                                    if (data.success == 1) {
                                        $rootScope.CronJobs.splice($rootScope.index, 1);
                                        alert("cron has been deleted successfully.");
                                    } else if (data.success == 0) {
                                        $rootScope.cron_delete_err_msg = "Internal Error!";
                                        alert("Internal Error!");
                                    } else if (data.success == 2) {
                                        $rootScope.cron_delete_err_msg = data.err_desc;
                                        alert(data.err_desc);
                                    }
				});
                        }else if(value == "kill_process_cancel"){
                                $rootScope.kill_process = $rootScope.kill_process ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                        }else if(value == "close_view_script"){
                                $rootScope.view_script = $rootScope.view_script ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                        }else if (value == "assign_parameter_cancel") {
                                $rootScope.assign_parameter = $rootScope.assign_parameter ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                        }else if (value == "assign_parameter_ok"){
                                var script_id = $rootScope.scriptId;
                                var script_name = $rootScope.scriptName;
                                var script_desc = $rootScope.scriptDesc;
                                var script = $rootScope.script;
                                var serverIp = $rootScope.serverIp;
                                var serverId = $rootScope.serverId;
                                $rootScope.commands = [];
                                for (var i = 0; i < $rootScope.parameters.length; i++) {
                                    $rootScope.commands[i] = $rootScope.parameters[i].commandName;
                                    if ($rootScope.commands[i] != undefined){
                                        script = script.replace("$" + $rootScope.parameters[i].parameterName, $rootScope.commands[i]);
                                    } else {
                                        script = script.replace("$" + $rootScope.parameters[i].parameterName, "");    
                                    }
                                }
                                $rootScope.assign_parameter = $rootScope.assign_parameter ? false : true;
                                $rootScope.modal_class = "modal-backdrop fade in loader";
                                $http({
                                method: "post",
                                url: "/runScript",
                                data: {script_id: script_id, script_name: script_name, script: script, serverIp: serverIp, serverId: serverId, script_desc: script_desc,runCommand:$rootScope.runCommand},
                                headers: {"Content-Type": "application/json"}
                                })
                                .success(function (data) {
                                $http({
                                    method: "post",
                                    url: "/getServerTrail",
                                    data: {server_id: serverId},
                                    headers: {"Content-Type": "application/json"}
                                })
                                        .success(function (data1) {
                                            $rootScope.Output = true;
                                            $rootScope.serverTrail = data1;
                                            body.removeClass("overflowHidden");
                                            $rootScope.modal_class = "";
                                            if (data.success == 1) {
                                                $rootScope.scriptOutput = data.response;
                                                if (script_id == "0") {
                                                    $rootScope.responseCommand = data.response;
                                                } else {
                                                    $rootScope.response = data.response;
                                                }
                                            } else if (data.success == 0) {
                                                $rootScope.scriptOutput = data.err_desc;
                                                if (script_id == "0") {
                                                    $rootScope.responseCommand = data.err_desc;
                                                } else {
                                                    $rootScope.response = data.err_desc;
                                                }
                                            }
                                        });
                            });
                        }else if(value == "delete_script_cancel"){
                                $rootScope.delete_script = $rootScope.delete_script ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                        }else if(value == "delete_script_ok"){
                                var scriptId = "";
                                $rootScope.delete_script_err_msg = "";
                                scriptId = $rootScope.scriptId;
                                    if (scriptId == undefined) {
                                   $rootScope.delete_script_err_msg = "Internal Error!";
                                   return;
                               } else {
                                   $rootScope.delete_script_err_msg = "";
                                   $http({
                                       method: "POST",
                                       url: "/deleteScript",
                                       data: {scriptId: scriptId},
                                       headers: {"Content-Type": "application/json"}
                                   }).success(function (data) {
                                       if (data.success == 1) {
                                           $rootScope.delete_script = $rootScope.delete_script ? false : true;
                                           $rootScope.serverTop10Script.splice($rootScope.scriptIndex, 1);
                                           body.removeClass("overflowHidden");
                                           $rootScope.modal_class = "";
                                       } else if (data.success == 0) {
                                           $rootScope.delete_script_err_msg = "Internal Error!";
                                       } else if (data.success == 2) {
                                           $rootScope.delete_script_err_msg = data.err_desc;
                                       }
                                   });
                               }
                        }else if(value == "kill_process_ok"){
                               var ePID = $rootScope.Epid;
                               if(ePID == undefined || ePID==""){
                                  $rootScope.notMatch =false; 
                                  $rootScope.errName =true; 
                                  return;
                               }else if(ePID !=$rootScope.pid){
                                  $rootScope.Epid ='';
                                  $rootScope.errName =false; 
                                  $rootScope.notMatch =true; 
                                  return;
                               }else{
                                   $rootScope.kill_process = $rootScope.kill_process ? false : true;
                                   body.removeClass("overflowHidden");
                                   $rootScope.modal_class = "";
                                   $rootScope.notMatch =false;
                                   $rootScope.errName =false;
                                   $rootScope.modal_class = "modal-backdrop fade in loader";
                                            $http({
                                             method: "post",
                                             url: "/serverDetails",
                                             data:{'server_id':id,'pid':$rootScope.pid,'pname':$rootScope.pname},
                                             headers: {"Content-Type": "application/json"}
                                            })
                                         .success(function (data) {
                                              $rootScope.topMemory =[];
                                              $rootScope.topCPU =[];
                                              $rootScope.modal_class="";
                                              var array1 = data.response.split("\n");
                                              var array = array1.slice(0,4);
                                              array.push(array1.slice(4).join("\n"));
                                              $rootScope.homeDir = array[0];
                                              $rootScope.diskSpace = array[1];
                                              var disk = array[1].split(/(\s+)/);
                                              $rootScope.diskSpace = disk[4]+"/"+disk[2]+" ("+disk[8]+")";
                                              $rootScope.CPU = array[2];
                                              var memory = array[3].split(/(\s+)/);
                                              $rootScope.memorySpace = (memory[4]/1024).toFixed(2)+"GB/"+(memory[2]/1024).toFixed(2)+"GB"+" ("+((memory[4]/memory[2]*100).toFixed(2))+"%)";
                                              //$rootScope.topMemoryProcess = array[4];
                                              $rootScope.topMemoryProcess = array[4].split("\n");
                                              var j=0;
                                              var PID ="true";
                                              for(var i=0;i<$rootScope.topMemoryProcess.length-1;i++){
                                                  var checkPID = cleanArray($rootScope.topMemoryProcess[i].split(" "));
                                                   if(checkPID[1]==$rootScope.pid){
                                                      PID ="false";
                                                  }
                                                  if(i<20){
                                                      $rootScope.topMemory[i] = cleanArray($rootScope.topMemoryProcess[i].split(" "));
                                                  }else{
                                                      $rootScope.topCPU[j] = cleanArray($rootScope.topMemoryProcess[i].split(" "));
                                                      j++;
                                                  }
                                              }
                                              if(PID=="true"){
                                                 alert("Process killed successfully.");
                                              }else{
                                                 alert("There is some problem to kill process.");
                                              }

                                  });
                               }
                        }else if (value == "create_script_cancel") {
                            $rootScope.create_script = $rootScope.create_script ? false : true;
                            body.removeClass("overflowHidden");
                            $rootScope.modal_class = "";
                        }else if (value == "create_script_ok") {
                            var script_name = $rootScope.scriptName;
                            var script_desc = $rootScope.scriptDesc;
                            var script = $rootScope.script;
                            $rootScope.errName = false;
                            $rootScope.errDesc = false;
                            $rootScope.errScript = false;
                            var count = 0;
                            var parameter = [];
                            var scr = script;
                            var regex = /[!@#$%^&*(),.?":{}|<> ]/;
                            for (var i = 0; script.length > i; i++) {
                                if (script.charAt(i) == '$') {
                                    ++count;
                                }
                            }
                            for (var i = 0; i < count; i++) {
                                scr = scr.substring(scr.indexOf("$") + 1);
                                if (scr.match(regex)) {
                                    parameter[i] = scr.substring(0, scr.indexOf(scr.match(regex)));
                                } else if (scr != "") {
                                    parameter[i] = scr;
                                }
                            }
                            /*var text = $('#textArea').val();
                            var lines = text.split(/\r|\r\n|\n/);
                            var countScriptLine = lines.length;*/
                            if (script_name == "" || script_name == undefined) {
                                $rootScope.errName = true;
                                return false;
                            } else if (script_desc == "" || script_desc == undefined) {
                                $rootScope.errDesc = true;
                                return false;
                            } else if (script == "" || script == undefined) {
                                $rootScope.errScript = true;
                                return false;
                            } else {
                                $rootScope.errName = false;
                                $rootScope.errDesc = false;
                                $rootScope.errScript = false;
                                $http({
                                    method: "POST",
                                    url: "/createScript",
                                    data: {script_name: script_name, script_desc: script_desc, script: script,project_id:$rootScope.projectId,serverIds:$rootScope.serverArray, parameter:parameter},
                                    headers: {"Content-Type": "application/json"}
                                }).success(function (data) {
                                    if (data.success == 1) {
                                        var result_data = {script_name: script_name, script_desc: script_desc.trim(), id: data.row_id, script: script};
                                        $rootScope.serverTop10Script.unshift(result_data);
                                        $rootScope.create_script = $rootScope.create_script ? false : true;
                                        body.removeClass("overflowHidden");
                                        $rootScope.modal_class = "";
                                    } else if (data.success == 0) {
                                        $rootScope.create_script_err_msg = "Internal Error!";
                                    } else if (data.success == 2) {
                                        $rootScope.create_script_err_msg = data.err_desc;
                                    }
                                });
                            }
                }else if(value == "trail_output_ok"){
			$rootScope.trail_output = $rootScope.trail_output ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}else if(value == "instance_cancel"){
                        if($rootScope.url=="startInstances"){
                           $('.instance').prop('checked', false);
                        }else{
                           $('.instance').prop('checked', true);
                        }
			$rootScope.start_stop_instance = $rootScope.start_stop_instance ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}else if(value=="instance_ok"){
                        $rootScope.captchError = false;
                        var string1 = removeSpaces(document.getElementById('mainCaptcha').value);
                        var string2 = removeSpaces(document.getElementById('CaptchaInput').value);
                        if(string1 != string2){
                           $rootScope.captchError =true;
                            return false; 
                        }else{
                                $rootScope.start_stop_instance = $rootScope.start_stop_instance ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                                $rootScope.modal_class = "modal-backdrop fade in loader";
                                $http({
                                 method: "post",
                                 url: "/"+$rootScope.url,
                                 data: {serverId:$rootScope.serverId},
                                 headers: {"Content-Type": "application/json"}
                              })
                                .success(function (data){
                                    body.removeClass("overflowHidden");
                                    $rootScope.modal_class = "";
                                    if(data.flag==0){
                                        $('.instance').prop('checked', true);
                                    }else{
                                        $('.instance').prop('checked', false);
                                    }
                                    if(data.success==1){
                                        alert($rootScope.success_msg);
                                    }else if (data.success==0){
                                        alert($rootScope.error_msg);
                                    }
                              });
                          }
                }else if(value=="rotate_key_cancel"){
                        $rootScope.server_rotate_key = $rootScope.server_rotate_key ? false : true;
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
                }else if(value=="rotate_key_ok"){
						
						var sendEmailStatus = $('#sendKey').prop('checked');
                        var Email  = $rootScope.Email;
						
						if(Email == "" || emailPattern.test(Email) == false){
										
							$rootScope.emailError = true;
							return false;
						}else if(sendEmailStatus == false){
							
							alert("Do you want to send keys to the user ? If yes, please tick the checbox");
							return false;
							
						}else{
							
							$rootScope.modal_class = "";
							$rootScope.server_rotate_key = $rootScope.server_rotate_key ? false : true;
							body.removeClass("overflowHidden");
							$rootScope.modal_class = "modal-backdrop fade in loader";
							$http({
								 method: "post",
								 url: "/serverKeyRotate",
								 data: {serverId:$rootScope.serverId,serveruserId:$rootScope.serverUserId,uname:$rootScope.uname,uemail:Email, sendEmailStatus:sendEmailStatus },
								 headers: {"Content-Type": "application/json"}
							  })
							   .success(function (data){
									$rootScope.modal_class = "";
									if(data.success==1){
										alert("key has been rotated successfully.");
									}else if (data.success==0){
										alert("There is some error to rotate key.Please try again.");
								}
						  });
							
							
						}
					
                        /*
                        if (emailPattern.test(Email) == false && $('#sendKey').prop('checked') == true){
                            $rootScope.emailError = true;
                            return;
                        }*/
                        
                }else if(value == "close_cloudTrail_Details"){
                                $rootScope.show_cloudTrail_Details = $rootScope.show_cloudTrail_Details ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                }else if(value == "patch_window_cancel"){
                                $rootScope.patch_window = $rootScope.patch_window ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                }else if(value=="patch_window_ok"){
                    
                    var patchName       = $rootScope.patchName;
                    var minute          = $rootScope.minute;
                    var hour            = $rootScope.hour;
                    var day_of_month    = $rootScope.day_of_month;
                    var month           = $rootScope.month;
                    //var day_of_week     = $rootScope.day_of_week;
                    var day_of_week     = "?";
                    var year            = "*";
                    var duration        = $rootScope.duration;
                    var cutOff          = $rootScope.cutOff;
                    var operationType   = $rootScope.operationType;
                    var cron            = "cron(" + minute + " " + hour + " " + day_of_month + " " + month + " " + day_of_week + " " + year+ ")";
					var cronvalue       = "cron(" + $rootScope.cronvalue+" *)";
		    	
                    if(patchName=="" || patchName==null){
                        $rootScope.errName =true;
                        return false;
                    }else if(/\s/.test(patchName)){
                       $rootScope.errSpace =true;
                       return false;
                    }else if(patchName.length < 3 || patchName.length >20){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =true;
                        return false;
                    }else if(cron=="" || cron==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =true;
                        return false;
                    }else if(duration=="" || duration==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =true;
                        return false;
                    }else if(cutOff=="" || cutOff==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =true;
                        return false;
                    }else if(cutOff >= duration){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =false;
                        $rootScope.errCut =true;
                        return false;
                    }else if(operationType=="" || operationType==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =false;
                        $rootScope.errCut =false;
                        $rootScope.erroptype =true;
                        return false;
                    }else{

                        $rootScope.errName =false;
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =false;
                        $rootScope.errCut =false;
                        $rootScope.erroptype =false;
                        $rootScope.modal_class = "";
                        $rootScope.patch_window = $rootScope.patch_window ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in loader";

                        /*
                        $timeout( function(){
                            alert("After 5 seconds");
                        }, 5000 );
                        */
                        
                        $http({
                            method: "post",
                            url: "/createPatchMW",
                            data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType,patchScript:0},
                            headers: {"Content-Type": "application/json"}
                       })
                       .success(function (data){
                          
                          if(data.success==1){
                                
					if( data.platform != 'Linux' ){
					
						$rootScope.modal_class = "";

						$http({
							method: "post",
							url: "/patchList",
							data: {serverId: $rootScope.serverId},
							headers: {"Content-Type": "application/json"}
						})
						.success(function (data) {
							$rootScope.patchList = data;
							alert("Patch MW has been created successfully.");
						});
					}else{
				
					var dataResponse = JSON.parse(data.response);
                                var WindowId    = dataResponse['WindowId'];
                                $http({
                                    method: "post",
                                    url: "/createPatchMW",
                                    data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType,patchScript:1,WindowId:WindowId},
                                    headers: {"Content-Type": "application/json"}
                                })
                                .success(function (data){

                                    if(data.success==1){

                                        var dataResponse = JSON.parse(data.response);
                                        var WindowTargetId    = dataResponse['WindowTargetId'];
                                        $http({
                                            method: "post",
                                            url: "/createPatchMW",
                                            data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType,patchScript:2,WindowId:WindowId,WindowTargetId:WindowTargetId},
                                            headers: {"Content-Type": "application/json"}
                                        })
                                        .success(function (data){
        
                                            if(data.success==1){
                                                
                                                $rootScope.modal_class = "";

                                                $http({
                                                    method: "post",
                                                    url: "/patchList",
                                                    data: {serverId: $rootScope.serverId},
                                                    headers: {"Content-Type": "application/json"}
                                                })
                                                .success(function (data) {
                                                    $rootScope.patchList = data;
                                                    alert("Patch MW has been created successfully.");
                                                });
                                                
                                            }
                                         });
                                    }
                                 });
				}
				
                                

                                
                          }else if (data.success==0){
                                alert("There is some error to add patch MW.Please try again.");
                          }
                        });
                    }
                    
                }else if(value=="patch_window_ok_notworking"){
                    var patchName = $rootScope.patchName;
                    var minute = $rootScope.minute;
                    var hour = $rootScope.hour;
                    var day_of_month = $rootScope.day_of_month;
                    var month = $rootScope.month;
                    var day_of_week = $rootScope.day_of_week;
                    var duration = $rootScope.duration;
                    var cutOff = $rootScope.cutOff;
                    var operationType = $rootScope.operationType;
                    var cron = "cron(" + minute + " " + hour + " " + day_of_month + " " + month + " " + day_of_week + ")";
                   /* var testMinute = /(\*|[0-5]?[0-9]|\*\/[0-9]|[0-5]\,[0-5]?[0-9]|[0-5]?[0-9]\,[0-5]?[0-9]|[0-5]\-[0-5]?[0-9]|[0-5]?[0-9]\-[0-5]?[0-9]+)\s/;
                    var testHour = /(\*|1?[0-9]|2[0-3]|\*\/[0-9]|1?[0-9]\,1?[0-9]|1?[0-9]\,2[0-3]|2[0-3]\,2[0-3]|1?[0-9]\-1?[0-9]|1?[0-9]\-2[0-3]|2[0-3]\-2[0-3]+)\s/;
                    var testDayOfMonth = /(\*|\?|L|LW|[1-2]?[0-9]W|3[0-1]W|[1-2]?[0-9]|3[0-1]|\*\/[0-9]|[0-9]\,[1-2]?[0-9]|[0-9]\,3[0-1]|[1-2][0-9]\,[1-2][0-9]|[1-2][0-9]\,3[0-1]|3[0]\,3[1]|[0-9]\-[1-2]?[0-9]|[0-9]\-3[0-1]|[1-2][0-9]\-[1-2][0-9]|[1-2][0-9]\-3[0-1]|3[0]\-3[1]+)\s/;
                    var testMonth = /(\*|[0-9]|1[0-2]|\*\/[0-9]|[0-9]\,[0-9]?|[0-9]\,1[0-2]|1[0-2]\,1[0-2]|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)?(,(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(,)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)|)\s/;
                    var testDayOfWeek = /(\*\/[0-9]+|\*|\?|[0-6]#[0-5]|L|LW|[0-6]L|[0-6]|[0-6]\,[0-6]?|[0-6]\-[0-6]?|([0-6]\-[0-6])?,([0-6]\-[0-6])|([0-6])(,)?[0-6]\-[0-6]?|MON|TUE|WED|THU|FRI|SAT|SUN|(MON|TUE|WED|THU|FRI|SAT|SUN)(-)(MON|TUE|WED|THU|FRI|SAT|SUN)?,(MON|TUE|WED|THU|FRI|SAT|SUN)(-)(MON|TUE|WED|THU|FRI|SAT|SUN)|(MON|TUE|WED|THU|FRI|SAT|SUN)(-)(MON|TUE|WED|THU|FRI|SAT|SUN)?,(MON|TUE|WED|THU|FRI|SAT|SUN)|(MON|TUE|WED|THU|FRI|SAT|SUN)(,)?(MON|TUE|WED|THU|FRI|SAT|SUN)(-)(MON|TUE|WED|THU|FRI|SAT|SUN)|(MON|TUE|WED|THU|FRI|SAT|SUN)(-)(MON|TUE|WED|THU|FRI|SAT|SUN)|(MON|TUE|WED|THU|FRI|SAT|SUN)(,)(MON|TUE|WED|THU|FRI|SAT|SUN))\s/; */
                    if(patchName=="" || patchName==null){
                        $rootScope.errName =true;
                        return false;
                    }else if(/\s/.test(patchName)){
                       $rootScope.errSpace =true;
                       return false;
                    }else if(patchName.length < 3 || patchName.length >20){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =true;
                        return false;
                    }else if(cron=="" || cron==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =true;
                        return false;
                    }else if(duration=="" || duration==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =true;
                        return false;
                    }else if(cutOff=="" || cutOff==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =true;
                        return false;
                    }else if(cutOff >= duration){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =false;
                        $rootScope.errCut =true;
                        return false;
                    }else if(operationType=="" || operationType==null){
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =false;
                        $rootScope.errCut =false;
                        $rootScope.erroptype =true;
                        return false;
                    }else{
                        $rootScope.errName =false;
                        $rootScope.errSpace =false;
                        $rootScope.errLetter =false;
                        $rootScope.errCron =false;
                        $rootScope.errDuration =false;
                        $rootScope.errCutoff =false;
                        $rootScope.errCut =false;
                        $rootScope.erroptype =false;
                        $rootScope.modal_class = "";
                        $rootScope.patch_window = $rootScope.patch_window ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in loader";
                        $http({
                             method: "post",
                             url: "/createPatchMW_NotWorking",
                             data: {serverId:$rootScope.serverId,patchName:patchName,cron:cron,duration:duration,cutOff:cutOff,operationType:operationType },
                                     headers: {"Content-Type": "application/json"}
                        })
                        .success(function (data){
                           $rootScope.modal_class = "";
                           if(data.success==1){
                               $http({
                                    method: "post",
                                    url: "/patchList",
                                    data: {serverId: $rootScope.serverId},
                                    headers: {"Content-Type": "application/json"}
                                })
                                        .success(function (data) {
                                            $rootScope.patchList = data;
                                            alert("Patch MW has been created successfully.");
                                });
                           }else if (data.success==0){
                              alert("There is some error to add patch MW.Please try again.");
                           }
                         });
                    }
                }else if(value == "delete_patch_cancel"){
                        $rootScope.delete_patch = $rootScope.delete_patch ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                }else if(value=="delete_patch_ok"){
                    $rootScope.modal_class = "";
                    $rootScope.delete_patch = $rootScope.delete_patch ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in loader";
                    $http({
                     method: "post",
                     url: "/deletePatchMW",
                     data: {serverId:$rootScope.serverId,windowId:$rootScope.windowId,patchId:$rootScope.patchId},
                     headers: {"Content-Type": "application/json"}
                  })
                    .success(function (data) {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                        if(data.success==1){
                            $rootScope.patchList.splice($rootScope.deleteIndex , 1);
                        }else if (data.success==0){
                            alert("There is some problem to delete this patch. Please try again.");
                        }
                    });
                }else if(value == "execution_cancel"){
                        $rootScope.patchExecutionDetails = $rootScope.patchExecutionDetails ? false : true;
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                }
	};


	$scope.showCommandModal = function() {
			$rootScope.visible_command = $rootScope.visible_command ? false : true;
			if ($rootScope.visible_command) {
				$rootScope.commandText = "bash <(wget -qO- https://raw.githubusercontent.com/agentinfraguard/agent/master/scripts/agentInstaller.sh --no-check-certificate) '"+serverName+"' "+ $scope.project.id+" "+"LicenseKey";
				body.addClass("overflowHidden");
				$rootScope.modal_class = "modal-backdrop fade in";
			} else {
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
	};

	$scope.showServerModal = function() {
			$rootScope.visible_server = $rootScope.visible_server ? false : true;
			$rootScope.errName = false;
			$rootScope.serverName = "";
			$rootScope.server_err_msg = "";
			if ($rootScope.visible_server) {
				body.addClass("overflowHidden");
				$rootScope.modal_class = "modal-backdrop fade in";
			} else {
				body.removeClass("overflowHidden");
				$rootScope.modal_class = "";
			}
		};
		
	$scope.showUserModal = function(mode, ip,user_index) {
		ip_addr = ip;
		if (mode == "adduser") {
			$rootScope.visible_add_user = $rootScope.visible_add_user ? false : true;
		} else if(mode == "deleteuser"){
			$rootScope.visible_delete_user = $rootScope.visible_delete_user ? false : true;
                        $rootScope.userIndex = user_index;
		} else if(mode == "changeprivilege"){
			$rootScope.visible_privilege = $rootScope.visible_privilege ? false : true;
		} else if(mode == "serverLockdown"){
			$rootScope.visibleLockdown = $rootScope.visibleLockdown ? false : true;
		}else if(mode == "serverUnlock"){
			$rootScope.visibleUnlock = $rootScope.visibleUnlock ? false : true;
		}else if(mode == "processList"){
			$rootScope.visibleProcessList = $rootScope.visibleProcessList ? false : true;
		}else if(mode == "getAccessKey"){
			$rootScope.visibleGetAccessKey = $rootScope.visibleGetAccessKey ? false : true;
		}
		
		$rootScope.errName = false;
		$rootScope.listStatus = false;
                $rootScope.users = [];
		$rootScope.userEmail = "";
		$rootScope.user_err_msg = "";
		$rootScope.userName = "";
		$rootScope.emailValid = false;
                $rootScope.emailError = false;
		$rootScope.userExist = true;
		if ($rootScope.visible_add_user || $rootScope.visible_delete_user || 
			$rootScope.visible_privilege || $rootScope.visibleLockdown || $rootScope.visibleUnlock) {
			body.addClass("overflowHidden");
			$rootScope.modal_class = "modal-backdrop fade in";
		}
		else {
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
	};

	$rootScope.showUsers = function(){
                $rootScope.emailError = false;
		var userEmail = "%" + $rootScope.userEmail + "%";
		var data = {email: userEmail};
		user_obj = {};
		user_obj.user = {};
		$http({
			url: "/showUsers",
			method: "POST",
			data: data,
			headers: {"Content-Type": "application/json"}
		})
		.success(function(data){
			if(data.length > 0){
                                $rootScope.emailValid = false;
				$rootScope.users = data;
				$rootScope.listStatus = true;
                                user_obj.search = 2;
				user_obj.serverId = ip_addr;
				user_obj.user.uname = $rootScope.userEmail;
				user_obj.user.linuxName = $rootScope.userEmail;
				if($rootScope.userEmail != undefined && $rootScope.userEmail.indexOf("@") > -1){
                                    user_obj.user.uname = $rootScope.userEmail.split("@")[0];
                                    user_obj.user.linuxName = $rootScope.userEmail.split("@")[0];
				}
				user_obj.user.email = $rootScope.userEmail;
				user_obj.user.passw = generatePassw(8, "#aA!");
				user_obj.user.shell = "/bin/bash";
				user_obj.user.userRegistration = "InfraGuard";
			}
			else {
				$rootScope.users = [];
				$rootScope.listStatus = false;
                                if ($rootScope.userEmail == undefined) {
                                    $rootScope.emailValid = false;
                                } else if(emailPattern.test($rootScope.userEmail) == false) {
                                    $rootScope.emailValid = true;
                                }
                        }
                        if (emailPattern.test($rootScope.userEmail)){
                            $rootScope.emailValid = false;
                        }
		});
	};

	$rootScope.showDeleteUsers = function(){
		var data = {serverId: ip_addr};
		user_obj = {};
		$rootScope.userExist = true;
		$http({
			url: "/showUsersOnServer",
			method: "POST",
			data: data,
			headers: {"Content-Type": "application/json"}
			
		})
		.success(function(data){
			if(data.length > 0){
				$rootScope.users = data;
				$rootScope.listStatus = true;
				user_obj.search = 2;
				user_obj.serverId = ip_addr;
				user_obj.uname = $rootScope.userName;
			}
			else{
				user_obj.search = 0;
				user_obj.serverId = ip_addr;
				user_obj.uname = $rootScope.userName;
			}
			
		});
		
	};

	$rootScope.showPrivilegeUsers = function(){
		var data = {serverIp: ip_addr};
		user_obj = {};
		$http({
			url: "/showPrivilegeUsers",
			method: "POST",
			data: data,
			headers: {"Content-Type": "application/json"}
			
		})
		.success(function(data){
			if(data.length > 0){
				$rootScope.users = data[0].userList.split(",");
				$rootScope.listStatus = true;
				user_obj.search = 2;
				user_obj.serverIp = ip_addr;
				user_obj.uname = $rootScope.userName;
				user_obj.userRole = $rootScope.privilege;
			}
			else{
				user_obj.search = 0;
				user_obj.serverIp = ip_addr;
				user_obj.uname = $rootScope.userName;
				user_obj.userRole = $rootScope.privilege;
			}
			
		});
		
	};
        $rootScope.setUser = function(user){
		$rootScope.listStatus = false;
		$rootScope.users = [];
		user_obj.user = user;
		user_obj.serverId = ip_addr;
		user_obj.search = 1;
		$rootScope.userEmail = user.email;
		if(emailPattern.test($rootScope.userEmail)){
			$rootScope.emailValid = false;
                        $rootScope.emailError = false;
		}
		else{
			$rootScope.emailValid = true;	
		}

	};

	$rootScope.setDeleteUser = function(user,serveruserId){
		$rootScope.listStatus = false;
		$rootScope.users = [];
		$rootScope.userName = user;
		user_obj = {};
		user_obj.uname = user;
		user_obj.serverId = ip_addr;
		user_obj.search = 1;
                user_obj.serveruserId = serveruserId;

	};

	$rootScope.setPrivilegeUser = function(user){
		$rootScope.listStatus = false;
		$rootScope.users = [];
		$rootScope.userName = user;
		user_obj = {};
		user_obj.uname = user;
		user_obj.serverIp = ip_addr;
		var data = {uname: $rootScope.userName};
		$http({
			method: "POST",
			url: "/getUserEmail",
			data: data,
			headers: {"Content-Type":"application/json"}
		})
		.success(function(data){
			if(data != null){
			user_obj.userEmail = data;
			}else{
				user_obj.userEmail = "";
			}
		});

	};
        $rootScope.showjobModal = function () {
                $rootScope.visible_cronjob = $rootScope.visible_cronjob ? false : true;
                $rootScope.jobName = "";
                $rootScope.jobCommand = "";
                $rootScope.minute = "*";
                $rootScope.hour = "*";
                $rootScope.day_of_month = "*";
                $rootScope.month = "*";
                $rootScope.day_of_week = "*";
                $rootScope.errName = false;
                $rootScope.errCommand = false;
                $rootScope.cron_job_err_msg = "";
                if ($rootScope.visible_cronjob) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
        $rootScope.editjobModal = function (name, command, minute, hour, day_of_month, month, day_of_week, index) {
                $rootScope.edit_cronjob = $rootScope.edit_cronjob ? false : true;
                $rootScope.jobName = name;
                $rootScope.jobCommand = command;
                $rootScope.minute = minute;
                $rootScope.hour = hour;
                $rootScope.day_of_month = day_of_month;
                $rootScope.month = month;
                $rootScope.day_of_week = day_of_week;
                $rootScope.jobIndex = index;
                $rootScope.oldCronDetails = minute+" "+hour+" "+day_of_month+" "+month+" "+day_of_week+" "+command;
                $rootScope.errName = false;
                $rootScope.errCommand = false;
                $rootScope.cron_job_err_msg = "";
                if ($rootScope.edit_cronjob) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
        $rootScope.deleteCronFromServerModel = function(cron_id,server_job_name,server_id,server_ip,cron_details,index){
		$rootScope.delete_cron_from_server = $rootScope.delete_cron_from_server ? false : true;
                $rootScope.cronId=cron_id;
                $rootScope.serverId=server_id;
                $rootScope.cronDetails=cron_details;
                $rootScope.serverIp = server_ip;
                $rootScope.server_job_name = server_job_name;
                $rootScope.index =index;
                if ($rootScope.delete_cron_from_server) {
			body.addClass("overflowHidden");
			$rootScope.modal_class = "modal-backdrop fade in";
		}else {
			body.removeClass("overflowHidden");
			$rootScope.modal_class = "";
		}
	};
        $rootScope.refreshCronJobs = function(server_id){
            $('.refresh_jobs').attr("src","../images/refresh.gif");
            $http({
                method: "post",
                url: "/getRunningCronJobs",
                data: {server_id: server_id},
                headers: {"Content-Type": "application/json"}
            })
            .success(function (data) {
                $timeout(function() { 
                   $('.refresh_jobs').attr("src","../images/refresh_icon.png");
                }, 1000);
                $rootScope.CronJobs = data;
             });
	};
        $rootScope.refreshPage = function(server_id){
           location.reload();
	};
        
        $rootScope.checkServerStatus = function(server_id,server_ip){
            $('.checkServerStatus').attr("src","../images/refresh.gif");
            
            $http({
                method: "post",
                url: "/checkServerStatus",
                data: {server_id: server_id,server_ip:server_ip},
                headers: {"Content-Type": "application/json"}
            })
            .success(function (data) {
                if(data.success==1){
                    $('.checkServerStatus').attr("src","../images/refresh_icon.png");
                    $('.status').text(data.response);
                    $rootScope.lastRun = "Last run time : "+ new Date(data.time);
                }
             });
	};
        
        $rootScope.checkSSMAgentStatus = function(server_id,server_ip,customer_id){
            $('.checkSSMStatus').attr("src","../images/refresh.gif");
            
            $http({
                method: "post",
                url: "/checkSSMStatus",
                data: {server_id: server_id,server_ip:server_ip,customer_id:customer_id},
                headers: {"Content-Type": "application/json"}
            })
            .success(function (data) {
                if(data.success==1){
                    $('.checkSSMStatus').attr("src","../images/refresh_icon.png");
                    $('.ssm_status').text(data.response);
                    $rootScope.lastRunTime = "Last run time : "+ new Date(data.time);
                }
             });
	};
        $rootScope.viewScript = function (script, scriptName){
                $rootScope.script = script;
                $rootScope.scriptName = scriptName;
                $rootScope.view_script = $rootScope.view_script ? false : true;
                if ($rootScope.view_script){
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
        };
        $rootScope.deleteScript = function(script_id, script_name, script_index){
            $rootScope.scriptId = script_id;
            $rootScope.scriptName = script_name;
            $rootScope.scriptIndex = script_index;
            $rootScope.delete_script = $rootScope.delete_script ? false : true;
                if ($rootScope.delete_script){
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
        };
        $rootScope.updateHomeDir = function (server_id){
                $('.homeDir').attr("src","../images/refresh.gif");
                 $http({
                    method: "post",
                    url: "/updateHomeDirectory",
                    data: {server_id:server_id},
                    headers: {"Content-Type": "application/json"}
                 })
                    .success(function (data){
                        $('.homeDir').attr("src","../images/refresh_icon.png");
                        location.reload();
                    });
        };
        $rootScope.runScript = function (script_id,script_name,script,script_desc,serverId,serverIp){
                $rootScope.scriptId = script_id;
                $rootScope.scriptName = script_name;
                $rootScope.script = script;
                $rootScope.scriptDesc = script_desc;
                $rootScope.serverId = serverId;
                $rootScope.serverIp = serverIp;  
                $rootScope.runCommand=0;
                if(script_id=="0"){
                    $rootScope.runCommand=1;
                    script = $('.scriptToRun').val();
                    if(script==""){
                        alert("Please enter script to run.");
                        return false;
                    }
                }
                var lines = script.split(/\r|\r\n|\n/);
                var countScriptLine = lines.length;
                var run=[];
                for (var i = 0; i < $rootScope.runCommandName.length; i++) {
                  run = $rootScope.runCommandName[i];
                  if(new RegExp('\\b' + run + '\\b').test(script)){
                     alert( run+" command is not allowed to run.");
                     return false;
                  }
                }
                $rootScope.commands = [];
                $rootScope.parameters = [];
                $http({
                    method: "POST",
                    url: "/getParameter",
                    data: {scriptId: script_id},
                    headers: {"Content-Type": "application/json"}
                }).success(function (data) {
                    $rootScope.parameterId = [];
                    $rootScope.parameterName = [];
                    for (var i = 0; i < data.length; i++) {
                        $rootScope.parameters.push({});
                        $rootScope.parameters[i].parameterName = data[i].name;
                        $rootScope.parameterId[i] = data[i].id;
                        $rootScope.parameterName[i] = data[i].name;
                    }
                    if (data.length > 0 && countScriptLine == 1) {
                        $rootScope.assign_parameter = $rootScope.assign_parameter ? false : true;
                        $rootScope.singleScript = script;
                        if ($rootScope.assign_parameter) {
                            body.addClass("overflowHidden");
                            $rootScope.modal_class = "modal-backdrop fade in";
                        } else {
                            body.removeClass("overflowHidden");
                            $rootScope.modal_class = "";
                        }
                    } else {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in loader";
               
                 $http({
                    method: "post",
                    url: "/runScript",
                    data: {script_id:script_id,script_name: script_name,script:script,serverIp:serverIp,serverId:serverId,script_desc:script_desc,runCommand:$rootScope.runCommand},
                    headers: {"Content-Type": "application/json"}
                 })
                    .success(function (data) {
                        $http({
                            method: "post",
                            url: "/getServerTrail",
                            data: {server_id: serverId},
                            headers: {"Content-Type": "application/json"}
                        })
                        .success(function (data1) {
                            $rootScope.serverTrail = data1;
                            $rootScope.Output = true;
                            body.removeClass("overflowHidden");
                            $rootScope.modal_class = "";
                            if(data.success==1){
                                $rootScope.scriptOutput = data.response;
                                if(script_id=="0"){
                                    $rootScope.responseCommand =data.response;
                                }else{
                                    $rootScope.response =data.response;
                                }
                            }else if (data.success==0){
                                $rootScope.scriptOutput = data.err_desc;
                                if(script_id=="0"){
                                    $rootScope.responseCommand =data.err_desc;
                                }else{
                                    $rootScope.response =data.err_desc;
                                }
                            }
                        });
                    });
                }
            });
            };
            $rootScope.display_more_processes = function (type,platform,serverId,serverIp){
                $rootScope.modal_class = "modal-backdrop fade in loader";
                $rootScope.type=type;
                var script = "";
                $rootScope.header = "";
                if(type=="memory" && platform=="L"){
                    script = "ps aux | sort -nrk 4 | head -30";
                    $rootScope.header = "ML";
                }else if(type=="CPU" && platform=="L"){
                   script = "ps aux | sort -nrk 3 | head -30"; 
                   $rootScope.header = "CL";
                }else if(type=="memory" && platform=="W"){
                    script = "Get-Process | Sort-Object -Descending -Property CPU | Select-Object -First 30";
                    $rootScope.header = "MW";
                }else if(type=="CPU" && platform=="W"){
                   script = "Get-Process | Sort-Object -Descending -Property VM | Select-Object -First 30";
                   $rootScope.header = "CW";
                }
                $http({
                    method: "post",
                    url: "/runScript",
                    data: {script_id:"-11",script_name: "",script:script,serverIp:serverIp,serverId:serverId,script_desc:""},
                    headers: {"Content-Type": "application/json"}
                 })
                 .success(function (data) {
                       if(data.success==1){
                           $rootScope.responseProcesses =data.response.split("\n");  
                           for(var i=0;i<$rootScope.responseProcesses.length-1;i++){
                              $rootScope.responseProcesses[i] = cleanArray($rootScope.responseProcesses[i].split(" "));
                           }
                           $rootScope.modal_class = "";
                           window.location = "/#processes";
                       }else if (data.success==0){
                          alert("there is some error to fetch processes.");
                          $rootScope.responseProcesses =data.err_desc;
                       } 
                 });
                 
            };
        
        $rootScope.setServerId = function(id) {
			companyService.setId(id);
		};
        $rootScope.setCompanyId = function(id) {
			companyService.setId(id);
		};
        $rootScope.setProjectId = function(id) {
			companyService.setId(id);
		};
        $rootScope.killProcess = function(pid,pname){
            $rootScope.notMatch =false;
            $rootScope.errName =false;
            $rootScope.pid = pid;
            $rootScope.pname = pname;
            $rootScope.Epid = '';
            $rootScope.kill_process = $rootScope.kill_process ? false : true;
            if ($rootScope.kill_process){
                body.addClass("overflowHidden");
                $rootScope.modal_class = "modal-backdrop fade in";
            } else {
                body.removeClass("overflowHidden");
                $rootScope.modal_class = "";
            }
        };
        $rootScope.showCloudTrailDetails = function(data){
            $rootScope.cloudTrailDetails = data;
            $rootScope.show_cloudTrail_Details = $rootScope.show_cloudTrail_Details ? false : true;
                if ($rootScope.show_cloudTrail_Details){
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
        };
        $rootScope.downloadOutput = function (){
                var blob = new Blob([$rootScope.scriptOutput], {type: 'text/plain'}),
                url = $window.URL || $window.webkitURL;
                $rootScope.fileUrl = url.createObjectURL(blob);  
            };
	function generatePassw(size, mode) {
            var mask = '';
            if (mode.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
            if (mode.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (mode.indexOf('#') > -1) mask += '0123456789';
            if (mode.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
            var result = '';
            for (var i = size; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
            return result;
        }
        function cleanArray(actual) {
            var newArray = new Array();
            for (var i = 0; i < actual.length; i++) {
              if (actual[i]) {
                newArray.push(actual[i]);
              }
            }
            return newArray;
          }
          
          
        function Captcha(){
            var alpha = new Array(0,1,2,3,4,5,6,7,8,9);
            var i;
            for (i = 0; i < 6; i++) {
                var a = alpha[Math.floor(Math.random() * alpha.length)];
                var b = alpha[Math.floor(Math.random() * alpha.length)];
                var c = alpha[Math.floor(Math.random() * alpha.length)];
                var d = alpha[Math.floor(Math.random() * alpha.length)];
                var e = alpha[Math.floor(Math.random() * alpha.length)];
                var f = alpha[Math.floor(Math.random() * alpha.length)];
                var g = alpha[Math.floor(Math.random() * alpha.length)];
            }
            var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
            document.getElementById("mainCaptcha").value = code;
        }
        function removeSpaces(string){
            return string.split(' ').join('');
        }
 $http({
                method: "post",
                url: "/getUserAcessElements",
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.userElements = [];
                        for (var i = 0, l = data.length; i < l; i++) {
                            $rootScope.userElements[i.toString()] = data[i].policy_element_id;
                        }
                    });
            $http({
                method: "post",
                url: "/getLoginUserDetails",
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.name = data[0].uname;
                        $rootScope.roleId = data[0].roleId;
                        $rootScope.roleName = data[0].roleName;
                        $rootScope.email = data[0].email;
                        $rootScope.userImage = data[0].userImage;
                    });
                    
           $http({
                method: "post",
                url: "/getRunningCronJobsForServers",
                data: {server_id: id},
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.CronJobs = data;
                    });
//           $http({
//                method: "post",
//                url: "/getServerStatus",
//                data: {server_id: id},
//                headers: {"Content-Type": "application/json"}
//            })
//                    .success(function (data) {
//                        $rootScope.lastRun = "Last run time : "+ new Date(data[0].last_time);
//                        if(data[0].response=="stop"){
//                          $rootScope.serverStatus = "Stop";  
//                        }else{
//                          $rootScope.serverStatus = "Alive";   
//                        }
//                    });
            $http({
                method: "post",
                url: "/getSSMStatus",
                data: {server_id: id},
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.lastRunTime = "Last run time : "+ new Date(data[0].last_time);
                        if(data[0].status=="Stop"){
                          $rootScope.ssmAgentStatus = "Stop";  
                        }else{
                          $rootScope.ssmAgentStatus = "Alive";   
                        }
                    });
                    
           $http({
                method: "post",
                url: "/getServerAutomationScripts",
                data: {server_id: id},
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.serverTop10Script = data;
                    });
                    
            $http({
                method: "post",
                url: "/getServerTrail",
                data: {server_id: id},
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.serverTrail = data;
                    });
           $http({
                method: "post",
                url: "/patchList",
                data: {serverId: id},
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.patchList = data;
            });
           $http({
                method: "post",
                url: "/getEachServerUserList",
                data: {server_id: id},
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.serverUserList = data;
                    });
            $http({
                method: "post",
                url: "/getCommandName",
                headers: {"Content-Type": "application/json"}
            })
           .success(function (data) {
             $rootScope.runCommandName=[];
	     for (var i = 0; i < data.length; i++) {
	       $rootScope.runCommandName.push(data[i].commandName);
	     }
            });
			
		
		/* Automation App Detection */
		
		$rootScope.checkAutoAppsStatus = function() {	
			
			$rootScope.autoScriptOutput = '';
			$rootScope.autoUpdateScript = "Please wait...";
			
				$http({
				method: "post",
				url: "/checkAutoApps",
				data: {serverId: id},
				headers: {"Content-Type": "application/json"}
			})
			.success(function (data) {
				
				if(data.success == 1){	
					
					var runningApps = data.msg.runningapp;
					
					var index = 0;
					var numberOfCalls = (runningApps.length - 1);

					var appScriptCall = function() {					

						if(index > numberOfCalls) {
							getAutoApps();
							$rootScope.autoUpdateScript = "";
							return
						}    

						$http.post('runScript', {script:runningApps[index].Command,serverId:id,runCommand:1}).then(function(response) {
			
							if (response.data.success == 1)
								var appStatus = 'Yes';
							else
								var appStatus = 'No';	
							
							
							$http.post('manageAutoApps', {ID:runningApps[index].ID,appStatus:appStatus,runCommand:1}).then(function() {
								index++;
								appScriptCall()
							})
							
						})
					}
					appScriptCall();			
				
				}
			});
			
			getAutoApps();			
			
		}
		
		
		var getAutoApps = function() {	
		
			$http({
				method: "post",
				url: "/getAutoApps",
				data: {serverId: id},
				headers: {"Content-Type": "application/json"}
			})
			.success(function (data) {
				if (data.success == 1) {
					$rootScope.serverRunningApps = data.msg.runningapp;//console.log($rootScope.serverRunningApps);
					$rootScope.serverAppStatus = data.msg.appstatus;//
				}
				
			});
		}
		getAutoApps()
		
		
		$rootScope.runningAppDetails = function(event)
		{
			var ID = event.target.id;
			$rootScope.autoAppID = ID;
			$rootScope.autoAppStatus = event.target.alt;
			
			$scope.IsVisible = false;
			$scope.IsVisible = $scope.IsVisible ? false : true;
			
			if(event.target.alt == "No")
				$scope.IsAppDisabled = 'all';	
			else
				$scope.IsAppDisabled = '';
			
		};
		
		$rootScope.runAutoStatus = function(event)
		{
			$rootScope.autoScriptOutput = 'Please wait....';
			var script = event.target.id;
			
			  $http({
				 method: "post",
				 url: "/runScript",
				 data: {script:script,serverId:id,runCommand:1},
				 headers: {"Content-Type": "application/json"}
			  })
			.success(function (data) {
				if(data.success == 1){					
					$rootScope.autoScriptOutput = data.response;
				}else{
					$rootScope.autoScriptOutput = 'Request is not completed';
				}
			});
		};
		
		$rootScope.clearAppDetection = function()
		{
			$rootScope.autoScriptOutput = '';
			$scope.IsVisible = false;
		};
		
		
		$rootScope.refreshCronList = function() {	
			
			var numberOfCalls = 0;
			var getConfirmed = confirm('Do you want to refresh the cron list');
			if(getConfirmed){
				
				var scriptName = "crontab -l";
				
				$http.post('runScript', {script:scriptName,serverId:id,runCommand:1}).then(function(response){
					
					if(response.data.success == 1){
						
						var cronData = response.data.response.split('\n');
						cronData = cronData.filter(function(e){return e}); 
						
									
						var index = 0;
						var numberOfCalls = (cronData.length - 1);
					
						var manageRefreshCron = function() {					

							if(index > numberOfCalls) {
								$http.post('getRunningCronJobsForServers', {server_id:id}).then(function(resp){	
									$rootScope.CronJobs = resp.data;
								});
								return
							}    
							
							if(cronData[index] != "" && cronData[index] != undefined && cronData[index] != null){
								
								$http.post('manageRefreshCron', {serverId:id,data:cronData[index],runCommand:1}).then(function(resp) {
									
									if(resp.data.success == 1){
										
										index++;
										manageRefreshCron()									
									}
								})
							}
							
							
						}											
						manageRefreshCron();
						
					}else{
						
						alert('You have no active crons');
						return false;
					}
					
				})
				
			}
			
			
			
		}
		
});

