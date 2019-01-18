wwApp.config(function($stateProvider) {
  $stateProvider.state('vestDynamic', {
    url: '/vestDynamic/:id',
    templateUrl: './frontend/components/vestManage/vestDynamic/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$stateParams) {
       // console.log($stateParams);
        var service = apiActions.list;
        var userId = $stateParams.id;
        var data ={
              userId:userId,
              current:1,
              size:10
        }

        var fictitiousContentList =function(){
            service.fictitiousContentList($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.fictitiousContent = res.data.data;
            var fictitiousContentList = res.data.data.list;
            $scope.fictitiousContentList = fictitiousContentList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        fictitiousContentList();




            //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            fictitiousContentList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          fictitiousContentList();
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
                //删除
        del:function(id){
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/del.html',
            backdrop: 'static',
            windowClass: 'modal-music',
            controller: function($scope, $uibModalInstance, token) {
              // console.log(id);
              var date={
                      id:id,
                      state:1
                            }
                 $scope.sunSeal=function(){
                        service.ficUpdate($.param(date))
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('操作成功！')
                             }
                              fictitiousContentList();
                            })  
                           
                          $uibModalInstance.close();
                  }
               $scope.close_modal = function() {
                $uibModalInstance.close();
                  }
              }
            })
          },
           //设为开放和设为隐私
                   topSet: function(id,i) {
                    // console.log(id,i)
                      if (i=="设为隐私") {
                        var data ={
                          id:id,
                          showOrHide:0

                        }
                        service.ficUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                              fictitiousContentList();
                            }
                          })
                           
                      }else if (i=="设为开放") {
                         var data ={
                          id:id,
                          showOrHide:1
                        }
                        service.ficUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                               fictitiousContentList();
                            }
                          }) 
                      };
                     
                  },
                   cc :function(id){
                      // console.log(id)
                       var url = './index.html#/vestComment/'+id.id;
                     // console.log(url);
                      window.open(url,'_blank');
                  }, 
        }
        angular.extend($scope, methods);

    }
  })
})
