wwApp.config(function($stateProvider) {
  $stateProvider.state('systemManage', {
    url: '/systemManage',
    name: 'systemManage',
    templateUrl: './frontend/components/systemManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token, locals,baseUrl,$rootScope) {
    	var service = apiActions.list;
    	var navList = locals.getObject("menuList");
    	$scope.selects;
    	var navParentId; //父级Id
    	$.each(navList, function(i,item) {
				if(item.name == '系统设置'){
					navParentId = item.id;
				}
			});

			var sideNave = navList.filter(function (obj) {
		    return obj.pid == navParentId;
			});
			$scope.sideNave = sideNave;
      var data ={
        current:1,
        size:100
      }
			 //用户列表
        service.roleList($.param(data))
          .then(function(res) {
            console.log(res)
              var dataList = res.data.data.list;
               $scope.assignList = dataList;
          })
			
		
        var methods = {
          //新增角色
        sysIncrease: function() {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/role.html',
                backdrop: 'static',
                windowClass: 'modal-user',
                controller: function($scope, $uibModalInstance) {
                   $scope.addRole = function(data) {
                    console.log(data)
                service.roleAdd($.param(data))
                  .then(function(res) {
                    console.log(res)
                      var result = res.data.msg;
                      if (result == '成功.') {
                        toastr.success('成功！');
                        
                        function reload() {
                          window.location.reload(true);
                        }
                        setTimeout(reload, 1000);
                      }else{
                        toastr.error(result);
                      }
                  })
              }

                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },
        //用户管理
         user: function(id,name) {

              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/user.html',
                backdrop: 'static',
                windowClass: 'modal-rolo',
                controller: function($scope, $uibModalInstance,apiActions) {
                  $scope.nickName = name;
                  // console.log(id)
                      var data ={
                       roleId:id
                }
                  service.assignList(data)
                  .then(function(res) {
                    // console.log(res)
                var userList = res.data.data.list;
                  $scope.userdata = userList;
                  }),
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                   //新增用户
                $scope.add_user= function() {
                  
                  var itemId =id;
                  // console.log(itemId)
                  var scope = $rootScope.$new();
                  scope.roleId=itemId;
                    var $ctrl = this;
                    $ctrl.animationsEnabled = true
                    var modalInstance = $uibModal.open({
                      animation: $scope.animationsEnabled, //打开时的动画开关
                      templateUrl: './frontend/template/add_user.html',
                      backdrop: 'static',
                      windowClass: 'modal-user',
                      controller: 'C_add_Warn',
                       controller: function($scope, $uibModalInstance,apiActions) {
                         var service = apiActions.list;
                          var data = itemId //角色id
                          // console.log(data)
                          //创建用户
                          $scope.createUser = function(formData) {
                            formData.roleId = data;
                            service.createUser($.param(formData))
                            .then(function(res) {
                                var result = res.data.msg;
                                if (result == '成功.') {
                                  toastr.success('添加成功！');
                                  
                                  function reload() {
                                    window.location.reload(true);
                                  }
                                  setTimeout(reload, 1000);
                                  
                                }else{
                        toastr.error(result);
                           }
                            })
                          }
                          //关闭弹窗
                          $scope.close_modal = function() {
                            $uibModalInstance.close();
                          }


                                      }
                    })
                  }
                        //用户禁用启用
                  $scope.opt_user = function(datas){
                    // console.log(datas)
                    var data = {userId:datas};
                    service.optUser($.param(data))
                      .then(function(res) {
                        // console.log(res)
                          var result = res.data.msg;
                          if (result == '成功.') {
                            // datas.isHover = !datas.isHover; //改变颜色
                            toastr.success('成功！');
                            $uibModalInstance.close();
                          }else{
                            toastr.error(result);
                          }
                      })
                  }
                }
              })
        },
        //编辑权限
         sysEdit: function(id,name) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/edit_role.html',
                backdrop: 'static',
                windowClass: 'modal-avd',
                controller: function($scope, $uibModalInstance) {
                  // console.log(id,name)
                  $scope.allId=[]; //所有全选后的id
                  $scope.username = name;
                  // console.log($scope.username)
                var data ={
                       roleId:id
                }
                  service.assignMenuList(data)
                  .then(function(res) {
                    // console.log(res)
                   $scope.roleMenuList = res.data.data.list;
            var pList = $scope.roleMenuList;
            pList.forEach(function (element, index, array) {
                // element: 指向当前元素的值
                // index: 指向当前索引
                // array: 指向Array对象本身
                if(element.isOpt == 1){
                 // console.log(element.menuId)
                  $scope.allId.push(element.menuId);
                }
                element.nodes.forEach(function (ele, index, array) {
                  if(ele.isOpt == 1){
                   // console.log('childen',element.menuId)
                    $scope.allId.push(ele.menuId);
                  }
                })
               // console.log($scope.allId)
            });
               
                     
                  }),
          //修改角色权限
          $scope.updateMenu=function(){
              var stri = $scope.allId;
              // console.log(stri)
              var str = stri.join(",");
              var data = {
                roleId:id,
                menuIds:str
              }
              service.updateMenu($.param(data))
                .then(function(res) {
                  // console.log(res)
                    var result = res.data.msg;
                    if (result == '成功.') {
                      toastr.success('成功！');
                      
                      function reload() {
                        window.location.reload(true);
                      }
                      setTimeout(reload, 1000);
                  
                    }else{
                      toastr.error(result);
                    }
                })
            },
         //修改角色权限
            $scope.onlyChecked = function($event,s){ 
              var e = $event.target;
              if(e.checked == false){  //未选中
                $scope.allId.removeByValue(s);
                  // console.log($scope.allId)
              }else if(e.checked == true){//选中
                $scope.allId.push(s);
                  // console.log($scope.allId)
              }
            }
                
        //关闭弹窗
            $scope.close_modal = function() {
              $uibModalInstance.close();
            } 
                }

              })
         },
         
        }
        angular.extend($scope, methods);

    }
  })
})
       