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
service.factory('authService', function($cookieStore) {
		
})
//=========本地存储数据服务============
    service.factory('locals', ['$window', function ($window) {
        return {        //存储单个属性
            set: function (key, value) {
                $window.localStorage[key] = value;
            },        //读取单个属性
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },        //存储对象，以JSON格式存储
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);//将对象以字符串保存
            },        //读取对象
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');//获取字符串并解析成对象
            }

        }
    }]);
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
// 正则表达式服务
service.factory("regex",function () {
  var validate = {
    passwd: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{10,16}$",
    email: "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$",
    password: "^[0-9A-Za-z]{6,}$"
  };
    return validate;
});
service.factory("sha", function() {
/*   
 *   A   JavaScript   implementation   of   the   Secure   Hash   Algorithm,   SHA-1,   as   defined   
 *   in   FIPS   PUB   180-1   
 *   Version   2.1-BETA   Copyright   Paul   Johnston   2000   -   2002.   
 *   Other   contributors:   Greg   Holt,   Andrew   Kepert,   Ydnar,   Lostinet   
 *   Distributed   under   the   BSD   License   
 *   See   http://pajhome.org.uk/crypt/md5   for   details.   
 */
/*   
 *   Configurable   variables.   You   may   need   to   tweak   these   to   be   compatible   with   
 *   the   server-side,   but   the   defaults   work   in   most   cases.   
 */
var hexcase = 0; /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
var b64pad = ""; /*   base-64   pad   character.   "="   for   strict   RFC   compliance       */
var chrsz = 8; /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */

/*   
 *   These   are   the   functions   you'll   usually   want   to   call   
 *   They   take   string   arguments   and   return   either   hex   or   base-64   encoded   strings   
 */
function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}

function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}

function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}

function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data));
}

function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data));
}

function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data));
}

/*   
 *   Perform   a   simple   self-test   to   see   if   the   VM   is   working   
 */
function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*   
 *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length   
 */
function core_sha1(x, len) {
    /*   append   padding   */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);

}

/*   
 *   Perform   the   appropriate   triplet   combination   function   for   the   current   
 *   iteration   
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

/*   
 *   Determine   the   appropriate   additive   constant   for   the   current   iteration   
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}

/*   
 *   Calculate   the   HMAC-SHA1   of   a   key   and   some   data   
 */
function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}

/*   
 *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally   
 *   to   work   around   bugs   in   some   JS   interpreters.   
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*   
 *   Bitwise   rotate   a   32-bit   number   to   the   left.   
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*   
 *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words   
 *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.   
 */
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   string   
 */
function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   hex   string.   
 */
function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   base-64   string   
 */
function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}
  var sha = function(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
  }
  return sha
});

service.factory("token",function () {
  var token = window.localStorage.getItem('token')
    return token;
});
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