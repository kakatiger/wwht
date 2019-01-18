wwApp.config(function($stateProvider) {
  $stateProvider.state('vestManage', {
    url: '/vestManage',
    name: 'vestManage',
    templateUrl: './frontend/components/vestManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        // console.log(bir)
       var service = apiActions.list;
       var data={
              current:1,
              size:20
          }
         var fictitiousList =function(){
            service.fictitiousList($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.fictitious = res.data.data;
            var fictitiousList = res.data.data.list;
            $scope.fictitiousList = fictitiousList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        fictitiousList();
          //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            fictitiousList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          fictitiousList();
        }
        var methods = {
            cc :function(id){
                  console.log(id)
             var url = './index.html#/vestDynamic/'+id.id;
             console.log(url);
             window.open(url,'_blank');
          }, 
           aa :function(){
                 
             var url = './index.html#/vestWrite/';
             console.log(url);
             window.open(url,'_blank');
          }, 
            bb :function(id,img,name){
              console.log(id,img,name)
            sessionStorage.setItem('name',name)
            
             var url = './index.html#/vestEd/'+id+"?img="+img;
             console.log(url);
             window.open(url,'_blank');
          }, 
            dd :function(id){
             var url = './index.html#/vestImg/'+id.id;
             console.log(url);
             window.open(url,'_blank');
          }, 
           //发布视频
            reVideo: function(id) {
              console.log(id);
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/vest.html',
              backdrop: 'static',
              windowClass: 'modal-avd',
              controller: function($scope, $uibModalInstance, uploadAdv,uploadMusic) {
                      //ficTag
                   var data={
                      
                    }
                   service.ficTag(data)
                    .then(function(res) {
                      console.log(res)
                     $scope.ficTag = res.data.data.list;
                     console.log($scope.ficTag)
                    })
                    service.getQiniuToken(data)
                      .then(function(res) {
                        var qiniuToken = res.data.data.token;
                        console.log(1111111111+'aha')
                        if (qiniuToken) {
                          uploadAdv(qiniuToken, token, $scope,$uibModalInstance)
                          
                        }
                      })
                    service.getQiniuToken(data)
                    .then(function(res) {
                      var qiniuToken = res.data.data.token;
                      if (qiniuToken) {
                        uploadMusic(qiniuToken, token, $scope,$uibModalInstance)
                      }
                    })
                  $scope.vestmove=function(tag,names){
                    var index = document.getElementById('tag').selectedIndex;
                    var b =parseInt(index);
                    var tagName=document.getElementById('tag').options[b].text;
                    var vestVideo =$('#advVideo')[0].src
                    var vestAudio =$('#advAudio')[0].src
                    // console.log(vestVideo,tag,tagName,vestAudio,names);
                    // ficContentAdd
                     // if (vestAudio!='') {
                     //    var vestAudio
                     //  };

                     var date={
                        userId:id,
                        content:names,
                        tagId:tag,
                        tagName:tagName,
                        contentMedias:[
                            {
                                mediaType:2,
                                url:vestVideo
                            }
                           
                          ]
                      }
               $http.post('http://wangsocial.com:8084/admin/fictitious/content/add' , date , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('发布成功！');
                        $uibModalInstance.close();
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });


                          // 
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




