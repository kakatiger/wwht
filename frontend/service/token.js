service.factory("token",function () {
  var token = window.localStorage.getItem('token')
    return token;
});