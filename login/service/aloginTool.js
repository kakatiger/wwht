var service;;
(function() {
  //创建一个 angularjs 服务模块
  service = angular.module("loginApp.Services", [])
    //封装所有Http 请求方法
  service.factory("http", function($http,token) {
    var methods = {
      call: function(type, url, params, data,token) {
        return $http({
            method: type,
            url: url,
            params: params,
            data: data,
            headers: {'Authorization':token}
          })
          .then(methods.success, methods.error)
      },
      success: function(data) {
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
      post: function(url, data) {
        return methods.call('POST', url, null, data);
      },
      postp: function(url, params) {
        return methods.call('POST', url, params);
      },
      delete: function(url, data) {
        return methods.call('DELETE', url, data, null);
      }
    }
    return methods;
  });
})();