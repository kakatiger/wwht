// 原为启动页管理，现改成闪屏管理
wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.startupManage', {
    url: '/startupManage',
    name: 'startupManage',
    templateUrl: './frontend/components/operateManage/startupManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals,uploadStr) {
        var service = apiActions.list;
        var data={
              current:1,
              size:10,
          }
         var startupList =function(){
            service.startupList($.param(data))
          .then(function(res) {
            $scope.startup = res.data.data;
            var startupList = res.data.data.list;
            $scope.startupList = startupList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        startupList();

         //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            startupList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          startupList();
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
                   //新增
          bannerIncrease: function() {
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/banner.html',
            backdrop: 'static',
            windowClass: 'modal-avd',
            controller: function($scope, $uibModalInstance, uploadBanners) {
              service.getQiniuToken(data)
                .then(function(res) {
                  var qiniuToken = res.data.data.token;
                  if (qiniuToken) {
                    uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
                  }else{
                      alert('保存失败')
                  }
                })
                
              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            //   闪屏话题列表
              var  startupTopicList = function(startupTopicList){
                service.startupTopicList().then(function(res){
                    $scope.startupTopicList = res.data.data.list                
                })
            }
            function today(){
                var today=new Date();
                var h=today.getFullYear();
                var m=today.getMonth()+1;
                var d=today.getDate();
                m= m<10?"0"+m:m;     
                d= d<10?"0"+d:d;
                if( $scope.startTime==undefined)
                $scope.startTime=h+"-"+m+"-"+d;
                if( $scope.endTime==undefined){
                    $scope.endTime=h+"-"+m+"-"+d;
                }
            }
            today()
            funcStart= function(tim){//将选好的时间携带过来
                $scope.startTime = tim ;
              }
            funcEnd= function(tim){//
                $scope.endTime = tim ;
              }
            //   chosen 插件
              ss=function(){
                $('.ly_chosenTopic').chosen({
                    disable_search_threshold: 10,
                    width: '95%',
                    search_contains:true,
                  })
                  $(".chosen-search-input").attr('placeholder','输入搜索的内容')
                  $('.ly_chosenTopic').on('change',function(p,e){
                    $scope.tagId=parseInt(e.selected)
                    // $('.ly_chosenTopic')['chosen']='close'
                })
                
              }
            
            $scope.linkType="1"
            $scope.goType='lj'
             startupTopicList()
         
            $scope.ly_test = function(){
                 ss()
                 $scope.goType='jh'
                 console.log($scope.tagId,$scope.picUrl);
                 
             }

            }
          })
        },
            //编辑
        exit_bannerIncrease: function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId) {
            var $ctrl = this;
            $ctrl.animationsEnabled = true
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/exit_banner.html',
                backdrop: 'static',
                windowClass: 'modal-avd',
                controller: function($scope, $uibModalInstance, uploadBanners) {
                $scope.banUrl = url;
                $scope.billboardName = billboardName;
                $scope.time = time;
                $scope.id = id;
                var d= new Date(startTime)
                var dend = new Date(endTime)
                d_m= d.getMonth() + 1>9 ? (d.getMonth() + 1) :( 0+''+(d.getMonth() + 1))
                d_d=  d.getDate()>9 ?  d.getDate() :  0+''+d.getDate()
                dend_m= dend.getMonth() + 1>9 ? (dend.getMonth() + 1) :(0+''+(dend.getMonth() + 1))
                dend_d= dend.getDate()>9 ? dend.getDate() : 0+''+dend.getDate()
                startTime=d.getFullYear() + '-' + d_m + '-' + d_d;
                endTime = dend.getFullYear() + '-' + dend_m + '-' + dend_d;
                $scope.startTime = startTime;
                $scope.endTime = endTime;
                $scope.linkUrl = linkUrl;
                $scope.linkType = linkType+'';
                $scope.tagId = tagId;
                if($scope.linkType=='1' || $scope.linkType=='2'){
                    $scope.goType='lj'
                }else{
                    $scope.goType='jh' 
                }
                
                    service.getQiniuToken(data)
                    .then(function(res) {
                    var qiniuToken = res.data.data.token;
                    if (qiniuToken) {
                        uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
                    }
                    })
                    // 编辑不上传图片时执行此函数，上传图片时执行banners.js里的函数
                $scope.abc =function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId){
                    var date={
                    billboardId:id,
                    time:time,
                    billboardName:billboardName,
                    startTime:startTime,
                    endTime:endTime,
                    linkUrl:linkUrl,
                    linkType:linkType,
                    tagId:tagId
                    }
                if($scope.time && $scope.billboardName){
                    service.startUpdate($.param(date))
                        .then(function(res) {
                        if (res.data.msg == '成功.') {
                        toastr.success('修改成功！');
                        $uibModalInstance.close();
                        startupList();
                        }else {
                                alert("添加失败！");
                            };
                    })
                }else{
                    alert('名称，持续时间')
                    console.log('时间：'+$scope.time +"名字："+ $scope.billboardName +"图片"+ date.picUrl)
                }
                }
                     //   闪屏话题列表
              var  startupTopicList = function(startupTopicList){
                service.startupTopicList().then(function(res){
                    $scope.startupTopicList = res.data.data.list                
                })
            }
            startupTopicList()
            funcStart= function(tim){//将选好的时间携带过来
                $scope.startTime = tim ;
              }
            funcEnd= function(tim){//
                $scope.endTime = tim ;
              }
              $scope.ss=function(){
                  $scope.goType='jh'
                $('.ly_chosenTopic').chosen({
                    disable_search_threshold: 10,
                    width: '95%',
                    search_contains:true,
                  })
                  $(".chosen-search-input").attr('placeholder','输入搜索的内容')
                  $('.ly_chosenTopic').on('change',function(p,e){
                    $scope.tagId=parseInt(e.selected)
                    $('.ly_chosenTopic')['chosen']='close'
                })
              }
                $scope.close_modal = function() {
                    $uibModalInstance.close();
                }
                }
            })
        },
        // 更改状态
        bannerUpd:function(id,state){
            var date={
                billboardId:id,
                state:state
            }
            service.startUpdate($.param(date))
                .then(function(res) {
                    var hint = res.data.msg
                if (hint == '成功.') {
                    toastr.success('成功！');
                    setTimeout('window.location.reload()',100)
                }else {
                        alert(hint);
                        };
            })
          },
        }
        angular.extend($scope, methods);
    }
  })
})
