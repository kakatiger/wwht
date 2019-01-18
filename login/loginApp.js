var loginApp = angular.module('loginApp', [
  'ui.router',
  'loginApp.Services',
  // 'ngCookies'
]);

//CORS跨域资源共享，实现跨域请求
loginApp.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

loginApp.config(function($urlRouterProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $urlRouterProvider.otherwise("/");
});

loginApp.config(['$qProvider', function($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

// loginApp.run(function($rootScope) {
//   $rootScope.$on('$viewContentLoaded', function(event, viewConfig) {
//     console.log(event)

//   });
// });