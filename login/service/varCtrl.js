 service.factory("baseUrl",function () {
  var baseUrl = {
   // //测试环境11
    //    url:'http://wangsocial.com/ww3.0',
    //    api:'http://192.168.1.33:8083'
    //生产环境
 url:'http://wangsocial.com/ww3.0',
 api:'http://wangsocial.com:8084'
    } 
    return baseUrl;
});