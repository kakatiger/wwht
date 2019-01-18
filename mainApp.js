var wwApp = angular.module('wwApp', [
  'ui.router', "Services", 'directives', 'ui.bootstrap','angularSpinner','ngSanitize'
]);

wwApp.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

wwApp.config(function($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(false)
  $locationProvider.hashPrefix('');
  $urlRouterProvider.otherwise("/survey");   //登录成功后跳转
});
wwApp.config(['$qProvider', function($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

wwApp.config(function(usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setDefaults({color: '#2dd1ac'});
});

wwApp.run(function($rootScope, $state,baseUrl) {
  $rootScope.$on('$stateChangeStart', function(evt, next, current) {
    var token = window.localStorage.getItem('token');
    if (!token) {
      toastr.error('请先登录！')
        window.location.replace(baseUrl.url + '/login/index.html')
//      window.location.replace('http://wangsocial.com/admin-test/ww2.0/login/index.html#/')
    }
  });
});

wwApp.controller('headCtrl', function($scope,baseUrl) {
    $scope.esc = function(){
        if(confirm('是否退出'))
      window.location.replace(baseUrl.url + '/login/index.html')
//	window.location.replace('http://wangsocial.com/admin-test/ww2.0/login/index.html#/')
    }
    
});

wwApp.controller('navCtrl', function($scope,baseUrl, locals, $location) {
  console.log(baseUrl)
	var menus = locals.getObject("menuList"); //Menu菜单栏
	$scope.realName = locals.get("realName");
	$scope.realCover = locals.get("realCover");
	console.log($scope.realCover)
	$scope.navItems= [];
	$.each(menus, function(w,s) {
		if(s.isNav == '1'){
			$scope.navItems.push(s);
			console.log($scope.navItems);
		}
	});
//		 $scope.navItems = locals.getObject("menuList");
    // .selectedNavItem变量存储当前选择项，默认的选择项是"Home"。  
    $scope.selectedNavItem = 'Home'  
    // 栏目click时触发的方法。  
    $scope.itemClick = function(itemTitle) {
      $scope.selectedNavItem = itemTitle  
    }  
    // 初始化。  
    // 判断当前地址栏路径属于哪个导航栏目。  
    var currentLocation = $location.path()  
//  for (var i = 0, len = $scope.navItems.length; i < len; i++) {  
//    var navItem = $scope.navItems[i]  
//    if (currentLocation == navItem.locationUrl) {  
//      $scope.selectedNavItem = navItem.title  
//    }  
//  }     
});