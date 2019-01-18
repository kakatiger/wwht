wwApp.config(function($stateProvider) {
  $stateProvider.state('vestComment', {
    url: '/vestComment/:id',
    templateUrl: './frontend/components/vestManage/vestDynamic/vestComment/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$stateParams) {
       console.log($stateParams);
        var service = apiActions.list;
        var contentId = $stateParams.id;
        var data ={
              contentId:contentId,
              current:1,
              size:10
        }

        var ficComment =function(){
            service.ficComment($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.ficComment = res.data.data;
            var ficCommentList = res.data.data.list;
            $scope.ficCommentList = ficCommentList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        ficComment();




            //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            ficComment();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          ficComment();
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
            comment: function(user,ans,par,tag,con,name) {
              console.log(user,ans,par,tag,con,name)
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/comment.html',
                backdrop: 'static',
                windowClass: 'modal-now',
                controller: function($scope, $uibModalInstance) {
                      $scope.sunSeal = function(names) {
                      // console.log(id,names)
                      $("#btn1").attr({ disabled: "disabled" });
                      var data={
                         content:names,
                         tagId:tag,
                         userId:user,
                         answeredUserId:ans,
                         parentId:par,
                         contentId:con,
                         nickname:name
                      };
                    service.ficCommentAdd($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                          // window.location.reload()

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
          
        }
        angular.extend($scope, methods);

    }
  })
})
