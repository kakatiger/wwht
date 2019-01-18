wwApp.config(function($stateProvider) {
  $stateProvider.state('vestImg', {
    url: '/vestImg/:id',
    templateUrl: './frontend/components/vestManage/vestImg/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$stateParams,uploadMusic,sunImg) {
       console.log($stateParams);
       console.log($scope)
        var service = apiActions.list;
        var userId = $stateParams.id;
        var data={};
        var ficTag = function() {
              service.ficTag(data)
                    .then(function(res) {
                      console.log(res)
                     $scope.ficTag = res.data.data.list;
                    })
             }
          ficTag();
          var ficMusic = function() {
               service.getQiniuToken(data)
                    .then(function(res) {
                      var qiniuToken = res.data.data.token;
                      if (qiniuToken) {
                        uploadMusic(qiniuToken, token, $scope)
                      }
                    })
             }
          ficMusic();
          var ficImg = function() {
               service.getQiniuToken(data)
                    .then(function(res) {
                      var qiniuToken = res.data.data.token;
                      if (qiniuToken) {
                        sunImg($scope,qiniuToken,token,userId)
                      }
                    })
             }
          ficImg(1);
        var methods = {
        
            del:function(){
            window.open("","_self").close()
           }         
        }
        angular.extend($scope, methods);

    }
  })
})
