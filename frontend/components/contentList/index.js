wwApp.config(function($stateProvider) {
  $stateProvider.state('contentList', {
    url: '/contentList',
    name: 'contentList',
    templateUrl: './frontend/components/contentList/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        
      var service = apiActions.list;
       var ROOT_DIR = baseUrl.api;
       var cc =[];
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
        current:1,
        size:10
      }
      var contList =function(){
          service.contList(data)
          .then(function(res) {
            console.log(res)
            $scope.cont = res.data.data;
            var contList = res.data.data.page.records;
            console.log(contList)
            $scope.contList = contList;
            $scope.pageTotal = res.data.data.page.total;
            $scope.pageCurrent = res.data.data.page.current;
            $scope.pages = res.data.data.page.pages*10 ;
          })
          cc.length = 0;
        }
        contList();


        $scope.startdate = getBeforeDate(8);
        $scope.overdate  = getBeforeDate(1);
              //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            contList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          contList();
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
               infos: function(state,id,userId,content){  
                  console.log(state,id,userId,content)
          var abc={infos:state+','+id+','+userId+','+content,index:id}
          for(var info in cc){
            if (cc[info].index === id) {
              var i = cc.indexOf(cc[info]);
              cc.splice(i,1);
              cc.splice(i,1,abc)
              console.log(cc)
              return;
            };
          }
          cc.push(abc);
          
         },
            comm: function(){
          console.log(cc)
          for (var i = 0; i < cc.length; i++) {
            delete cc[i].index;
          };
          var cont=''
         for (var i = 0; i < cc.length; i++) {
           cc[i]
           // console.log(cc[i].infos)
           if(i ==0){
              cont=cont+cc[i].infos;
            }else{
              cont=cont+'&infos='+cc[i].infos;
            }
         };
        console.log(cont)
         // http.get(ROOT_DIR + "/admin/content/audit/comment;
          $http.get(ROOT_DIR+'/admin/content/audit?infos='+cont , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('提交成功！');
                         // setTimeout('window.location.reload()',1000);
                        contList();
                        cc.length = 0;
                        console.log(cc)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
        
     
         },
              pet :function(){
                var start_date = document.getElementById('start_date_d');
                var over_date = document.getElementById('over_date_d');
                  if (start_date && over_date) {
                    data.startTime = start_date.value+' 00:00:00';
                    data.endTime = over_date.value+' 23:59:59';
                  }
                   contList();     
                  },

        	
        }
        angular.extend($scope, methods);

    }
  })
})
