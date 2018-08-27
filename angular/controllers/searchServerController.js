angular.module("searchServerController", []).controller("searchServerController",
    function ($scope, $location, $http, $rootScope, companyService, $document, $timeout) {
        var local_index = -1;
        $rootScope.isFilterSearch = TextTrackCueList;
        $rootScope.arr1 = []
        $rootScope.arr2 = []
        $rootScope.search_keyword = '';
        $rootScope.search_col = '';
        $rootScope.searchField = '';
        $rootScope.displayFilterFlag = false;
        $rootScope.p1 = function (value) {
            $(".l1").val(value)
        }
        $rootScope.searchServer = function () {
            $rootScope.search_col = $('.l1').val();
            $rootScope.search_keyword = $('.l2').val();
            
            $http({
                method: "POST",
                url: "/searchServer",
                cache: true,
                data: { search_keyword: $rootScope.search_keyword, search_by: $rootScope.search_col },
                headers: { "Content-Type": "application/json" }
            })
                .success(function (data) {
                    $rootScope.modal_class = "";
                    $rootScope.searchData = data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].raw_data != null) {
                            var array = JSON.parse(data[i].raw_data);
                            $rootScope.searchData[i].instanceState = array.State.Name;
                            for (var k = 0; k < array.Tags.length; k++) {
                                if (array.Tags[k]['Key'] == "Environment") {
                                    $rootScope.searchData[i].environmentValue = array.Tags[k]['Value'];
                                }
                            }
                        } else {
                            var instanceId = $rootScope.searchData[i].instanceId;
                            if (instanceId.indexOf("mi-") !== -1) {
                                $rootScope.searchData[i].instanceState = "hybrid";
                            }
                        }
                        window.location = "/#searchServer";
                    }
                    if (data == "") {
                        window.location = "/#searchServer";
                    }
                });
        };

        $scope.searchParameters = [{
            Id: 'projectname',
            Value: 'ProjectName'
        }, {
            Id: 'servername',
            Value: 'ServerName'
        }, {
            Id: 'instanceid',
            Value: 'InstanceId'

        }];
        $rootScope.getfilterby = function (filtername, search, abc) {
            $rootScope.filterFlag = true;
            $rootScope.searchField = search;
            $rootScope.displayFilterFlag = false;
        };

        $rootScope.showFilters = function () {
            $rootScope.displayFilterFlag = true;
        };


        // console.log($rootScope.searchParameters);
        $http({
            method: "get",
            url: "/getUserData",
            cache: true,
            headers: { "Content-Type": "application/json" }
        })
            .success(function (data) {
                $rootScope.searchedData = data;

                console.log("user data", $rootScope.searchedData)
                $rootScope.arr1 = $rootScope.searchedData.companydata
                $rootScope.arr2 = $rootScope.searchedData.projectdata

            });
        $rootScope.managefilter = function (event) {
            alert(event.target.id);
        };
        $rootScope.getMenuData = function(){
                
            $http({
            url : "/getMenuData",
            method : "GET",
            dataType: 'json',
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
        
        $rootScope.changeTab = function (id,url) {            
                window.location = url;
        };
		
                $rootScope.setServerId = function(id,ssm_status){
                    if(ssm_status!="Alive" && ssm_status!="Online"){
                        alert("SSM is not running. Please start SSM to acess server details.")
                        return false;
                    }
                    window.location ="#/serverDetails";
                    companyService.setId(id);
                  };

        $rootScope.getMenuData();

        $rootScope.changeTab = function (id, url) {
            window.location = url;
        };

        $rootScope.setServerId = function (id, ssm_status) {
            if (ssm_status != "Alive" && ssm_status != "Online") {
                alert("SSM is not running. Please start SSM to acess server details.")
                return false;
            }
            window.location = "#/serverDetails";
            companyService.setId(id);
        };

        $http({
            method: "post",
            url: "/getLoginUserDetails",
            headers: { "Content-Type": "application/json" }
        })
            .success(function (data) {

                $rootScope.name = data[0].uname;
                $rootScope.roleId = data[0].roleId;
                $rootScope.roleName = data[0].roleName;
                $rootScope.email = data[0].email;
                $rootScope.userImage = data[0].userImage;
            });
    });
    