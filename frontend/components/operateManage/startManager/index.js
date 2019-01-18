// 启动页，这里是启动页
wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.startManager', {
    url: '/startManager',
    name: 'startManager',
    templateUrl: './frontend/components/operateManage/startManager/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals,uploadStr) {
        var service = apiActions.list;
        var data={
              current:1,
              size:10,
          }
          console.log(data)
         var startManagerList =function(){
            service.startManagerList($.param(data))
          .then(function(res) {
              console.log(1)
              console.log(res)  
              console.log(2);
                          
            $scope.startup = res.data.data;
            var startManagerList = res.data.data.list;
            $scope.startManagerList = startManagerList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        startManagerList();

         //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            startManagerList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          startManagerList();
        }
       //点击图片时放大显示图片  
    //     $scope.changePic = function($event){  
    //         var img=$event.srcElement || $event.target;   
    //         $("#bigimage").attr('src',img.src);  
    //         $("#js-imgview").css("display",'block');  
    //         $("#js-imgview-mask").css("display",'block');
    //     }  
    //   //点击图片时放小显示图片  
    //     $scope.closePic =function(){ 
    //         $("#js-imgview").css("display",'none');  
    //         $("#js-imgview-mask").css("display",'none');  
    //     }
        var methods = {
                   //新增
          bannerIncrease: function() {
              alert('功能正在开发')
        //   var $ctrl = this;
        //   $ctrl.animationsEnabled = true
        //   var modalInstance = $uibModal.open({
        //     animation: $scope.animationsEnabled, //打开时的动画开关
        //     templateUrl: './frontend/template/banner.html',
        //     backdrop: 'static',
        //     windowClass: 'modal-avd',
        //     controller: function($scope, $uibModalInstance, uploadBanners) {
        //       service.getQiniuToken(data)
        //         .then(function(res) {
        //           var qiniuToken = res.data.data.token;
        //           if (qiniuToken) {
        //             uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
        //           }else{
        //               alert('保存失败')
        //           }
        //         })
                
        //       $scope.close_modal = function() {
        //         $uibModalInstance.close();
        //       }
        //     //   闪屏话题列表
        //       var  startupTopicList = function(startupTopicList){
        //         service.startupTopicList().then(function(res){
        //             console.log('话题')
        //             console.log(res)
        //             console.log('话题')
        //             $scope.startupTopicList = res.data.data.list                
        //         })
        //     }
        //     $scope.linkType="1"
        //     $scope.goType='jh'
        //      startupTopicList()
        //     //  if(scope.goType=='jh'){
        //     //     $scope.linkType="3"
        //     //  }
        //     $scope.ly_test = function(){
        //          console.log($scope.goType,$scope.linkUrl, $scope.linkType)
        //      }
        //     }
        //   })
        },
            //编辑
        // exit_bannerIncrease: function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId) {
        //     var $ctrl = this;
        //     $ctrl.animationsEnabled = true
        //     var modalInstance = $uibModal.open({
        //         animation: $scope.animationsEnabled, //打开时的动画开关
        //         templateUrl: './frontend/template/exit_banner.html',
        //         backdrop: 'static',
        //         windowClass: 'modal-avd',
        //         controller: function($scope, $uibModalInstance, uploadBanners) {
        //         $scope.banUrl = url;
        //         $scope.billboardName = billboardName;
        //         $scope.time = time;
        //         $scope.id = id;
        //         $scope.startTime = startTime;
        //         $scope.endTime = endTime;
        //         $scope.linkUrl = linkUrl;
        //         $scope.linkType = linkType;
        //         $scope.tagId = tagId;
        //         if($scope.linkType=='1' || $scope.linkType=='2'){
        //             $scope.goType='lj'
        //         }else{
        //             $scope.goType='jh' 
        //         }
                
        //             service.getQiniuToken(data)
        //             .then(function(res) {
        //             var qiniuToken = res.data.data.token;
        //             if (qiniuToken) {
        //                 uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
        //             }
        //             })
        //         $scope.abc =function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId){
        //             // console.log(desc,time)
        //             var date={
        //             billboardId:id,
        //             time:time,
        //             billboardName:billboardName,
        //             startTime:startTime,
        //             endTime:endTime,
        //             linkUrl:linkUrl,
        //             linkType:linkType,
        //             tagId:tagId
        //             }
               
        //             console.log(date)
        //         service.startUpdate($.param(date))
        //             .then(function(res) {
        //                 console.log('16日下午')
        //             console.log(res)
        //             if (res.data.msg == '成功.') {
        //             toastr.success('修改成功！');
        //             $uibModalInstance.close();
        //             startManagerList();
        //             }else {
        //                     alert("添加失败！");
        //                 };
        //     })
        //         }
        //              //   闪屏话题列表
        //       var  startupTopicList = function(startupTopicList){
        //         service.startupTopicList().then(function(res){
        //             console.log('话题')
        //             console.log(res)
        //             console.log('话题')
        //             $scope.startupTopicList = res.data.data.list                
        //         })
        //     }
        //     startupTopicList()
        //         $scope.close_modal = function() {
        //             $uibModalInstance.close();
        //         }
        //         }
        //     })
        // },
        // 更改状态
        // bannerUpd:function(id,state){
        //     console.log(id,state)
        //     var date={
        //         billboardId:id,
        //         state:state
        //     }
        //     service.startUpdate($.param(date))
        //         .then(function(res) {
        //         console.log(res)
        //         if (res.data.msg == '成功.') {
        //             toastr.success('成功！');
        //             setTimeout('window.location.reload()',100)
        //         }else {
        //                 alert("启动广告只能开启一个，已存在开启的启动广告!");
        //                 };
        //     })
        //   },
 
        }
        angular.extend($scope, methods);
    }
  })
})
