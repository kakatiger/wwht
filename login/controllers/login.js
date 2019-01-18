loginApp.config(function($stateProvider) {
  $stateProvider.state('login', {
    url: '/',
    name: 'login',
    templateUrl: './partail/login.html',
    controller: function($scope, loginApiActions, token, sha, locals) {
      var service = loginApiActions.list;
      var name = window.localStorage.getItem('account');
      var word = window.localStorage.getItem('pwd');
      var menuList = window.localStorage.getItem('menuList');
      if (name && word) {
        $scope.formData = {};
        $scope.formData.account = name;
        $scope.formData.pwd = word;
      }
      var methods = {
        signInSave: function(formData) {
          //formData.pwd = sha(formData.pwd)
          service.signIn(formData)
            .then(function(res) {
                console.log(res)
                console.log(111111111+'aha')
                for(var i=0; i<res.data.data.menuList.length;i++){
                    console.log(res.data.data.menuList[i])
                }
                if (res.data.msg == '成功.') {
                	locals.set('token', res.data.data.token);//字符串
                                 locals.setObject('menuList', res.data.data.menuList);//对象,后台请求过来的导航栏，包括一级导航和二级导航
     							locals.set('realName', res.data.data.realName);//字符串
                                    locals.set('realCover', res.data.data.cover);//字符串
									locals.set('userId', res.data.data.userId);//字符串
                  alert("登录成功");
                  window.location.href = '../index.html';
                } else{
                  alert("账号密码有误");
                }
          });
        },
      }
      angular.extend($scope, methods);
    }
  })
})
