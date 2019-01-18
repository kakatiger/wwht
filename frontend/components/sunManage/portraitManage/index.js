wwApp.config(function($stateProvider) {
  $stateProvider.state('portraitManage', {
    url: '/portraitManage',
    name: 'portraitManage',
    templateUrl: './frontend/components/sunManage/portraitManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
        var data={

        }
      var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
          var commentAvatar =function(){
          service.commentAvatar()
          .then(function(res) {
            console.log(res)
            $scope.commentAvatar = res.data.data;
          })
        }
        commentAvatar();

        var methods = {
         adopt:function(userID,id,img){
               var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/adopt.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                 var date ={
                  state:1,
                  id:id,
                  userId:userID,
                  avatar:img
                }
                $scope.adopt=function(){
                        service.commentAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('审核通过！')
                             }
                              commentAvatar();
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
         },
           //commentAudit
              notAdopt:function(userID,id,img){

               var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/adopt.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                 var date ={
                  state:2,
                  id:id,
                  userId:userID,
                  avatar:img
                }
                $scope.adopt=function(){
                        service.commentAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('成功！')
                             }
                              commentAvatar();
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
         }

        }
        angular.extend($scope, methods);

    }
  })
})




