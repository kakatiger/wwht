wwApp.config(function($stateProvider) {
  $stateProvider.state('checkManage', {
    url: '/checkManage',
    name: 'checkManage',
    templateUrl: './frontend/components/checkManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        
      var service = apiActions.list;
      function getBeforeDate(n){  //初始前七天日期
        var n = n;  
        var d = new Date();  
        var year = d.getFullYear();  
        var mon=d.getMonth()+1;  
        var day=d.getDate();  
        if(day <= n){  
          if(mon>1) {  
             mon=mon-1;  
          } else {  
            year = year-1;  
            mon = 12;  
            }  
        }  
        d.setDate(d.getDate()-n);  
        year = d.getFullYear();  
        mon=d.getMonth()+1;  
        day=d.getDate();
        hours=d.getHours();
        minutes=d.getMinutes();
        second = d.getSeconds();
        s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);  
        return s;
      }
      //contList
      var data = {
        startTime:getBeforeDate(8),
        endTime:getBeforeDate(1),
        type:1,
        current:1,
        size:50
      }
      var assign_list =function(){
          service.assign_list(data)
          .then(function(res) {
            // console.log(res)
            $scope.assign_list = res.data.data.list;

          })
        }
         assign_list();
          var listUserReportForUse =function(){
          service.listUserReportForUse($.param(data))
          .then(function(res) {
            console.log(res)
            // $scope.cont = res.data.data;
            var listUserReportForUse = res.data.data.list;
            $scope.listUserReportForUse = listUserReportForUse;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        listUserReportForUse();
              //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            listUserReportForUse();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          listUserReportForUse();
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
        $scope.startdate = getBeforeDate(8);
        $scope.overdate  = getBeforeDate(1);
        var methods = {
             pot :function(date){
                var start_date = document.getElementById('start_date_gou');
                var over_date = document.getElementById('over_date_gou');

                  if (start_date && over_date) {
                    data.startTime = start_date.value+' 00:00:00';
                    data.endTime = over_date.value+' 23:59:59';
                  }
                  console.log(date)
                     data.type = date.value;  
                     data.userId = date.state;
                     listUserReportForUse();
                  },
       
         

        	
        }
        angular.extend($scope, methods);

    }
  })
})
