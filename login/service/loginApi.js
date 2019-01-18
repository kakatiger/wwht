// 角色 http 服务
service.factory("loginApiActions", ["http", function(http) {
    // var ROOT = 'http://192.168.1.33:8083'; //测试
 var ROOT = 'http://wangsocial.com:8084'; //生产

  var methods = {
    list: {
      //登录
      "signIn": function(param) {
        return http.postp(ROOT + "/root/user/login", param);
      },
      //注册
      "register": function(param) {
        return http.get("/login/test.json", param);
      },
      // 忘记密码    
      "forgot": function(param) {
        return http.post("", param)
      }
    }
  };
  return methods;
}]);