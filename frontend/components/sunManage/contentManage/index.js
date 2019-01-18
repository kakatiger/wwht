wwApp.config(function($stateProvider) {
  $stateProvider.state('contentManage', {
    url: '/contentManage',
    name: 'contentManage',
    templateUrl: './frontend/components/sunManage/contentManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
        var data={
          current:1,
          size:1
        }
     
         var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            // console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
        // sunConList
          var sunConList =function(){
          service.sunConList($.param(data))
          .then(function(res) {
            console.log(res)
             $scope.sunCon = res.data.data;
            $scope.sunConList = res.data.data.list;
          })
        }
        sunConList();
            //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        var methods = {
             //封禁
            col: function(userID,id,contID,content) {
              console.log(userID,id,contID)
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
                userId:userID,
                state:1,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.colt=function(){
                        service.audit($.param(date))
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
           //警告
            war: function(userID,id,contID,content) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/warning.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                var date ={
                userId:userID,
                state:2,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.wat=function(){
                        service.audit($.param(date))
                            .then(function(res) {
                               // console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('警告成功！')
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
            shie: function(userID,id,contID,content) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/shield.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
               var date ={
                userId:userID,
                state:3,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.shi=function(){
                        service.audit($.param(date))
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
            //不处理
            noth: function(userID,id,contID,content) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/notHandle.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                  var date ={
                userId:userID,
                state:0,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.not=function(){
                        service.audit($.param(date))
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('操作成功！')
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




