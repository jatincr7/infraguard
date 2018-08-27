
angular.module("homePageController", []).controller("homePageController",
        function ($scope, $location, $http, $rootScope, $window, companyService, $document, $timeout) {
			var emailPattern = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
			var mailUserCredentialsUrl="";
            $scope.edit = true;
            $scope.uploadSuccess = false;
         
            $scope.keySuccess = false;
            $scope.ssh_err_display = false;
            $scope.ssh_err_msg = "";
            $scope.infoSuccess = false;
            $scope.shell = "/bin/bash";
            $scope.visible = false;
            $rootScope.visible_help = false;
            $rootScope.visible_company = false;
            $rootScope.visible_project = false;
            $rootScope.company_err_msg = "";
            $rootScope.modal_class = "";
            $rootScope.pid = "";
            $rootScope.companyReverse = true;
            $rootScope.projectReverse = true;
            $rootScope.userReverse = true;
            $rootScope.companyProperty = 'id';
            $rootScope.projectProperty = 'id';
            $rootScope.userProperty = 'id';
            if ($location.path() == "/profile") {
                $('.search_value').val('');
            }
            $rootScope.modal_class = "modal-backdrop fade in loader";
            var local_index = -1;
            var body = angular.element($document[0].body);
            $scope.createStyle = {display: 'none'};
            $scope.mfaStyle = {display: 'none'};
            
            
			
			$rootScope.getMenuData = function(){
                
                $http({
                url : "/getMenuData",
                method : "GET"
            })
            .success(function(data){               
                
				$rootScope.baseurl = $window.location.origin;
               if(data.success == 1){				   
					$rootScope.menus = data.msg.menus;		
			   }else{
					$rootScope.menus = ''; 
			   }
				
				//setting local session				
				$window.localStorage.removeItem('menuData');
				if($rootScope.menus != "" && $rootScope.menus != null && $rootScope.menus != undefined){
					
					var filterMenuData = $rootScope.menus.map(function(val) {
					  return val.url.replace('#/', '');
					}).join(',');
					var menuToArray = filterMenuData.split(",");
					var removeDuplicates = menuToArray.filter( function( item, index, inputArray ) {
						   return inputArray.indexOf(item) == index;
					});
					
					var menuData = removeDuplicates.toString();
				}else{
					
					var menuData = '';
				}
				
				$window.localStorage.setItem('menuData',menuData);
            });

            };
			$rootScope.getMenuData();
			
            $rootScope.changeTab = function (id,url) {
                $window.localStorage.setItem('tabId', id);
				window.location = url;
            };

            $http({
                url: "/getUserData",
                method: "GET"
            })
                    .success(function (data) {
                        $rootScope.companydata = data.companydata;
                        $scope.userId = data.userdata.id;
                        $scope.name = data.userdata.uname;
                        $rootScope.email = data.userdata.email;
                        $rootScope.userImage = data.userdata.userImage;
                        $rootScope.roleId = data.userdata.roleId;
                        $rootScope.roleNames = data.userdata.roleName;
                        $rootScope.name = data.userdata.uname;
                        $scope.ssh_key = data.userdata.ssh_key;

                        if (data.userdata.mfaEnabled == 0) {
                            $scope.mfaStyle = {display: 'block'};
                        }
                        if (data.companydata == null) {
                            $scope.createStyle = {display: 'block'};
                        }
                        for (var x in data.companydata) {
                            var projects = [];
                            var companyServers = [];
                            var companyLiveservers = [];
                            data.companydata[x].companyServers = [];
                            data.companydata[x].companyLiveservers = [];
                            data.companydata[x].projects = [];
                            for (var y in data.projectdata) {
                                if (data.projectdata[y].company_id == data.companydata[x].id) {
                                    projects.push(data.projectdata[y]);
                                    data.companydata[x].projects = projects;
                                }
                                for (var z in data.serverdata) {
                                    if (data.serverdata[z].company_id == data.companydata[x].id && data.serverdata[z].project_id == data.projectdata[y].project_id) {
                                        if (data.serverdata[z].ssm_status == 'Alive' || data.serverdata[z].ssm_status == 'Online') {
                                            companyLiveservers.push(data.serverdata[z]);
                                        }
                                        companyServers.push(data.serverdata[z]);
                                    }
                                    data.companydata[x].servers = companyServers;
                                    data.companydata[x].Liveservers = companyLiveservers;
                                }
                            }
                        }
                        for (var y in data.projectdata) {
                            var projectServers = [];
                            var projectLiveservers = [];
                            for (var z in data.serverdata) {
                                if (data.serverdata[z].project_id == data.projectdata[y].project_id) {
                                    if (data.serverdata[z].ssm_status == 'Alive' || data.serverdata[z].ssm_status == 'Online') {
                                        projectLiveservers.push(data.serverdata[z]);
                                    }
                                    projectServers.push(data.serverdata[z]);
                                }
                                data.projectdata[y].servers = projectServers;
                                data.projectdata[y].Liveservers = projectLiveservers;
                            }
                        }
                        $rootScope.modal_class = "";
                        $rootScope.compnaies = data.companydata;
                        $rootScope.projects = data.projectdata;
                        if (typeof data.userdata.shell !== "undefined" && data.userdata.shell != "" && data.userdata.shell != null) {
                            $scope.shell = data.userdata.shell;
                        }
                        if (typeof data.userdata.linuxName !== "undefined" && data.userdata.linuxName != "" && data.userdata.linuxName != null) {
                            $scope.linuxName = data.userdata.linuxName;
                        } else {
                            $scope.linuxName = data.userdata.uname;
                        }
                    });
            $scope.editUser = function () {
                $scope.edit = false;
            };
            $rootScope.setUserId = function (id) {
                companyService.setId(id);
            }
            $rootScope.setServerId = function (id, ssm_status) {
                if (ssm_status != "Alive") {
                    alert("SSM is not running. Please start SSM to acess server details.")
                    return false;
                }
                window.location = "#/serverDetails";
                companyService.setId(id);
            };
            $rootScope.clearSearch = function () {
                $rootScope.search = "";
                $rootScope.searchData = "";
                $('.search_value').val('');
            };
            $scope.changePassword = function (id, password) {
                $rootScope.change_password = $rootScope.change_password ? false : true;
                $rootScope.oldPassword = true;
                $rootScope.uid = id;
                $rootScope.passw = password;
                $rootScope.oldPass = "";
                $rootScope.newPass = "";
                $rootScope.renewPass = "";
                if ($rootScope.change_password) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
            $scope.saveUser = function () {
                $scope.edit = true;
                $http({
                    method: "POST",
                    url: "/save_profile_info",
                    data: {shell: $scope.shell, linux_uname: $scope.linuxName},
                    headers: {"Content-Type": "application/json"}
                })
                        .success(function (data) {
                            if (data.success == 1) {
                                $scope.infoSuccess = true;
                            } else {
                                $scope.infoSuccess = false;
                            }
                        });
            };

            $scope.upload = function () {
                var file = $scope.user_image;
                var formData = new FormData();
                formData.append("file", file);
                $http({
                    method: "post",
                    url: "/uploadImage",
                    data: formData,
                    transformRequest: angular.identity,
                    headers: {"Content-Type": undefined}
                })
                        .success(function (data) {
                            if (data.success == 1) {
                                $scope.uploadSuccess = true;
                            } else {
                                $scope.uploadSuccess = false;
                            }
                        });
            };

            $rootScope.sortCompanyBy = function (propertyName) {
                $rootScope.companyReverse = ($rootScope.companyProperty === propertyName) ? !$rootScope.companyReverse : false;
                $rootScope.companyProperty = propertyName;
            };
            $rootScope.sortProjectBy = function (propertyName) {
                $rootScope.projectReverse = ($rootScope.projectProperty === propertyName) ? !$rootScope.projectReverse : false;
                $rootScope.projectProperty = propertyName;
            };
            $rootScope.sortUserBy = function (propertyName) {
                $rootScope.userReverse = ($rootScope.userProperty === propertyName) ? !$rootScope.userReverse : false;
                $rootScope.userProperty = propertyName;
            };
            $scope.saveKey = function () {
                var sshKey = $scope.ssh_key;
                $scope.ssh_err_display = false;
                $scope.ssh_err_msg = "";
                if (sshKey == "" || sshKey == null) {
                    $scope.ssh_err_display = true;
                    $scope.ssh_err_msg = "SSH Public Key must be filled.";
                    return;
                }
                $http({
                    method: "POST",
                    url: "/updateSSHKey",
                    data: {sshKey: sshKey},
                    headers: {"Content-Type": "application/json"}
                })
                        .success(function (data) {
                            if (data.success == 1) {
                                $scope.keySuccess = true;
                            } else {
                                $scope.keySuccess = false;
                            }
                        });
            };

            $rootScope.setCompanyId = function (id) {
                companyService.setId(id);
            };

            $rootScope.setProjectId = function (id) {
                companyService.setId(id);
            };
            $rootScope.removePid = function () {
                $rootScope.pid = '';
            };
            $rootScope.showProjects = function (company_id) {
                var src = $('.img_' + company_id).attr("src");
                $('.hideDetails').attr("src", "images/plus.png");
                $('.hiderow').css("display", "none");
                if (src == "images/minus.png") {
                    $('.img_' + company_id).attr("src", "images/plus.png");
                    $('.' + company_id).css("display", "none");
                } else {
                    $('.img_' + company_id).attr("src", "images/minus.png");
                    $('.' + company_id).css("display", "block");
                }
            };

            $scope.showOptions = function (index) {
                if (local_index != index) {
                    $scope.visible = false;
                }
                local_index = index;
                $scope.visible = $scope.visible ? false : true;
            };

            $scope.showHelpModal = function () {
                $rootScope.visible_help = $rootScope.visible_help ? false : true;
                if ($rootScope.visible_help) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
            $scope.showCompanyModal = function () {
                $rootScope.visible_company = $rootScope.visible_company ? false : true;
                $rootScope.errName = false;
                $rootScope.companyName = "";
                $rootScope.company_err_msg = "";
                if ($rootScope.visible_company) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };

            $scope.showCompanyEditModal = function (id, name, companyIndex) {
                $rootScope.edit_company = $rootScope.edit_company ? false : true;
                $rootScope.errName = false;
                $rootScope.companyId = id;
                $rootScope.companyName = name;
                $rootScope.companyIndex = companyIndex;
                $rootScope.company_err_msg = "";
                $rootScope.liveServerdata = [];
                $rootScope.serverdata = [];
                var companydata = $rootScope.companydata;
                for (var x in companydata) {
                    if (companydata[x].id == id) {
                        $rootScope.liveserverdata = companydata[x].Liveservers;
                        $rootScope.serverdata = companydata[x].servers;
                    }
                }
                if ($rootScope.edit_company) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };

            $scope.DeleteCompanyModal = function (id, companyIndex) {
                $rootScope.delete_company = $rootScope.delete_company ? false : true;
                $rootScope.errName = false;
                $rootScope.companyId = id;
                $rootScope.companyIndex = companyIndex;
                $rootScope.company_err_msg = "";
                if ($rootScope.delete_company) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
            $rootScope.showProjectModal = function () {
                $rootScope.visible_project = $rootScope.visible_project ? false : true;
                $rootScope.errName = false;
                $rootScope.projectName = "";
                $rootScope.project_err_msg = "";
                if ($rootScope.visible_project) {
                    body.addClass("overflowHidden");
                    $rootScope.modal_class = "modal-backdrop fade in";
                } else {
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
			$rootScope.showUserModal = function () {
                $rootScope.visible_add_user_ = $rootScope.visible_add_user_ ? false : true;
                    $rootScope.userName  = "";
                    $rootScope.userEmail = "";
                    $rootScope.userPass = "";
                    $rootScope.userRole = "";
                    $rootScope.userGroup = "";
                    $rootScope.userId = "";
                    $rootScope.errName  = "";
                    $rootScope.errEmail  = "";
                    $rootScope.errPass  = "";
                    if ($rootScope.visible_add_user_) {
                        body.addClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in";
                    } else {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                    }
            };
			$rootScope.editUserModal = function (user_id,user_name,user_email,user_roleid,user_index,user_group_id) {
                $rootScope.visible_edit_user_ = $rootScope.visible_edit_user_ ? false : true;
                    $rootScope.userName  = user_name ;
                    $rootScope.userEmail = user_email;
                    $rootScope.userRole = user_roleid;
                    $rootScope.userGroup = user_group_id;
                    $rootScope.userId = user_id;
                    $http({
                            method: "POST",
                            url: "/getUserGroups",
                            data: {userid: user_id},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            $rootScope.userGroups = [];
                            for (var i = 0, l = data.length; i < l; i++) {
                              $rootScope.userGroups[i.toString()] = data[i].group_id;
                            }
                            $rootScope.userGroup=$rootScope.userGroups;
                      });
                    if ($rootScope.visible_edit_user_) {
                        body.addClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in";
                    } else {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                    }
            };
			$rootScope.deleteUserModal = function (user_id,user_index) {
               $rootScope.visible_delete_user_ = $rootScope.visible_delete_user_ ? false : true;
                    $rootScope.userId = user_id;
                    $rootScope.deleteuserIndex = user_index;
                    if ($rootScope.visible_delete_user_) {
                        body.addClass("overflowHidden");
                        $rootScope.modal_class = "modal-backdrop fade in";
                    } else {
                        body.removeClass("overflowHidden");
                        $rootScope.modal_class = "";
                    }
            };
            $rootScope.close = function (value) {
                if (value == "help") {
                    $rootScope.visible_help = $rootScope.visible_help ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                } else if (value == "company_cancel") {
                    $rootScope.visible_company = $rootScope.visible_company ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                } else if (value == "edit_company_cancel") {
                    $rootScope.edit_company = $rootScope.edit_company ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                } else if (value == "delete_company_cancel") {
                    $rootScope.delete_company = $rootScope.delete_company ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                } else if (value == "change_password_cancel") {
                    $rootScope.change_password = $rootScope.change_password ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                } else if (value == "project_cancel") {
                    $rootScope.visible_project = $rootScope.visible_project ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                } else if (value == "company_ok") {
                    var cname = "";
                    var liveserverdata = [];
                    var serverdata = [];
                    $rootScope.errName = false;
                    cname = $rootScope.companyName;
                    if (cname == undefined || cname.trim().length <= 0) {
                        $rootScope.errName = true;
                        return;
                    } else {
                        $rootScope.errName = false;
                        $http({
                            method: "POST",
                            url: "/createCompany",
                            data: {cname: cname.trim()},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                var result_data = {companyCreator: data.creator, companyName: cname.trim(), id: data.row_id, projects: [], Liveservers: liveserverdata, servers: serverdata};
                                if ($rootScope.compnaies == null) {
                                    $rootScope.compnaies = [];
                                }
                                $rootScope.compnaies.push(result_data);
                                $rootScope.visible_company = $rootScope.visible_company ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                            } else if (data.success == 0) {
                                $rootScope.company_err_msg = "Internal Error!";
                            } else if (data.success == 2) {
                                $rootScope.company_err_msg = data.err_desc;
                            }
                        });
                    }
                } else if (value == "edit_company_ok") {
                    var cname = "";
                    var cid = "";
                    var liveserverdata = [];
                    var serverdata = [];
                    $rootScope.errName = false;
                    cname = $rootScope.companyName;
                    cid = $rootScope.companyId;
                    liveserverdata = $rootScope.liveserverdata;
                    serverdata = $rootScope.serverdata;
                    if (cname == undefined || cname.trim().length <= 0) {
                        $rootScope.errName = true;
                        return;
                    } else {
                        $rootScope.errName = false;
                        $http({
                            method: "POST",
                            url: "/editCompany",
                            data: {cname: cname.trim(), cid: cid},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                var result_data = {companyCreator: data.creator, companyName: cname.trim(), id: cid, projects: [], Liveservers: liveserverdata, servers: serverdata};
                                if ($rootScope.compnaies == null) {
                                    $rootScope.compnaies = [];
                                }
                                $scope.update = function (cid, result_data) {
                                    var objects = $rootScope.compnaies;

                                    for (var i = 0; i < objects.length; i++) {
                                        if (objects[i].id === cid) {
                                            objects[i] = result_data;
                                            break;
                                        }
                                    }
                                };
                                $rootScope.compnaies.splice($rootScope.companyIndex, 1, result_data);
                                $rootScope.edit_company = $rootScope.edit_company ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                            } else if (data.success == 0) {
                                $rootScope.company_err_msg = "Internal Error!";
                            } else if (data.success == 2) {
                                $rootScope.company_err_msg = data.err_desc;
                            }
                        });
                    }
                } else if (value == "delete_company_ok") {
                    var cid = "";
                    $rootScope.errName = false;
                    cid = $rootScope.companyId;
                    if (cid == undefined) {
                        $rootScope.errName = true;
                        return;
                    } else {
                        $rootScope.errName = false;
                        $http({
                            method: "POST",
                            url: "/deleteCompany",
                            data: {cid: cid},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                if ($rootScope.compnaies == null) {
                                    $rootScope.compnaies = [];
                                }
                                $rootScope.compnaies.splice($rootScope.companyIndex, 1);
                                $rootScope.delete_company = $rootScope.delete_company ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                            } else if (data.success == 0) {
                                $rootScope.company_err_msg = "Internal Error!";
                            } else if (data.success == 2) {
                                $rootScope.company_err_msg = data.err_desc;
                            }
                        });
                    }
                } else if (value == "project_ok") {
                    var pname = "";
                    var liveserverdata = [];
                    var serverdata = [];
                    $rootScope.errName = false;
                    pname = $rootScope.projectName;
                    if (pname == undefined || pname.trim().length <= 0) {
                        $rootScope.errName = true;
                        return;
                    } else {
                        $scope.errName = false;
                        $http({
                            method: "POST",
                            url: "/createProject",
                            data: {pname: pname.trim(), cid: companyService.getId()},
                            headers: {"Content-Type": "application/json"}
                        }).
                                success(function (data) {
                                    if (data.success == 1) {
                                        var result = {projectName: pname.trim(), id: data.row_id, company_id: companyService.getId(), Liveservers: liveserverdata, servers: serverdata};
                                        var companydata = $rootScope.companies;
                                        for (var x in companydata) {
                                            var projects = companydata[x].projects;
                                            if (result.company_id == companydata[x].id) {
                                                projects.push(result);
                                                companydata[x].projects = projects;
                                            }
                                        }
                                        $rootScope.companies = companydata;
                                        $scope.projects.push(result);
                                        $rootScope.visible_project = $rootScope.visible_project ? false : true;
                                        body.removeClass("overflowHidden");
                                        $rootScope.modal_class = "";
                                    } else if (data.success == 0) {
                                        $rootScope.project_err_msg = "Internal Error!";
                                    } else if (data.success == 2) {
                                        $rootScope.project_err_msg = data.err_desc;
                                    }
                                });
                    }
                } else if (value == "change_password_ok") {
                    $rootScope.errOldP = false;
                    $rootScope.errNewP = false;
                    $rootScope.errNewR = false;
                    var uid = $rootScope.uid;
                    var passw = $rootScope.passw;
                    var oldP = $rootScope.oldPass;
                    var newP = $rootScope.newPass;
                    var renewP = $rootScope.renewPass;
                    if (oldP == undefined || oldP == "") {
                        $rootScope.errOldP = true;
                        return;
                    } else if (newP == undefined || newP == "") {
                        $rootScope.errNewP = true;
                        return;
                    } else if (renewP == undefined || renewP == "") {
                        $rootScope.errNewR = true;
                        return;
                    } else if (newP != renewP) {
                        $rootScope.error_msg = "Password not Match";
                        return;
                    } else if (newP.length < 6 || newP.length > 12) {
                        $rootScope.error_msg = "Password must be of min 6 characters and max 12 characters";
                        return;
                    } else {
                        $rootScope.error_msg = "";
                        $rootScope.modal_class = "modal-backdrop fade in loader";
                        $rootScope.change_password = $rootScope.change_password ? false : true;
                        $http({
                            method: "POST",
                            url: "/changePassword",
                            data: {oldP: oldP, newP: newP, uid: uid, passw: passw},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                alert("Password has been changed successfully.");
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                            } else {
                                $rootScope.error_msg = data.err_msg;
                            }
                        });
                    }
                }
				else if (value == "user_ok") {
                    $rootScope.errName = false;
                    $rootScope.errEmail = false;
                    $rootScope.errPass = false;
                    var uName = "";
                    var uEmail = "";
                    var uPass = "";
                    var uRole = "";
                    var uGroup = "";
                    uName = $rootScope.userName;
                    uEmail = $rootScope.userEmail;
                    uPass =$rootScope.userPass;
                    uRole =$rootScope.userRole;
                    uGroup = $rootScope.userGroup;
                    if (uName == undefined || uName=="") {
                        $rootScope.errName = true;
                        return;
                    }else if (/\s/.test(uName)) {
                        $rootScope.errSpace = true;
                        return;
                    } else if (uEmail == undefined || !emailPattern.test($rootScope.userEmail)) {
                        $rootScope.errName = false;
                        $rootScope.errSpace = false;
                        $rootScope.errEmail = true;
                        return;
                    }else if (uPass == undefined || uPass=="") {
                        $rootScope.errPass = true;
                        return;
                    }else if (uRole == undefined || uRole=="") {
                        $rootScope.errRole = true;
                        return;
                    } else {
                        $rootScope.errName = false;
                        $rootScope.errEmail = false;
                        $rootScope.errPass = false;
                        $rootScope.errSpace = false;
                        $http({
                            method: "POST",
                            url: "/createUser",
                            data: {uName: uName, uEmail: uEmail,uPass:uPass,uRole:uRole,uGroup:uGroup},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                var userCredentials = {uname : uName, passw : uPass,key:data.key,email : uEmail};
				$http({
			 	url : mailUserCredentialsUrl,
			 	data : userCredentials,
			 	method : "post",
			 	headers: {'Content-Type': 'application/json'},
                                }).success(function(data){
                                });
                                //var result_data = {email: uEmail, id: data.row_id, uname: uName ,roleId:uRole};
                                $rootScope.visible_add_user_ = $rootScope.visible_add_user_ ? false : true;
                                //$rootScope.usersdata.push(result_data);
                                location.reload();
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                            } else if (data.success == 0) {
                                $rootScope.user_err_msg = "Internal Error!";
                            } else if (data.success == 2) {
                                $rootScope.user_err_msg = data.err_desc;
                            }
                        });
                    }
                } 
                else if (value == "edit_user_ok") {
                    $rootScope.errName = false;
                    $rootScope.errEmail = false;
                    $rootScope.errPass = false;
                    var uName = "";
                    var uRole = "";
                    var uId = "";
                    var uGroup = "";
                    uName = $rootScope.userName;
                    uRole =$rootScope.userRole;
                    uId =$rootScope.userId;
                    uGroup = $rootScope.userGroup;
                    if (uName == undefined || uName=="") {
                        $rootScope.errName = true;
                        return;
                    }else if (/\s/.test(uName)) {
                        $rootScope.errSpace = true;
                        return;
                    } else {
                        $rootScope.errName = false;
                        $rootScope.errSpace = false;
                        $http({
                            method: "POST",
                            url: "/editUser",
                            data: {uName: uName,uRole:uRole,uId:uId,uGroup:uGroup},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                location.reload();
                                $rootScope.visible_edit_user_ = $rootScope.visible_edit_user_ ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
                            } else if (data.success == 0) {
                                $rootScope.user_err_msg = "Internal Error!";
                            } else if (data.success == 2) {
                                $rootScope.user_err_msg = data.err_desc;
                            }
                        });
                    }
                } 
                 else if (value == "delete_user_ok") {
                    var uId = "";
                    uId =$rootScope.userId;
                        $http({
                            method: "POST",
                            url: "/deleteUser",
                            data: {uId:uId},
                            headers: {"Content-Type": "application/json"}
                        }).success(function (data) {
                            if (data.success == 1) {
                                $rootScope.usersdata.splice($rootScope.deleteuserIndex , 1);
                                if ($rootScope.usersdata.length % 10 == 0) {
                                $rootScope.pages = [];
                                $rootScope.noOfPages = Math.ceil($rootScope.usersdata.length / $rootScope.numPerPage);
                                    for (var j = 1; j <= $rootScope.noOfPages; j++) {
                                        $rootScope.pages.push(j);
                                    }
                                    if ($rootScope.currentPage > $rootScope.noOfPages) {
                                        $rootScope.selectPage($rootScope.noOfPages);
                                    } else {
                                        $rootScope.selectPage($rootScope.currentPage);
                                    }
                                }
                                $rootScope.visible_delete_user_ = $rootScope.visible_delete_user_ ? false : true;
                                body.removeClass("overflowHidden");
                                $rootScope.modal_class = "";
								location.reload();
                            } else if (data.success == 0) {
                                $rootScope.user_err_msg = "Internal Error!";
                            } else if (data.success == 2) {
                                $rootScope.user_err_msg = data.err_desc;
                            }
                        });
                }
				else if (value == "user_cancel") {
                    $rootScope.visible_add_user_ = $rootScope.visible_add_user_ ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }else if (value == "edit_user_cancel") {
                    $rootScope.visible_edit_user_ = $rootScope.visible_edit_user_ ? false : true;
                    body.removeClass("overflowHidden");
                    $rootScope.modal_class = "";
                }
            };
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
            // $timeout(function() {
            //     $scope.createStyle={display:'none'};
            //     $scope.mfaStyle={display:'none'};
            // }, 5000);

            $http({
                method: "post",
                url: "/getUsers",
                headers: {"Content-Type": "application/json"}
            })
                    .success(function (data) {
                        $rootScope.usersdata = data;
                    });
					
			$http({
                method: "post",
                url: "/getGroups",
                headers: {"Content-Type": "application/json"}
            })
			.success(function (data) {
				$rootScope.groupsdata = data;
			});
			
			$http({
                method: "post",
                url: "/getRole",
                headers: {"Content-Type": "application/json"}
            })
			.success(function (data) {
				$rootScope.roles = data;
			});
        });
        