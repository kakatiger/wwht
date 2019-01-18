var service;;
(function() {
  //创建一个 angularjs 服务模块
  service = angular.module("Services", []);
  // 封装所有Http 请求方法
  service.factory("http", function($http,baseUrl,token) {
    var methods = {
      call: function(type, url, params, data) {
        return $http({
            method: type,
            url: url,
            params: params,
            data: data,//,'Content-type': 'application/json;charset=UTF-8'
            headers: {'Authorization':token}
          })
          .then(methods.success, methods.error)
      },
      success: function(data) {
        if(data.data.code == 399995){
          toastr.error('账号在其他地方登陆！');
          //window.location.replace(baseUrl.url + '/login/index.html#/');
        }
        return data;
      },
      error: function(data) {
        return data;
      },
      get: function(url, params) {
        return methods.call('GET', url, params);
      },
      put: function(url, data) {
        return methods.call('PUT', url, null, data);
      },
      postp: function(url, params) {
        return methods.call('POST', url, params);
      },
      post: function(url, data) {
        return methods.call('POST', url, null, data);
      },
      delete: function(url, data) {
        return methods.call('DELETE', url, data, null);
      },
      
    }
    return methods;
  });
})();