wwApp.config(function($stateProvider) {
  $stateProvider.state('banManage', {
    url: '/banManage',
    name: 'banManage',
    templateUrl: './frontend/components/banManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) { 
      var service = apiActions.list;
      //contList
      var data = {
        current:1,
        size:10
      }
      var collect =function(){
          service.collect(data)
          .then(function(res) {
            console.log(res)
            $scope.collect = res.data.data.list;

            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
           
          })
        }
        collect();
              //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            collect();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          collect();
        }
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
          
             pet:function(id){

               var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/del.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                 var date ={
                 ideaId:id
                }
                $scope.sunSeal=function(){
                        service.collect_del(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('删除成功！')
                             }
                               collect();
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
