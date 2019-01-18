// 正则表达式服务
  service.factory("regex",function () {
  var validate = {
    passwd: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{10,16}$",
    email: "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$",
    password: "^[0-9A-Za-z]{6,}$"
  };
    return validate;
});