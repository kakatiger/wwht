wwApp.config(function($stateProvider) {
  $stateProvider.state('userManage', {
    url: '/userManage/:id',
    name: 'userManage',
    templateUrl: './frontend/components/sunManage/userManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals,$stateParams) {
      var service = apiActions.list;
      var id = $stateParams.id;
        var data={
            id:id
        }
      var commentUser =function(){
          service.commentUser(data)
          .then(function(res) {
            console.log(res)
            $scope.commentUser = res.data.data;
          })
        }
        commentUser();
       


        var methods = {
               //封禁
            col: function(userID) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/closure.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
              //audit
              var date ={
                state:1,
                userId:userID
              }
                $scope.colt=function(){
                        service.commentUserAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('封禁成功！')
                             }
                             setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
              //屏蔽
            shie: function(userID) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/shield.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
               var date ={
                state:2,
                userId:userID
              }
                $scope.shi=function(){
                        service.commentUserAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('屏蔽成功！')
                             }
                            setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

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




