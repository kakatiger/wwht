wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage', {
    url: '/operateManage',
    name: 'operateManage',
    templateUrl: './frontend/components/operateManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        
         var service = apiActions.list;
      var navList = locals.getObject("menuList");
      var navParentId; //父级Id
      $.each(navList, function(i,item) {
        if(item.name == '运营管理'){
          navParentId = item.id;
        }
      });
      var sideNave = navList.filter(function (obj) {
        return obj.pid == navParentId;
      });
      $scope.sideNave = sideNave;





        var methods = {
            

        	
        }
        angular.extend($scope, methods);

    }
  })
})
