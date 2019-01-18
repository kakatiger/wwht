wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.topicManage', {
    url: '/topicManage',
    name: 'topicManage',
    templateUrl: './frontend/components/operateManage/topicManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
         var service = apiActions.list;
         var data ={
             current:1,
              size:10
         }
         var topicList =function(){
            service.topicList($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.topic = res.data.data;
            var topicList = res.data.data.list;
            $scope.topList = topicList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        topicList();

          //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            topicList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          topicList();
        }


        var methods = {          
        //新增话题
        newTopic: function() {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/topic.html',
                backdrop: 'static',
                windowClass: 'modal-user',
                controller: function($scope, $uibModalInstance) {
              $scope.topicAdd = function(name,val) {
                console.log(name,val)
               
                var data={
                  name:name,
                  showOrder:val,
                    
                };
                    service.topicAdd($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                           $("#btn1").attr({ disabled: "disabled" });
                          window.location.reload()

                          $uibModalInstance.close();
                        }else if (res.data.msg == '排序错误.') {
                              alert("排序已存在，请重新填写");
                           }else if (res.data.msg == '名称已存在') {
                              alert("名称已存在，请重新填写");
                           };
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },
        setUP: function() {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/setUP.html',
                backdrop: 'static',
                windowClass: 'modal-new',
                controller: function($scope, $uibModalInstance) {

                  //topRecommend
                  service.topRecommend(data)
                    .then(function(res) {
                      // console.log(res)
                      var cont = res.data.data.list;
                      console.log(cont)
                      var v1;
                      var v2;
                      for (var i = 0; i < cont.length; i++) {
                        if(cont[i].name == 2){
                          v1 = cont[i].value;
                        }else{
                          v2 = cont[i].value;
                        }
                      };
                       $scope.v1= v1;
                       $scope.v2 =v2;
                    })



                      $scope.set = function(val,num) {
                      console.log(val,num)
                      $("#btn1").attr({ disabled: "disabled" });
                      var data={
                         objectNum:val,
                         objectNum1:num
                      };
                    service.topicRecommend($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                          window.location.reload()

                          $uibModalInstance.close();
                        }
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },	
         exit_topic: function(id,name,val) {
          console.log(id,name,val)
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/edit_topic.html',
                backdrop: 'static',
                windowClass: 'modal-user',
                controller: function($scope, $uibModalInstance) {
                  $scope.exitName =name;
                  $scope.exitNum = val;
                  $scope.exitId =id;
                    $scope.topicUpdate = function(name,val,id) {
                      console.log(name,val,id)
                      
                      var data={
                        name:name,
                        showOrder:val,
                        id:id
                      };
                    service.topicUpdate($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                          $("#btn1").attr({ disabled: "disabled" });
                          window.location.reload()

                          $uibModalInstance.close();
                        }else if (res.data.msg == '排序错误.') {
                              alert("排序已存在，请重新填写");
                            }else if (res.data.msg == '名称已存在') {
                              alert("名称已存在，请重新填写");
                           };
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },
            //顶置和已顶置
                   topSet: function(id,i) {
                    console.log(id,i)
                      if (i=="置顶") {
                        var data ={
                          id:id,
                          isRecommendTag:1

                        }
                        service.topicUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                              topicList();
                            }
                          })
                           
                      }else if (i=="取消置顶") {
                         var data ={
                          id:id,
                          isRecommendTag:0
                        }
                        service.topicUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                               topicList();
                            }
                          }) 
                      };
                     
                  },

        }
        angular.extend($scope, methods);

    }
  })
})
