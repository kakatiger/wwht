wwApp.config(function($stateProvider) {
  $stateProvider.state('opinionManage', {
    url: '/opinionManage',
    name: 'opinionManage',
    templateUrl: './frontend/components/sunManage/opinionManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
      var ROOT_DIR = baseUrl.api;
        var data={
           current:1,
           size:20
        }
     
        var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            // console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
         var listUserIdea =function(){
          service.listUserIdea(data)
          .then(function(res) {
            console.log(res)
            $scope.listUserIdea = res.data.data.list;

            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
            var userIdea = res.data.data.list;
       
          })
        }
        listUserIdea();
        var cc =[];
            //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            listUserIdea();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          listUserIdea();
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
         
            infos: function(state,ideaId,userId){  
              // console.log(state,ideaId,userId)
          var abc={infos:state+','+ideaId+','+userId,index:ideaId}
          console.log(abc)
          for(var info in cc){
            if (cc[info].index === ideaId) {
              var i = cc.indexOf(cc[info]);
              console.log(i)
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
          $http.get(ROOT_DIR+'/admin/userIdea/updateIdeaState?infos='+cont , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('提交成功！');
                         listUserIdea();
                        
                        cc.length = 0;
                        // console.log(cc)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
        
     
         }

        }
        angular.extend($scope, methods);

    }
  })
})




