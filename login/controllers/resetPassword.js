// loginApp.config(function($stateProvider) {
//   var login = {
//     name: 'resetPassword',
//     url: '/resetPassword',
//     templateUrl: '/login/partail/resetPassword.html',
//     controller:function($scope, regex, loginApiActions){
//      var service = loginApiActions.list;
//      console.log(loginApiActions);
//      console.log(regex)
//      var methods = {
//          forgot:function(forgotData){
//              console.log(forgotData)
//              var reg = new RegExp(regex.email)
//              if(reg.test(forgotData)&&forgotData!==undefined){
//                  console.log('yes')
//                  $scope.testEmail = false;
//                     service.signIn(forgotData)
//                  .then(
//                    function(res){
//                      console.log('111111111',res)
//                    },
//                    function(res){
//                      console.log('222222222',res)
//                  }
//              );
//              }else{
//                      $scope.testEmail = true;
//              }
//          }
//      }
//     angular.extend($scope,methods);
//     } 
//   }
//   $stateProvider.state(login);
// });