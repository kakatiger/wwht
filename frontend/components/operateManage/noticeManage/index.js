wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.noticeManage', {
    url: '/noticeManage',
    name: 'noticeManage',
    templateUrl: './frontend/components/operateManage/noticeManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
          var service = apiActions.list;
       var data={
              current:1,
              size:20
          }
         var noticeList =function(){
            service.noticeList($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.notice = res.data.data;
            var noticeList = res.data.data.list;
            $scope.noticeList = noticeList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        noticeList();


    //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            noticeList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          noticeList();
        }
        //deleteAdvertising

        var methods = {
            dele:function(id){
            var data={
                  id:id,
                }
               service.deleteAdvertising($.param(data))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('删除成功！');
                   setTimeout('window.location.reload()',100)
                }else {
                              alert("删除失败!");
                            };
          })
            },
       bannerUpd:function(id,state){
            console.log(id,state)
                 var date={
                  id:id,
                  state:state
                }
               service.noticUpdate($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('成功！');
                   noticeList();
                }else {
                              alert("失败!");
                            };
          })
          },
           aa: function() {
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/nont.html',
            backdrop: 'static',
            windowClass: 'modal-avd',
            controller: function($scope, $uibModalInstance) {
                $scope.abc =function(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont){ 
                console.log(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont)
                 var start_date = document.getElementById('start_date_gou');
                var over_date = document.getElementById('over_date_gou');

                  if (start_date && over_date) {
                    var startTime = start_date.value;
                    var endTime = over_date.value;
                  }
                  // console.log(startTime,endTime)
               var start = startTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')
               var end = endTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')  
                console.log(start,end)
             var date={
                  startTime:start,
                  endTime:end,
                  unit:nontData,
                  intervaltime:notTime,
                  time:noTime,
                  name:nontName,
                  content:nontCont,
                  type:nont,
                  url:nontUrl
                }
               service.saveAdvertising($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('创建成功！');
                  $uibModalInstance.close();
                    noticeList();
                }else {
                              alert("创建失败！");
                            };
          })
              }
              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
          cc: function(id,name,content,unit,time,type,intervaltime,url,startTime,endTime) {
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/nonts.html',
            backdrop: 'static',
            windowClass: 'modal-avd',
            controller: function($scope, $uibModalInstance) {
              // console.log(id,name,content,unit,time,type,intervaltime,url)
                $scope.nontName =name;
                $scope.nontCont =content;
                $scope.unit =unit;
                $scope.types=type;
                $scope.notTime=intervaltime;
                $scope.noTime= time;
                $scope.nontUrl= url;
                $scope.startdate = startTime;
                $scope.overdate  = endTime;
            $scope.abcd =function(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont){
             
                console.log(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont)
                 var start_date = document.getElementById('start_date_gous');
                var over_date = document.getElementById('over_date_gous');

                  if (start_date && over_date) {
                    var startTime = start_date.value;
                    var endTime = over_date.value;
                  }
                  // console.log(startTime,endTime)
            var start = startTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')
            var end = endTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')  
                console.log(start,end)

             var date={
                  id:id,
                  unit:nontData,
                  intervaltime:notTime,
                  time:noTime,
                  name:nontName,
                  content:nontCont,
                  type:nont,
                  url:nontUrl
                }
                date.startTime = start;
                date.endTime = end;
               service.noticUpdate($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('编辑成功！');
                  $uibModalInstance.close();
                   noticeList();
                }else {
                              alert("编辑失败！");
                            };
          })
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
