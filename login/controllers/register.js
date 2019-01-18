// loginApp.config(function($stateProvider) {
//   var register = {
//     name: 'register',
//     url: '/register',
//     templateUrl: '/login/partail/register.html',
//     controller: function ($scope, regex, loginApiActions){
//       var service = loginApiActions.list;
//       $scope.emailRegex = regex.email;
//       $scope.errorMsg = false;
//       var methods = {
//         comfirmPassword: function(data){
//           var password = data.password;
//           var password_confirmation = data.password_confirmation;
//           if (!password_confirmation) {
//             return;
//           }
//           if (password !== password_confirmation) {
//             $scope.errorMsg = true;
//           }else{
//             $scope.errorMsg = false;
//           }
//         },
//         Register: function (registerForm) {
//           if (registerForm.$invalid  || $scope.errorMsg) {
//              console.log("表单不符合规范，不调用接口")
//              } else {
//              console.log("表单符合规范，调用接口")
//             var formData = $scope.data;
//             service.register(formData)
//               .then(
//                 function (res) {
//                   if (res.status === 200) {
//                     console.log('注册成功！')
//                   }  
//                 },
//                 function (res) {
//                 }
//               );
//           }
//         }
//       }
//       angular.extend($scope, methods);
//     }
//   }
//   $stateProvider.state(register);
// });
