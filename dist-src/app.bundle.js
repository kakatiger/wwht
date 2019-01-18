var wwApp = angular.module('wwApp', [
  'ui.router', "Services", 'directives', 'ui.bootstrap','angularSpinner','ngSanitize'
]);

wwApp.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

wwApp.config(function($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(false)
  $locationProvider.hashPrefix('');
  $urlRouterProvider.otherwise("/survey");   //登录成功后跳转
});
wwApp.config(['$qProvider', function($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

wwApp.config(function(usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setDefaults({color: '#2dd1ac'});
});

wwApp.run(function($rootScope, $state,baseUrl) {
  $rootScope.$on('$stateChangeStart', function(evt, next, current) {
    var token = window.localStorage.getItem('token');
    if (!token) {
      toastr.error('请先登录！')
        window.location.replace(baseUrl.url + '/login/index.html')
//      window.location.replace('http://wangsocial.com/admin-test/ww2.0/login/index.html#/')
    }
  });
});

wwApp.controller('headCtrl', function($scope,baseUrl) {
    $scope.esc = function(){
        if(confirm('是否退出'))
      window.location.replace(baseUrl.url + '/login/index.html')
//	window.location.replace('http://wangsocial.com/admin-test/ww2.0/login/index.html#/')
    }
    
});

wwApp.controller('navCtrl', function($scope,baseUrl, locals, $location) {
  console.log(baseUrl)
	var menus = locals.getObject("menuList"); //Menu菜单栏
	$scope.realName = locals.get("realName");
	$scope.realCover = locals.get("realCover");
	console.log($scope.realCover)
	$scope.navItems= [];
	$.each(menus, function(w,s) {
		if(s.isNav == '1'){
			$scope.navItems.push(s);
			console.log($scope.navItems);
		}
	});
//		 $scope.navItems = locals.getObject("menuList");
    // .selectedNavItem变量存储当前选择项，默认的选择项是"Home"。  
    $scope.selectedNavItem = 'Home'  
    // 栏目click时触发的方法。  
    $scope.itemClick = function(itemTitle) {
      $scope.selectedNavItem = itemTitle  
    }  
    // 初始化。  
    // 判断当前地址栏路径属于哪个导航栏目。  
    var currentLocation = $location.path()  
//  for (var i = 0, len = $scope.navItems.length; i < len; i++) {  
//    var navItem = $scope.navItems[i]  
//    if (currentLocation == navItem.locationUrl) {  
//      $scope.selectedNavItem = navItem.title  
//    }  
//  }     
});
wwApp.factory("uploadAdv", function(apiActions) {
  var service = apiActions.list;
  var uploadAdv = function(qiniuToken, token, $scope,$uibModalInstance,list) {
    console.log($scope)
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: advimg,
      accept: {
                    title: 'Images',
                    extensions: 'mp4,flv,jpeg,bmp,doc,docx,rar,pdf',
                }
    });

    // uploader.on('fileQueued', function(file) {
    //   console.log(file)
    //   // 创建缩略图
    //   // 如果为非图片文件，可以不用调用此方法。
    //   // thumbnailWidth x thumbnailHeight 为 100 x 100
    //   uploader.makeThumb(file, function(error, src) {
    //     console.log(src)
    //     console.log(error)

    //     // $('#addIcon').css('display','none')
    //     // $('#cover').css('display','block')
    //     // $('#advimg').css('background-image', 'url(' + src + ')');
        
    //   }, 1, 1);
    // });

    uploader.on('uploadSuccess', function(file, response) {
     
      // console.log(response)
      console.log(file)
      var src = 'http://resouce.dongdongwedding.com/' + response.key
      console.log(src)
      $('#advVideo').attr('src',src);
      $('#advVideo').css('display','block')
      $('#cover').css('display','none')
      

    });

    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }


  return uploadAdv;
});

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
service.factory("uploadBanner", function(apiActions) {
  var service = apiActions.list;
  var uploadBanner = function(qiniuToken, token, $scope,list) {
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: bannerimg,
    });

    uploader.on('fileQueued', function(file) {

      // 创建缩略图
      // 如果为非图片文件，可以不用调用此方法。
      // thumbnailWidth x thumbnailHeight 为 100 x 100
      uploader.makeThumb(file, function(error, src) {
        console.log(src)
        console.log(error)
        if (error) {
          $('#advimg').replaceWith('<span>不能预览</span>');
          return;
        }
        $('#addIcon').css('display','none')
        $('#cover').css('display','block')
        $('#bannerimg').css('background-image', 'url(' + src + ')');
      }, 1, 1);
    });

    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
      $('#cover').css('display','none')
      $scope.sat = function(name,sex,cont) {
          //省份
          var index = document.getElementById('sel_Province').selectedIndex;
          var index1 =document.getElementById('sel_City').selectedIndex;
          var b =parseInt(index);
          var c =parseInt(index1);
           var a=document.getElementById('sel_Province').options[b].text;
           var v=document.getElementById('sel_City').options[c].text;
           // console.log(a,v)
           //日期
           var yearIndex =document.getElementById('year').selectedIndex;
           var yearIn =parseInt(yearIndex);
           var year =document.getElementById('year').options[yearIn].text;
           var monthIndex =document.getElementById('month').selectedIndex;
           var monthIn =parseInt(monthIndex);
           var month =document.getElementById('month').options[monthIn].text;
           var dayIndex =document.getElementById('day').selectedIndex;
           var dayIn =parseInt(dayIndex);
           var day =document.getElementById('day').options[dayIn].text;
           var y1= parseInt(year);
           var y2 =parseInt(month);
           var y3 =parseInt(day);
           var birthday =y1+'-'+y2+'-'+y3
        // console.log(name,sex,cont)
      	var data={
                  id:cont,
                  birthday:birthday,
                  nickname:name,
                  sex:sex,
                  province:a,
                  city:v,
                  avatar:'http://resouce.dongdongwedding.com/' + response.key
      	};
      	console.log(data)
        service.fictitiousUpdate($.param(data))
          .then(function(res) {
            console.log(res)
            if (res.data.msg == '成功.') {
              toastr.success('添加成功！');
              $("#btn1").attr({ disabled: "disabled" });
              setTimeout('window.open("","_self").close()',1000)
              $uibModalInstance.close();
            }
          })
      },
    
        $scope.set =function(name,sex){
         
          //省份
          var index = document.getElementById('sel_Province').selectedIndex;
          var index1 =document.getElementById('sel_City').selectedIndex;
          var b =parseInt(index);
          var c =parseInt(index1);
           var a=document.getElementById('sel_Province').options[b].text;
           var v=document.getElementById('sel_City').options[c].text;
           // console.log(a,v)
           //日期
           var yearIndex =document.getElementById('year').selectedIndex;
           var yearIn =parseInt(yearIndex);
           var year =document.getElementById('year').options[yearIn].text;
           var monthIndex =document.getElementById('month').selectedIndex;
           var monthIn =parseInt(monthIndex);
           var month =document.getElementById('month').options[monthIn].text;
           var dayIndex =document.getElementById('day').selectedIndex;
           var dayIn =parseInt(dayIndex);
           var day =document.getElementById('day').options[dayIn].text;
           var y1= parseInt(year);
           var y2 =parseInt(month);
           var y3 =parseInt(day);
           var birthday =y1+'-'+y2+'-'+y3
           console.log(birthday,a,v,name,sex)
           
                var date={
                  birthday:birthday,
                  nickname:name,
                  sex:sex,
                  province:a,
                  city:v,
                  avatar:'http://resouce.dongdongwedding.com/' + response.key
                }
               service.fictitiousAdd($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('添加成功！');
                  $("#btn1").attr({ disabled: "disabled" });
                  setTimeout('window.open("","_self").close()',1000)
                  $uibModalInstance.close();
                }
          })
              }
             $scope.del = function(){
              console.log(11)
                window.open("","_self").close()
             }
    });

    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadBanner;
});

// 上传图片
service.factory("uploadBanners", function(apiActions) {
  var service = apiActions.list;
  var uploadBanners = function(qiniuToken, token, $scope,$uibModalInstance,list,id) {
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: bannerimg,
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
    });

    uploader.on('fileQueued', function(file) {

      // 创建缩略图
      // 如果为非图片文件，可以不用调用此方法。
      // thumbnailWidth x thumbnailHeight 为 100 x 100
      uploader.makeThumb(file, function(error, src) {
        console.log(src)
        console.log(error)
        if (error) {
          $('#advimg').replaceWith('<span>不能预览</span>');
          return;
        }
        $('#addIcon').css('display','none')
        $('#cover').css('display','block')
        $('#bannerimg').css('background-image', 'url(' + src + ')');
      }, 1, 1);
    });
    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
      $('#cover').css('display','none')
      $scope.bannerIncrease = function(val,time,startTime,endTime,linkUrl,linkType,tagId) {
        
        console.log(val,time)
      	var data={
          billboardName:val,
          time:time,
          startTime:startTime,
          endTime:endTime,
          linkUrl:linkUrl,
          linkType:linkType,
          tagId:tagId,
          state:2,
      		picUrl:'http://resouce.dongdongwedding.com/' + response.key,
          };
          if($scope.goType=='jh'){
              data.linkType='3'
          }else{
              data.tagId=undefined
          }
          if(data.time && data.billboardName && data.picUrl){
               service.startUpdate($.param(data))
                  .then(function(res) {
                if (res.data.msg == '成功.') {
                  toastr.success('添加成功！');
                  $uibModalInstance.close();
                   setTimeout('window.location.reload()',2000)
                }else  {
                              alert("添加失败");
                            };
          })
        }else{
            alert('名称，持续时间，图片为必填内容')
        }
      },
 
    $scope.abc =function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId){
            var date={
                billboardId:id,
                billboardName:billboardName,
                time:time,
                startTime:startTime,
                endTime:endTime,
                linkUrl:linkUrl,
                linkType:linkType,
                tagId:tagId,
                picUrl:'http://resouce.dongdongwedding.com/' + response.key,
            }
            if($scope.goType=='jh'){
                data.linkType='3'
            }else{
                date.tagId=undefined
            }
            console.log(date)
            if($scope.time && $scope.billboardName){
                service.startUpdate($.param(date))
                    .then(function(res) {
                    if (res.data.msg == '成功.') {
                    toastr.success('修改成功！');
                    $uibModalInstance.close();
                    setTimeout('window.location.reload()',1000)
                    
                    }else{
                            alert("修改失败");
                        };
                    })
            }else{
                alert('名称，持续时间为必填内容')
                }
        }
    });
    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadBanners;
});

service.factory('egArray', function() {
  var egArray = [{
      name: 'A',
      selected: true
    }, {
      name: 'B',
      selected: false
    }, {
      name: 'C',
      selected: false
    }, {
      name: 'D',
      selected: false
    }, {
      name: 'E',
      selected: false
    }, {
      name: 'F',
      selected: false
    }, {
      name: 'G',
      selected: false
    },
    {
      name: 'H',
      selected: false
    }, {
      name: 'J',
      selected: false
    }, {
      name: 'K',
      selected: false
    }, {
      name: 'L',
      selected: false
    }, {
      name: 'M',
      selected: false
    }, {
      name: 'N',
      selected: false
    }, {
      name: 'O',
      selected: false
    }, {
      name: 'P',
      selected: false
    }, {
      name: 'Q',
      selected: false
    }, {
      name: 'R',
      selected: false
    }, {
      name: 'S',
      selected: false
    }, {
      name: 'T',
      selected: false
    }, {
      name: 'W',
      selected: false
    }, {
      name: 'X',
      selected: false
    }, {
      name: 'Y',
      selected: false
    }, {
      name: 'Z',
      selected: false
    },
  ];
  return egArray;

})

wwApp.factory('today',function(){})
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
service.factory("apiActions", ["http","baseUrl", function(http,baseUrl) {
  var ROOT_DIR = baseUrl.api;
  console.log(ROOT_DIR)
  
//http://wangsocial.com:8080/common/upToken
  var methods = {
    list: {
    	//获取七牛token
      "getQiniuToken": function(param) {
        return http.get(ROOT_DIR + "/common/upToken", param)
      },
    	//用户列表
    	"assignList": function(param) {
        return http.get(ROOT_DIR + "/admin/root/user/assign/list", param)
      },
    	//新增用户
    	"createUser": function(param) {
        return http.post(ROOT_DIR + "/admin/root/user/assign/create_user", param)
      },
      //用户禁用启用
    	"optUser": function(param) {
        return http.post(ROOT_DIR + "/admin/root/user/assign/opt_user", param)
      },
      //角色列表
      "roleList": function(param) {
        return http.post(ROOT_DIR + "/admin/root/role/list", param)
      },
      //新增角色
      "roleAdd": function(param) {
        return http.post(ROOT_DIR + "/admin/root/role/add", param)
      },
      //权限菜单列表
      "assignMenuList": function(param) {
        return http.get(ROOT_DIR + "/admin/root/user/assign/menu_list", param)
      },
      //修改角色权限
      "updateMenu": function(param) {
        return http.post(ROOT_DIR + "/admin/root/role/update_menu", param)
      },
      //日志列表
      "logList": function(param) {
        return http.get(ROOT_DIR + "/admin/root/user/log/list", param)
      },
      //基础数据统计模块
      //注册用户数、注册转化率、活跃用户数、行为活跃率、行为用户数
        "activeAll": function(param) {
        return http.post(ROOT_DIR + "/admin/count/active/all", param)
      },
      // 数据注册用户数、注册转化率、活跃用户数、行为活跃率、行为用户数
         "registerData": function(param) {
        return http.post(ROOT_DIR + "/admin/count/new/register", param)
      },
      //留存率
         "Retention": function(param) {
        return http.post(ROOT_DIR + "/admin/count/stay", param)
      },
      //渠道数据 -渠道周期下载数据
          "downloadInstall": function(param) {
        return http.post(ROOT_DIR + "/admin/count/install", param)
      },
      //渠道数据 -渠道下拉列表
          "countChannel": function(param) {
        return http.post(ROOT_DIR + "/admin/count/channel", param)
      },
       //渠道数据 -渠道周期下载数据
          "countInstall": function(param) {
        return http.post(ROOT_DIR + "/admin/count/install/type", param)
      },
       //业务数据统计 -总下载量、总注册量、日均停留时长、用户日均启动次数、性别占比
          "businessAll": function(param) {
        return http.post(ROOT_DIR + "/admin/count/business/all", param)
      },
       //业务数据统计 -标签运营数据 -数据名称趋势 、发布内容统计、评论总数统计、活跃度统计
          "businessTrend": function(param) {
        return http.post(ROOT_DIR + "/admin/count/tag/trend", param)
      },
        //标签运营数据 -内容类型占比
          "businessType": function(param) {
        return http.post(ROOT_DIR + "/admin/count/tag/type", param)
      },
        //区域分布
          "distribution": function(param) {
        return http.post(ROOT_DIR + "/admin/count/distribution", param)
      },
        //话题管理-列表查询
          "topicList": function(param) {
        return http.post(ROOT_DIR + "/admin/tag/list", param)
      },
       //话题管理-新增
          "topicAdd": function(param) {
        return http.post(ROOT_DIR + "/admin/tag/add", param)
      },
       //话题管理-修改
          "topicUpdate": function(param) {
        return http.post(ROOT_DIR + "/admin/tag/update", param)
      },
       //话题管理-设置初始值
          "topicRecommend": function(param) {
        return http.post(ROOT_DIR + "/admin/tag/update/recommend", param)
      },
       //话题管理-获取基数
          "topRecommend": function(param) {
        return http.post(ROOT_DIR + "/admin/tag/get/recommend", param)
      },
        //公告管理-公告列表
          "noticeList": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/list", param)
      },
        //公告管理-公告列表-创建
          "saveAdvertising": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/saveAdvertising", param)
      },
        //公告管理-公告列表-修改
          "noticUpdate": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/update", param)
      },
       //公告管理-公告列表-删除
          "deleteAdvertising": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/deleteAdvertising", param)
      },
       //运营管理-启动管理 现在改成闪屏管理了
          "startupList": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/startup/list", param)
      },
      //运营管理-闪屏管理 话题列表
        "startupTopicList":function(){
            return http.get(ROOT_DIR + "/admin/count/tag")
        },

       //运营管理-新增启动管理  现在改成闪屏管理了
          "startUpdate": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/startup/update", param)
      },
      //运营管理，启动页，启动页列表
      "startManagerList": function(param) {
        return http.post(ROOT_DIR + "/admin/advertising/start/list", param)
      },
       //马甲管理-马甲列表
          "fictitiousList": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/list", param)
      },
      //马甲管理-创建列表
          "fictitiousAdd": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/add", param)
      },
      //马甲管理-修改
          "fictitiousUpdate": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/update", param)
      },
       //马甲管理-马甲动态列表
          "fictitiousContentList": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/content/list", param)
      },
        //马甲管理-马甲动态删除、设为开放/设为隐私
          "ficUpdate": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/content/update", param)
      },
        //马甲管理-评论回复-评论列表
          "ficComment": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/comment/list", param)
      },
       //马甲管理-评论回复
          "ficCommentAdd": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/comment/add", param)
      },
       //马甲管理-标签内容
          "ficTag": function(param) {
        return http.post(ROOT_DIR + "/admin/count/tag", param)
      },
        //马甲管理-发布视频
          "ficContentAdd": function(param) {
        return http.post(ROOT_DIR + "/admin/fictitious/content/add", param)
      },
         //内容审核-未审核
          "sunPending": function(param) {
        return http.post(ROOT_DIR + "/admin/content/pending", param)
      },
        //内容审核-已审核
          "sunTreated": function(param) {
        return http.post(ROOT_DIR + "/admin/content/treated", param)
      },
      //内容审核-屏蔽内容各类型统计
          "sunCount": function(param) {
        return http.post(ROOT_DIR + "/admin/content/type/count", param)
      },
       //内容审核-屏蔽评论各类型统计
          "sunComment": function(param) {
        return http.post(ROOT_DIR + "/admin/content/comment", param)
      },
      // 内容审核列表
          "sunConList": function(param) {
        return http.post(ROOT_DIR + "/admin/content/audit/info", param)
      },
      //提交审核
         "audit": function(param) {
        return http.post(ROOT_DIR + "/admin/content/audit/content", param)
      },
      //评论审核/
         "commentExamine": function(param) {
        return http.post(ROOT_DIR + "/admin/content/comment/list", param)
      },
      //评论审核审核-审核提交
         "commentExamineAudit": function(param) {
        return http.get(ROOT_DIR + "/admin/content/audit/comment", param)
      },
      //头像审核列表
         "commentAvatar": function(param) {
        return http.get(ROOT_DIR + "/admin/user/avatar", param)
      },
      //头像提交
         "commentAudit": function(param) {
        return http.get(ROOT_DIR + "/admin/user/avatar/audit", param)
      },
      //用户详情
         "commentUser": function(param) {
        return http.get(ROOT_DIR + "/admin/content/user", param)
      },
       //用户详情-封禁
         "commentUserAudit": function(param) {
        return http.get(ROOT_DIR + "/admin/content/user/audit", param)
      },
       //意见详情-列表
         "listUserIdea": function(param) {
        return http.get(ROOT_DIR + "/admin/userIdea/listUserIdea", param)
      },
       //内容列表
         "contList": function(param) {
        return http.get(ROOT_DIR + "/admin/content/list", param)
      },
     //意见收集
        "collect": function(param) {
        return http.get(ROOT_DIR + "/admin/userIdea/listGetByIdeaState", param)
      },
      //意见删除
         "collect_del": function(param) {
        return http.get(ROOT_DIR + "/admin/userIdea/deleteIdea", param)
      },
        //核查管理-操作人
         "assign_list": function(param) {
        return http.get(ROOT_DIR + "/admin/root/user/assign/list", param)
      },
       //核查管理-列表
         "listUserReportForUse": function(param) {
        return http.post(ROOT_DIR + "/admin/content/listUserReportForUser", param)
      },
    }
  };
  return methods;
}]);

service.factory("uploadMusic", function(apiActions) {
  var service = apiActions.list;
  var uploadMusic = function(qiniuToken, token, $scope,$uibModalInstance) {
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: addMusic,
    });

    uploader.on('uploadProgress', function(file, percentage) {
    });

    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
    var src = 'http://resouce.dongdongwedding.com/' + response.key
    console.log(src)
       $('#advAudio').attr('src',src);
       $('#advAudio').css('display','block')
    });
    //#advAudio
 


    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadMusic;
});

// 正则表达式服务
  service.factory("regex",function () {
  var validate = {
    passwd: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{10,16}$",
    email: "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$",
    password: "^[0-9A-Za-z]{6,}$"
  };
    return validate;
});
service.factory("uploadStr", function(apiActions) {
  var service = apiActions.list;
  var uploadStr = function(qiniuToken, token, $scope,list) {
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: bannerimg,
    });

    uploader.on('fileQueued', function(file) {

      // 创建缩略图
      // 如果为非图片文件，可以不用调用此方法。
      // thumbnailWidth x thumbnailHeight 为 100 x 100
      uploader.makeThumb(file, function(error, src) {
        console.log(src)
        console.log(error)
        if (error) {
          $('#advimg').replaceWith('<span>不能预览</span>');
          return;
        }
        $('#addIcon').css('display','none')
        $('#cover').css('display','block')
        $('#abc').css('background-image', 'url(' + src + ')');
      }, 1, 1);
    });

    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
      
   
    
        // $scope.set =function(name,sex){
         
        //         var date={
        //           birthday:birthday,
        //           nickname:name,
        //           sex:sex,
        //           province:a,
        //           city:v,
        //           avatar:'http://resouce.dongdongwedding.com/' + response.key
        //         }
        //        service.fictitiousAdd($.param(date))
        //           .then(function(res) {
        //         console.log(res)
        //         if (res.data.msg == '成功.') {
        //           toastr.success('添加成功！');
        //           $("#btn1").attr({ disabled: "disabled" });
        //           setTimeout('window.open("","_self").close()',1000)
        //           $uibModalInstance.close();
        //         }
        //   })
        //       }
             // $scope.del = function(){
             //  console.log(11)
             //    window.open("","_self").close()
             // }
    });

    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadStr;
});

service.factory("sunImg", function($http) {
  var sunImg = function($scope,qiniuToken,token,userId) {

    console.log(userId)
    var id = userId;
    var urlArr = [];
    // console.log($http)
    
    // console.log(b)
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: pickfiles,
    });
    uploader.on('filesQueued', function(file) {
        // console.log(file)
       
    });

    uploader.on('uploadSuccess', function(file, response) {

      // console.log(file)

      var fileId =file.id;
      // console.log(fileId)
      var url = 'http://resouce.dongdongwedding.com/' + response.key
      console.log(urlArr);
     //  console.log(22 + url);
     // if (-1 === urlArr.indexOf(url) || urlArr.length == 0) {
     //    urlArr.push(url);
     // }else{
     //      return;
     // };
      urlArr.push(url);
      
      var num =1;
      var arr = [];
      for (var i=0; i<urlArr.length; i++) {
        var obj = {
                      "mediaType":3,
                      // "picOrder":num++,
                      "url": urlArr[i]
                      // "url":b
                  }

        arr.push(obj);
      }
     
      // console.log(arr)
      var finImg = arr;
      $('#sun_img').empty();
    finImg.forEach(function(e){  
        var cImg = e.url
        // console.log(cImg)
        var str =` <div class='sunUrl'><img  src="  ${cImg}  "><span class="glyphicon glyphicon-remove f28" style=" color: rgb(255, 0, 0); " > </span></div>`  
        $('#sun_img').append(str);
    }) 
     
        $(".glyphicon").click(function () {
            $(this).parent().remove();
            var i = $(this).parent().index()
              console.log(i)
            urlArr.splice(i,1);
             arr.splice(i,1);
          
           if (arr.length < 9) {
            $('#pickfiles').show();
            };


          });

      if (arr.length == 9) {
      alert("只能上传9张图片");

     }
         $scope.hair =function(tag,names){  
              if (arr.length > 9) {
              alert("只能上传9张图片");

               }else{
                    console.log(tag,names)
                    var index = document.getElementById('tag').selectedIndex;
                    var b =parseInt(index);
                    var tagName=document.getElementById('tag').options[b].text;
                    var vestAudio =$('#advAudio')[0].src
                  var cont ={
                      "mediaType":1,
                      "url": vestAudio
                  }
                  if (vestAudio!='') {
                     arr.push(cont);
                  };
                 
                var date={
                          userId:id,
                          content:names,
                          tagId:tag,
                          tagName:tagName,
                          contentMedias:arr
                        }
               $http.post('http://wangsocial.com:8084/admin/fictitious/content/add' , date , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('发布成功！');
                       setTimeout('window.open("","_self").close()',1000)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
               }
                
            }       

    });
    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")

    });
  }
  return sunImg;
});

service.factory("token",function () {
  var token = window.localStorage.getItem('token')
    return token;
});
  service.factory("baseUrl",function () {
  var baseUrl = {

    //测试环境
       // url:'http://wangsocial.com/admin-test/ww3.0/',
       // api:'http://192.168.1.150:8083'
    // 测试环境2019.01.15
    //    url:'http://wangsocial.com/ww3.0',
    //    api:'http://192.168.1.33:8083'
    // //生产环境
    url:'http://wangsocial.com/ww3.0',
    api:'http://wangsocial.com:8084'
    } 
    return baseUrl;
});
var appDirectives = angular.module('directives', [])
  .directive('uploadImg', function() {
    return {
      restrict: 'A',
      link: function($scope) {

        function savepic() {
          console.log('11111111')

          if (document.all.a1 == null) {
            objIframe = document.createElement("IFRAME");
            document.body.insertBefore(objIframe);
            objIframe.outerHTML = "<iframe name=a1 style='width:400px;hieght:300px' src=" + imageName.href + "></iframe>";
            re = setTimeout("savepic()", 1)
          } else {
            clearTimeout(re)
            pic = window.open(imageName.href, "a1")
            pic.document.execCommand("SaveAs")
            document.all.a1.removeNode(true)
          }
        }

      }
    }
  })
  

  // 地图
  .directive('vBar', function() {
    return {
      restrict: 'AE',
      template: '\
                <div class="p20 w780 h500 bcf mb20" >\
                    <div id="vBar" class="w720 h440"></div>\
                  </div>\
               </div>\
               ',
      controller: function($scope, apiActions, token) {
        

                  var chart = echarts.init(document.getElementById('vBar'));
                          chart.setOption({
                                        series: [{
                                            type: 'map',
                                            map: 'china'
                                        }]
                                });

                  var data = [
                                
                            ];

                    var geoCoordMap = {
                       
                    };

              function convertData(data) {
                 var res = [];
                 for (var i = 0; i < data.length; i++) {
                     var geoCoord = geoCoordMap[data[i].name];
                     if (geoCoord) {
                         res.push({
                             name: data[i].name,
                             value: geoCoord.concat(data[i].value)
                         });
                     }
                 }
                 return res;
              };

              function randomValue() {
                  return Math.round(Math.random()*1000);
              }

                  option = {
                          tooltip: {},
                          visualMap: {
                              min: 0,
                              max: 1500,
                              left: 'right',
                              top: 'bottom',
                              text: ['High','Low'],
                              seriesIndex: [1],
                              inRange: {
                                  color: ['#e0ffff', '#006edd']
                              },
                              calculable : false
                          },
                          geo: {
                              map: 'china',
                              roam: false,
                              label: {
                                  normal: {
                                      show: true,
                                      textStyle: {
                                          color: 'rgba(0,0,0,0.4)'
                                      }
                                  }
                              },
                              itemStyle: {
                                  normal:{
                                      borderColor: 'rgba(0, 0, 0, 0.2)'
                                  },
                                  emphasis:{
                                      areaColor: null,
                                      shadowOffsetX: 0,
                                      shadowOffsetY: 0,
                                      shadowBlur: 20,
                                      borderWidth: 0,
                                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                                  }
                              }
                          },
                          series : [
                             {
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                 data: convertData(data),
                                symbolSize: 0,
                                 symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                                symbolRotate: 35,
                                 label: {
                                     normal: {
                                         formatter: '{b}',
                                         position: 'right',
                                         show: false
                                     },
                                     emphasis: {
                                         show: false
                                     }
                                 },
                                 itemStyle: {
                                     normal: {
                                          color: '#F06C00'
                                     }
                                 }
                              },
                              {
                                  name: 'categoryA',
                                  type: 'map',
                                  geoIndex: 0,
                                   tooltip: {show: false},
                                  data:[
                                        
                                      
                                        
                                  ]
                              }
                          ]

    };
        chart.setOption(option);
        var service = apiActions.list;
        var data = {
        // Authorization: token
      }
        service.distriBution($.param(data))
        .then(function(res){
          var distriBution = res.data.data.list;
          var orName ='';
          var arr = [];
         for (var i = 0; i < distriBution.length; i++) {
           distriBution[i]
           var useNum = distriBution[i].useNum;
           var areaName = distriBution[i].areaName;
           if (areaName.indexOf('省')>=0) {

            var areaName = areaName.substring(0,areaName.length-1)
           };
            orName+=areaName
            var obj = {name: areaName, value: useNum}
            arr.push(obj);
         };
              chart.setOption({
                      series : [
                             {
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                 data: convertData(data),
                                symbolSize: 0,
                                 symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                                symbolRotate: 35,
                                 label: {
                                     normal: {
                                         formatter: '{b}',
                                         position: 'right',
                                         show: false
                                     },
                                     emphasis: {
                                         show: false
                                     }
                                 },
                                 itemStyle: {
                                     normal: {
                                          color: '#F06C00'
                                     }
                                 }
                              },
                              {
                                  name: 'categoryA',
                                  type: 'map',
                                  geoIndex: 0,
                                   tooltip: {show: false},
                                  data:arr
                              }
                          ]
               })
        })
      },
    }
  })
 .directive('aBar', function() {
    return {
      restrict: 'AE',
      template: '\
                <div class="p20 w676 h500 bcf mb20" >\
                    <div id="aBar" class="w720 h440"></div>\
                  </div>\
               </div>\
               ',
      controller: function($scope, apiActions, token) {

          var length=1;//此处为动态数据的长度
          var hei=(length*1)+'px';//动态获取图表高度
          $("#main").css('height',hei);//动态设置图表高度
          showchart();   //图表执行
        function showchart(){
        var myChart = echarts.init(document.getElementById('aBar'));
        option = {
             title : {
             text: '',
             subtext: ''
        },
        tooltip : {
            trigger: 'item'  //悬浮提示框不显示
        },
        grid:{   //绘图区调整
            x:150,  //左留白
            y:10,   //上留白
            x2:10,  //右留白
            y2:10   //下留白
        },
        xAxis : [
            {
                show:false,
                type : 'value',
                boundaryGap : [0, 0],
                position: 'top'
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : [],
                axisLine:{show:false},     //坐标轴
                axisTick:[{    //坐标轴小标记
                    show:false
                }],
                axisLabel:{
                    textStyle:{
                        fontSize:'10'
                    }
                }
            }
        ],
        series : [
            {
                name:'',
                type:'bar',
                tooltip:{show:false},
                barMinHeight:30,  //最小柱高
                barWidth: 10,  //柱宽度
                barMaxWidth:100,   //最大柱宽度
                data:[],
                itemStyle:{
                    normal:{    //柱状图颜色
                        color:'#387fdb',
                        label:{
                            show: true,   //显示文本
                            position: 'inside',  //数据值位置
                            textStyle:{
                                color:'#000',
                                fontSize:'10'
                            }
                        }
                    }
                }
            }
        ]
    };


    myChart.setOption(option);
       var service = apiActions.list;
        var data = {
        // Authorization: token
      }
        service.distriBution($.param(data))
        .then(function(res){
          var distriBution = res.data.data.list;
          var orName =[];
          var orNum =[];

         for (var i = 0; i < distriBution.length; i++) {
           distriBution[i]
           var useNum = distriBution[i].useNum;
           var areaName = distriBution[i].areaName;
           orName+=areaName+','
           orNum+=useNum+','
        var strs= new Array(); //定义一数组  
        strs=orNum.split(','); //字符分割  
        var strb= new Array(); //定义一数组  
        strb=orName.split(','); //字符分割  
         };
              myChart.setOption({
                          yAxis : [
                      {
                          type : 'category',
                          data : strb,
                          axisLine:{show:false},     //坐标轴
                          axisTick:[{    //坐标轴小标记
                              show:false
                          }],
                          axisLabel:{
                              textStyle:{
                                  fontSize:'10'
                              }
                          }
                      }
                  ],
                         series : [
                      {
                          name:'',
                          type:'bar',
                          tooltip:{show:false},
                          barMinHeight:30,  //最小柱高
                          barWidth: 10,  //柱宽度
                          barMaxWidth:100,   //最大柱宽度
                          data:strs,
                          itemStyle:{
                              normal:{    //柱状图颜色
                                  color:'#387fdb',
                                  label:{
                                      show: true,   //显示文本
                                      position: 'inside',  //数据值位置
                                      textStyle:{
                                          color:'#000',
                                          fontSize:'10'
                                      }
                                  }
                              }
                          }
                      }
                  ]
               })
        })

   

}
  
   
      },
    }
  })
// 折线图
  .directive('cBar', function() {
    return {
      restrict: 'AE',
      template: '\
                <div class="p20 w920 h620 bcf mb20" >\
                    <div id="vBar" class="w900 h600"></div>\
                  </div>\
               </div>\
               ',
      controller: function($scope, apiActions, token) {
        
                var chart = echarts.init(document.getElementById('cBar'));
                 option = {
                              xAxis: {
                                  type: 'category',
                                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                              },
                              yAxis: {
                                  type: 'value'
                              },
                              series: [{
                                  data: [820, 932, 901, 934, 1290, 1330, 1320],
                                  type: 'line'
                              }]
                          };
      
                          
        chart.setOption(option);
      },
     
    }
                 
  })
appDirectives.directive('controlaudio', function() {
  return {
    restrict: 'AE',
    link: function($scope, element, attrs) {
      $('.pause-img').hide()
      $scope.to_play = function(e) {
        var audio_ = $(e.target).parent().nextAll('audio')[0];
        console.log($(e.target).parent().nextAll('audio'))
        var endTimeNode = $(e.target).parents('.audio-group').find('.end-time')
        var startTimeNode = $(e.target).parents('.audio-group').find('.start-time')
        var endTime = audio_.duration / 60;
        endTime = endTime.toFixed(2)
        endTimeNode.html(endTime)
        
        var progressBar = $(e.target).parents('.audio-group').find('.music-bar-progress')
        setInterval(function(){
          var startTime = audio_.currentTime / 60;
          progressBar.css('width',(startTime / endTime) * 100 + '%')
          startTime = startTime.toFixed(2)
          startTimeNode.html(startTime)
        },1000)

        $(e.target).hide();
        $(e.target).next('img').show();
        audio_.play();
      }
      $scope.to_pause = function(e){
        var audio_ = $(e.target).parent().nextAll('audio')[0];
        $(e.target).hide();
        $(e.target).prev('img').show();
        audio_.pause();
      }
    }
  }
})
.filter('stringToArray',function(){
  return function(data){
    if(data){
      return s_data = data.split(',')
    }
  }
})
.filter('to_trusted', ['$sce', function ($sce) {
　　return function (text) {
    　　return $sce.trustAsResourceUrl(text);
　　};
}]);

      //play
      var to_play = function(e) {
        var audio_ = $(e.target).parent().find('audio')[0];
        audio_.play();
      }
      //stop
      var to_pause = function(e){
        var audio_ = $(e.target).parent().find('audio')[0];
        audio_.pause();
      }

  // 饼形图
  appDirectives.directive("chartpie", function() {
    return {
      restrict: 'AE',
      scope:{
        headType:'@',
        type:'@',
        className:'@',
        idName:'@'
      },
      template:"<div id='{{idName}}' class='{{className}}'></div>",
    //  templateUrl: './frontend/components/versions/indexTmp.html',
      controller: function($scope, $element, $attrs, $transclude) {
         $scope.pieChart = function(result_data,options) {
          var myChart = echarts.init(document.getElementById('cakesex'));
          option = {
            tooltip: {
              trigger: 'item',
              formatter: "{b} : {c}"
            },
            series: [{
              name: '男',
              type: 'pie',
              radius: '60%',
              center: ['45%', '50%'],
              data: result_data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          };
          console.log(result_data)
          myChart.setOption(option);
        }
    		$scope.$emit('chart-pie', $scope.pieChart);
         
        
        
      }
    }
  })


wwApp.config(function($stateProvider) {
  $stateProvider.state('banManage', {
    url: '/banManage',
    name: 'banManage',
    templateUrl: './frontend/components/banManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) { 
      var service = apiActions.list;
      //contList
      var data = {
        current:1,
        size:10
      }
      var collect =function(){
          service.collect(data)
          .then(function(res) {
            console.log(res)
            $scope.collect = res.data.data.list;

            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
           
          })
        }
        collect();
              //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            collect();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          collect();
        }
                   //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        var methods = {
          
             pet:function(id){

               var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/del.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                 var date ={
                 ideaId:id
                }
                $scope.sunSeal=function(){
                        service.collect_del(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('删除成功！')
                             }
                               collect();
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
         }
         

        	
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('checkManage', {
    url: '/checkManage',
    name: 'checkManage',
    templateUrl: './frontend/components/checkManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        
      var service = apiActions.list;
      function getBeforeDate(n){  //初始前七天日期
        var n = n;  
        var d = new Date();  
        var year = d.getFullYear();  
        var mon=d.getMonth()+1;  
        var day=d.getDate();  
        if(day <= n){  
          if(mon>1) {  
             mon=mon-1;  
          } else {  
            year = year-1;  
            mon = 12;  
            }  
        }  
        d.setDate(d.getDate()-n);  
        year = d.getFullYear();  
        mon=d.getMonth()+1;  
        day=d.getDate();
        hours=d.getHours();
        minutes=d.getMinutes();
        second = d.getSeconds();
        s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);  
        return s;
      }
      //contList
      var data = {
        startTime:getBeforeDate(8),
        endTime:getBeforeDate(1),
        type:1,
        current:1,
        size:50
      }
      var assign_list =function(){
          service.assign_list(data)
          .then(function(res) {
            // console.log(res)
            $scope.assign_list = res.data.data.list;

          })
        }
         assign_list();
          var listUserReportForUse =function(){
          service.listUserReportForUse($.param(data))
          .then(function(res) {
            console.log(res)
            // $scope.cont = res.data.data;
            var listUserReportForUse = res.data.data.list;
            $scope.listUserReportForUse = listUserReportForUse;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        listUserReportForUse();
              //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            listUserReportForUse();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          listUserReportForUse();
        }
                   //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        $scope.startdate = getBeforeDate(8);
        $scope.overdate  = getBeforeDate(1);
        var methods = {
             pot :function(date){
                var start_date = document.getElementById('start_date_gou');
                var over_date = document.getElementById('over_date_gou');

                  if (start_date && over_date) {
                    data.startTime = start_date.value+' 00:00:00';
                    data.endTime = over_date.value+' 23:59:59';
                  }
                  console.log(date)
                     data.type = date.value;  
                     data.userId = date.state;
                     listUserReportForUse();
                  },
       
         

        	
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('contentList', {
    url: '/contentList',
    name: 'contentList',
    templateUrl: './frontend/components/contentList/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        
      var service = apiActions.list;
       var ROOT_DIR = baseUrl.api;
       var cc =[];
      function getBeforeDate(n){  //初始前七天日期
        var n = n;  
        var d = new Date();  
        var year = d.getFullYear();  
        var mon=d.getMonth()+1;  
        var day=d.getDate();  
        if(day <= n){  
          if(mon>1) {  
             mon=mon-1;  
          } else {  
            year = year-1;  
            mon = 12;  
            }  
        }  
        d.setDate(d.getDate()-n);  
        year = d.getFullYear();  
        mon=d.getMonth()+1;  
        day=d.getDate();
        hours=d.getHours();
        minutes=d.getMinutes();
        second = d.getSeconds();
        s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);  
        return s;
      }
      //contList
      var data = {
        startTime:getBeforeDate(8),
        endTime:getBeforeDate(1),
        current:1,
        size:10
      }
      var contList =function(){
          service.contList(data)
          .then(function(res) {
            console.log(res)
            $scope.cont = res.data.data;
            var contList = res.data.data.page.records;
            console.log(contList)
            $scope.contList = contList;
            $scope.pageTotal = res.data.data.page.total;
            $scope.pageCurrent = res.data.data.page.current;
            $scope.pages = res.data.data.page.pages*10 ;
          })
          cc.length = 0;
        }
        contList();


        $scope.startdate = getBeforeDate(8);
        $scope.overdate  = getBeforeDate(1);
              //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            contList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          contList();
        }
                   //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        
        var methods = {
               infos: function(state,id,userId,content){  
                  console.log(state,id,userId,content)
          var abc={infos:state+','+id+','+userId+','+content,index:id}
          for(var info in cc){
            if (cc[info].index === id) {
              var i = cc.indexOf(cc[info]);
              cc.splice(i,1);
              cc.splice(i,1,abc)
              console.log(cc)
              return;
            };
          }
          cc.push(abc);
          
         },
            comm: function(){
          console.log(cc)
          for (var i = 0; i < cc.length; i++) {
            delete cc[i].index;
          };
          var cont=''
         for (var i = 0; i < cc.length; i++) {
           cc[i]
           // console.log(cc[i].infos)
           if(i ==0){
              cont=cont+cc[i].infos;
            }else{
              cont=cont+'&infos='+cc[i].infos;
            }
         };
        console.log(cont)
         // http.get(ROOT_DIR + "/admin/content/audit/comment;
          $http.get(ROOT_DIR+'/admin/content/audit?infos='+cont , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('提交成功！');
                         // setTimeout('window.location.reload()',1000);
                        contList();
                        cc.length = 0;
                        console.log(cc)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
        
     
         },
              pet :function(){
                var start_date = document.getElementById('start_date_d');
                var over_date = document.getElementById('over_date_d');
                  if (start_date && over_date) {
                    data.startTime = start_date.value+' 00:00:00';
                    data.endTime = over_date.value+' 23:59:59';
                  }
                   contList();     
                  },

        	
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('groupManage', {
    url: '/groupManage',
    name: 'groupManage',
    templateUrl: './frontend/components/groupManage/index.html',
    controller: function($scope, apiActions, token, $uibModal,$filter) {
      var service = apiActions.list;
      var data={
            
                  }
      var dato ={
        startTime:getBeforeDate(8)+' 00:00:00',
        endTime:getBeforeDate(1)+' 23:59:59',
        type:1,
        tagId:1
      }
      var doto ={
        startTime:getBeforeDate(8)+' 00:00:00',
        endTime:getBeforeDate(1)+' 23:59:59',
        type:1
      }
        $scope.potData = {
          value:null
      };
        $scope.topData = {
          value:null
      };
      function getBeforeDate(n){  //初始前七天日期
        var n = n;  
        var d = new Date();  
        var year = d.getFullYear();  
        var mon=d.getMonth()+1;  
        var day=d.getDate();  
        if(day <= n){  
          if(mon>1) {  
             mon=mon-1;  
          } else {  
            year = year-1;  
            mon = 12;  
            }  
        }  
        d.setDate(d.getDate()-n);  
        year = d.getFullYear();  
        mon=d.getMonth()+1;  
        day=d.getDate();
        hours=d.getHours();
        minutes=d.getMinutes();
        second = d.getSeconds();
        s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);  
        return s;
      }
      //businessAll
      var businessAll = function(){
        service.businessAll($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.businessAll = res.data.data;
            var sex = res.data.data.sex;
             var boy = sex.boy;
            var girl = sex.girl;
            var other = sex.other;

              myChart.setOption({
                      title : {
                        text: '注册用户性别占比',
                        x:'center'
                        },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['男','女','未知']
                    },
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '70',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:boy, name:'男'},
                                {value:girl, name:'女'},
                                {value:other, name:'未知'}
                            ]
                        }
                    ]
               })
          })

      }
     businessAll();
     //用户新增留存行为折线图
        var myChart = echarts.init(document.getElementById('g_main'));
        var z_myChart = echarts.init(document.getElementById('z_main'));
        var o_myChart = echarts.init(document.getElementById('o_main'));
        var d_myChart = echarts.init(document.getElementById('d_main'));
        var ficTag = function(){
                   service.ficTag(data)
                    .then(function(res) {
                      // console.log(res)
                     $scope.ficTag = res.data.data.list;
                     console.log($scope.ficTag)
                    })
        }
        ficTag();
        var businessTrend = function(){
          service.businessTrend($.param(dato))
                        .then(function(res) {
                          // console.log(res)
                        var comment =res.data.data.comment;
                        var content =res.data.data.content;
                        var rate =res.data.data.rate;
                        var trendList  = res.data.data.list
                        var time =[];
                        var vul = [];
                        $scope.comment = comment;
                        $scope.content = content;
                        $scope.rate = rate;
                        for (var i = 0; i < trendList.length; i++) {
                          trendList[i]
                          var terendTime = trendList[i].time;
                          var terendValue = trendList[i].value;
                          time.push(terendTime);
                          vul.push(terendValue);
                           };
                          
                              z_myChart.setOption({
                                     title : {
                                        text: '数据名称趋势图',
                                        x:'center'
                                        },
                                    xAxis: {
                                            type: 'category',
                                            data: time
                                        },
                                        yAxis: {
                                            type: 'value'
                                        },
                                        series: [{
                                            data: vul,
                                            type: 'line'
                                        }]
                                  })


                        })
        }
        businessTrend();

        var businessType = function(){
            service.businessType($.param(data))
          .then(function(res) {
            console.log(res)
             $scope.picture = res.data.data.picture;
             $scope.vidoe = res.data.data.vidoe;
             $scope.vioce = res.data.data.vioce;
             var picture = res.data.data.picture;
             var vidoe = res.data.data.vidoe;
             var vioce = res.data.data.vioce;
               o_myChart.setOption({
                      title : {
                        text: '内容类型占比',
                        x:'center'
                        },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:['图片','视频','录音']
                    },
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '70',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:picture, name:'图片'},
                                {value:vidoe, name:'视频'},
                                {value:vioce, name:'录音'}
                            ]
                        }
                    ]
               })
          })
        }
        businessType();
        var geoCoordMap = {
                       
                    };
          function convertData(data) {
                 var res = [];
                 for (var i = 0; i < data.length; i++) {
                     var geoCoord = geoCoordMap[data[i].name];
                     if (geoCoord) {
                         res.push({
                             name: data[i].name,
                             value: geoCoord.concat(data[i].value)
                         });
                     }
                 }
                 return res;
              };

              function randomValue() {
                  return Math.round(Math.random()*1000);
              }
        //distribution 区域分布
        var distribution =function(){
             service.distribution($.param(doto))
          .then(function(res) {
            console.log(res)
            $scope.distribution = res.data.data.list;
            var distribution = res.data.data.list;
              var orName ='';
              var arr = [];
                for (var i = 0; i < distribution.length; i++) {
                              distribution[i]
                    var name = distribution[i].name;
                    var number = distribution[i].value;
                    
                    if (name.indexOf('省')>=0) {
                      var name = name.substring(0,name.length-1)
                     };
                      orName+=name
                      var obj = {name: name, value:number }
                          arr.push(obj);
                            };   
                          console.log(arr)        
              d_myChart.setOption({
                       tooltip: {},
                          visualMap: {
                              min: 0,
                              max: 1500,
                              left: 'right',
                              top: 'bottom',
                              text: ['High','Low'],
                              seriesIndex: [1],
                              inRange: {
                                  color: ['#e0ffff', '#006edd']
                              },
                              calculable : false
                          },
                          geo: {
                              map: 'china',
                              roam: false,
                              label: {
                                  normal: {
                                      show: true,
                                      textStyle: {
                                          color: 'rgba(0,0,0,0.4)'
                                      }
                                  }
                              },
                              itemStyle: {
                                  normal:{
                                      borderColor: 'rgba(0, 0, 0, 0.2)'
                                  },
                                  emphasis:{
                                      areaColor: null,
                                      shadowOffsetX: 0,
                                      shadowOffsetY: 0,
                                      shadowBlur: 20,
                                      borderWidth: 0,
                                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                                  }
                              }
                          },
                   series : [
                             {
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                 data: convertData(data),
                                symbolSize: 0,
                                 symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                                symbolRotate: 35,
                                 label: {
                                     normal: {
                                         formatter: '{b}',
                                         position: 'right',
                                         show: false
                                     },
                                     emphasis: {
                                         show: false
                                     }
                                 },
                                 itemStyle: {
                                     normal: {
                                          color: '#F06C00'
                                     }
                                 }
                              },
                              {
                                  name: 'categoryA',
                                  type: 'map',
                                  geoIndex: 0,
                                   tooltip: {show: false},
                                  data:arr
                              }
                          ]
               })


          })
        }
        distribution();
        $scope.potData.value ='1';
        $scope.potData.state ='1';
        $scope.topData.value ='1';
        $scope.startdate = getBeforeDate(8);
        $scope.overdate  = getBeforeDate(1);
        var methods = {
             pot :function(date){
                var start_date = document.getElementById('start_date_gou');
                var over_date = document.getElementById('over_date_gou');

                  if (start_date && over_date) {
                    dato.startTime = start_date.value+' 00:00:00';
                    dato.endTime = over_date.value+' 23:59:59';
                  }
                  console.log(date.value,date.value)
                        dato.type = date.value;
                        dato.tagId = date.state;
                      console.log(date)
                       businessTrend();
                  },
                   pet :function(data){
                var start_date = document.getElementById('start_date_d');
                var over_date = document.getElementById('over_date_d');

                  if (start_date && over_date) {
                    doto.startTime = start_date.value+' 00:00:00';
                    doto.endTime = over_date.value+' 23:59:59';
                  }
                        doto.type = data.value;
                        distribution();
                  },
            
        }    
      angular.extend($scope, methods)
    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage', {
    url: '/operateManage',
    name: 'operateManage',
    templateUrl: './frontend/components/operateManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        
         var service = apiActions.list;
      var navList = locals.getObject("menuList");
      var navParentId; //父级Id
      $.each(navList, function(i,item) {
        if(item.name == '运营管理'){
          navParentId = item.id;
        }
      });
      var sideNave = navList.filter(function (obj) {
        return obj.pid == navParentId;
      });
      $scope.sideNave = sideNave;





        var methods = {
            

        	
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('systemManage', {
    url: '/systemManage',
    name: 'systemManage',
    templateUrl: './frontend/components/systemManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token, locals,baseUrl,$rootScope) {
    	var service = apiActions.list;
    	var navList = locals.getObject("menuList");
    	$scope.selects;
    	var navParentId; //父级Id
    	$.each(navList, function(i,item) {
				if(item.name == '系统设置'){
					navParentId = item.id;
				}
			});

			var sideNave = navList.filter(function (obj) {
		    return obj.pid == navParentId;
			});
			$scope.sideNave = sideNave;
      var data ={
        current:1,
        size:100
      }
			 //用户列表
        service.roleList($.param(data))
          .then(function(res) {
            console.log(res)
              var dataList = res.data.data.list;
               $scope.assignList = dataList;
          })
			
		
        var methods = {
          //新增角色
        sysIncrease: function() {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/role.html',
                backdrop: 'static',
                windowClass: 'modal-user',
                controller: function($scope, $uibModalInstance) {
                   $scope.addRole = function(data) {
                    console.log(data)
                service.roleAdd($.param(data))
                  .then(function(res) {
                    console.log(res)
                      var result = res.data.msg;
                      if (result == '成功.') {
                        toastr.success('成功！');
                        
                        function reload() {
                          window.location.reload(true);
                        }
                        setTimeout(reload, 1000);
                      }else{
                        toastr.error(result);
                      }
                  })
              }

                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },
        //用户管理
         user: function(id,name) {

              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/user.html',
                backdrop: 'static',
                windowClass: 'modal-rolo',
                controller: function($scope, $uibModalInstance,apiActions) {
                  $scope.nickName = name;
                  // console.log(id)
                      var data ={
                       roleId:id
                }
                  service.assignList(data)
                  .then(function(res) {
                    // console.log(res)
                var userList = res.data.data.list;
                  $scope.userdata = userList;
                  }),
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                   //新增用户
                $scope.add_user= function() {
                  
                  var itemId =id;
                  // console.log(itemId)
                  var scope = $rootScope.$new();
                  scope.roleId=itemId;
                    var $ctrl = this;
                    $ctrl.animationsEnabled = true
                    var modalInstance = $uibModal.open({
                      animation: $scope.animationsEnabled, //打开时的动画开关
                      templateUrl: './frontend/template/add_user.html',
                      backdrop: 'static',
                      windowClass: 'modal-user',
                      controller: 'C_add_Warn',
                       controller: function($scope, $uibModalInstance,apiActions) {
                         var service = apiActions.list;
                          var data = itemId //角色id
                          // console.log(data)
                          //创建用户
                          $scope.createUser = function(formData) {
                            formData.roleId = data;
                            service.createUser($.param(formData))
                            .then(function(res) {
                                var result = res.data.msg;
                                if (result == '成功.') {
                                  toastr.success('添加成功！');
                                  
                                  function reload() {
                                    window.location.reload(true);
                                  }
                                  setTimeout(reload, 1000);
                                  
                                }else{
                        toastr.error(result);
                           }
                            })
                          }
                          //关闭弹窗
                          $scope.close_modal = function() {
                            $uibModalInstance.close();
                          }


                                      }
                    })
                  }
                        //用户禁用启用
                  $scope.opt_user = function(datas){
                    // console.log(datas)
                    var data = {userId:datas};
                    service.optUser($.param(data))
                      .then(function(res) {
                        // console.log(res)
                          var result = res.data.msg;
                          if (result == '成功.') {
                            // datas.isHover = !datas.isHover; //改变颜色
                            toastr.success('成功！');
                            $uibModalInstance.close();
                          }else{
                            toastr.error(result);
                          }
                      })
                  }
                }
              })
        },
        //编辑权限
         sysEdit: function(id,name) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/edit_role.html',
                backdrop: 'static',
                windowClass: 'modal-avd',
                controller: function($scope, $uibModalInstance) {
                  // console.log(id,name)
                  $scope.allId=[]; //所有全选后的id
                  $scope.username = name;
                  // console.log($scope.username)
                var data ={
                       roleId:id
                }
                  service.assignMenuList(data)
                  .then(function(res) {
                    // console.log(res)
                   $scope.roleMenuList = res.data.data.list;
            var pList = $scope.roleMenuList;
            pList.forEach(function (element, index, array) {
                // element: 指向当前元素的值
                // index: 指向当前索引
                // array: 指向Array对象本身
                if(element.isOpt == 1){
                 // console.log(element.menuId)
                  $scope.allId.push(element.menuId);
                }
                element.nodes.forEach(function (ele, index, array) {
                  if(ele.isOpt == 1){
                   // console.log('childen',element.menuId)
                    $scope.allId.push(ele.menuId);
                  }
                })
               // console.log($scope.allId)
            });
               
                     
                  }),
          //修改角色权限
          $scope.updateMenu=function(){
              var stri = $scope.allId;
              // console.log(stri)
              var str = stri.join(",");
              var data = {
                roleId:id,
                menuIds:str
              }
              service.updateMenu($.param(data))
                .then(function(res) {
                  // console.log(res)
                    var result = res.data.msg;
                    if (result == '成功.') {
                      toastr.success('成功！');
                      
                      function reload() {
                        window.location.reload(true);
                      }
                      setTimeout(reload, 1000);
                  
                    }else{
                      toastr.error(result);
                    }
                })
            },
         //修改角色权限
            $scope.onlyChecked = function($event,s){ 
              var e = $event.target;
              if(e.checked == false){  //未选中
                $scope.allId.removeByValue(s);
                  // console.log($scope.allId)
              }else if(e.checked == true){//选中
                $scope.allId.push(s);
                  // console.log($scope.allId)
              }
            }
                
        //关闭弹窗
            $scope.close_modal = function() {
              $uibModalInstance.close();
            } 
                }

              })
         },
         
        }
        angular.extend($scope, methods);

    }
  })
})
       
wwApp.config(function($stateProvider) {
  $stateProvider.state('sunManage', {
    url: '/sunManage',
    name: 'sunManage',
    templateUrl: './frontend/components/sunManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
        var data={

        }
        var sunPending =function(){
          service.sunPending($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
        var sunTreated = function(){
          service.sunTreated($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.sunTreated = res.data.data;
          })
        }
        sunTreated();
        //内容审核-屏蔽内容各类型统计
         var sunCount = function(){
          service.sunCount($.param(data))
          .then(function(res) {
            // console.log(res)
            var sunCountList = res.data.data.list;
            var arr = [];
            var nickName =[];
            for (var i = 0; i < sunCountList.length; i++) {
              sunCountList[i]
              var name =  sunCountList[i].name;
              var value = sunCountList[i].value;
              var obj = {name: name, value:value }
              arr.push(obj);
              nickName.push(name);
            };
               a_myChart.setOption({
                   title : {
                                text: '屏蔽内容类型比例',
                                x:'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: nickName
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:arr,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
               })
          })
        }
        sunCount();
          //内容审核-屏蔽评论各类型统计
         var sunComment = function(){
          service.sunComment($.param(data))
          .then(function(res) {
            console.log(res)
            var sunCommentList = res.data.data.list;
            var arr = [];
            var nickName =[];
            for (var i = 0; i < sunCommentList.length; i++) {
              sunCommentList[i]
              var name =  sunCommentList[i].name;
              var value = sunCommentList[i].value;
              var obj = {name: name, value:value }
              arr.push(obj);
              nickName.push(name);
            };
             b_myChart.setOption({
                   title : {
                                text: '屏蔽评论类型比例',
                                x:'center'
                            },
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: nickName
                            },
                            series : [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data:arr,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
               })

          })
        }
        sunComment();
        var a_myChart = echarts.init(document.getElementById('a_main'));
        var b_myChart = echarts.init(document.getElementById('b_main'));
        var methods = {
         
           

        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('survey', {
    url: '/survey',
    name: 'survey',
    templateUrl: './frontend/components/survey/index.html',
    controller: function($scope, apiActions, token, $uibModal,$filter) {
      var service = apiActions.list;
      var data={
            endTime:getBeforeDate(1),
            startTime:getBeforeDate(8)
      }
        $scope.potData = {
          value:null
      };
      function getBeforeDate(n){  //初始前七天日期 
        var n = n;  
        var d = new Date();  
        var year = d.getFullYear();  
        var mon=d.getMonth()+1;  
        var day=d.getDate();  
        if(day <= n){  
          if(mon>1) {  
             mon=mon-1;  
          } else {  
            year = year-1;  
            mon = 12;  
            }  
        }  
        d.setDate(d.getDate()-n);  
        year = d.getFullYear();  
        mon=d.getMonth()+1;  
        day=d.getDate();
        hours=d.getHours();
        minutes=d.getMinutes();
        second = d.getSeconds();
        s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);  
        return s;
      }
      //用户新增留存行为
      //onchange时间刷新页面
      funcStart= function(tim){//将选好的时间携带过来
        data.startTime = tim ;
       activeAll();
       date.startTime = tim ;
       registerData();
      }
      funcEnd= function(tim){//
        data.endTime = tim ;
        activeAll();
        date.endTime = tim ;
        registerData();
      }
        $scope.startdate = getBeforeDate(8);
        $scope.overdate  = getBeforeDate(1);
        $scope.potData.value ='注册用户';
         var activeAll =function(){
            service.activeAll($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.activeAll = res.data.data;
          })
        }
        activeAll();
        var date ={
          endTime:getBeforeDate(1),
          startTime:getBeforeDate(8),
          type:'注册用户'
        }
         var registerData =function(){
            service.registerData($.param(date))
          .then(function(res) {
            // console.log(res)
             var dayCenter = res.data.data.day; 
             var weekCenter = res.data.data.week;
             var monthCenter = res.data.data.month;
             var arr =[];
             var crr =[];
            for (var i = 0; i < dayCenter.length; i++) {
              dayCenter[i]
              var count =dayCenter[i].value;
              var createTime =dayCenter[i].time;
               arr.push(count);
               crr.push(createTime);
             }
              var abb =[];    
              for (var i = 0; i < weekCenter.length; i++) {
              weekCenter[i]
              var count1 =weekCenter[i].value;
               abb.push(count1);          
            };
              var acc =[];            
              for (var i = 0; i < monthCenter.length; i++) {
              monthCenter[i]
              var count2 =monthCenter[i].value;
               acc.push(count2);               
            };
             myChart.setOption({
                       legend: {
                          data:['当前数据','周环比数据','月环比数据']
                      },
                      grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          containLabel: true
                      },
                      toolbox: {
                          feature: {
                              saveAsImage: {}
                          }
                      },
                      xAxis: {
                                  type: 'category',
                                  data: crr                              },
                              yAxis: {
                                  type: 'value'
                              },
                              series: [{
                                name:'当前数据',
                                  data: arr,
                                  type: 'line',
                                   itemStyle : { normal: {label : {show: true}}}
                              },
                              {
                                name:'周环比数据',
                                  data: abb,
                                  type: 'line',
                                   itemStyle : { normal: {label : {show: true}}}
                              },
                              {
                                name:'月环比数据',
                                  data: acc,
                                  type: 'line',
                                   itemStyle : { normal: {label : {show: true}}}
                              }
                              ]
               })
          })
        }
        registerData();
      //用户新增留存行为折线图
       var myChart = echarts.init(document.getElementById('main'));
       //渠道数据柱状图
       var zChart = echarts.init(document.getElementById('mrin'));
       //渠道数据折线图
       var V_Chart = echarts.init(document.getElementById('mvin'));
       //留存率
       var dato={
          startTime:getBeforeDate(8),
          endTime:getBeforeDate(1),
          current:1,
          size:10
            
       }
       //Retention
        var Retention =function(){
            service.Retention($.param(dato))
          .then(function(res) {
            // console.log(res)
            $scope.Retention = res.data.data;
            $scope.RetentionList = res.data.data.list;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ; //总页数
           
          })
        }
        Retention();
          //分页
        $scope.jumpPage = function(pageNum){
            
            dato.current = pageNum;
            Retention();
        }
        $scope.pageChanged = function(pageNum) {
          dato.current  = pageNum;
          Retention();
        }
        //时间插件
         tuncStart= function(tim){//将选好的时间携带过来
             dato.startTime = tim ;
             Retention();
          }
          tuncEnd= function(tim){//
            dato.endTime = tim ;
            Retention();          
          }
//downloadInstall渠道数据
  var deta ={
            endTime:getBeforeDate(1),
            startTime:getBeforeDate(8)
  }
    var downloadInstall =function(){
            service.downloadInstall($.param(deta))
            .then(function(res) {
                // console.log(res)
                var downloadInstallList = res.data.data.list;
                console.log(downloadInstallList)
                 var arr =[];
                 var crr =[];
                 var brr = 0;
                for (var i = 0; i < downloadInstallList.length; i++) {
                  downloadInstallList[i]
                  var count =downloadInstallList[i].value;
                  var createTime =downloadInstallList[i].name;
                   arr.push(count);
                   crr.push(createTime);
                   brr += count;

                 }
                 console.log(crr)
                $scope.number=brr;
                   zChart.setOption({
                        //        xAxis: {
                        //     type: 'category',
                        //     data: crr
                        // },
                        // yAxis: {
                        //     type: 'value'
                        // },
                        // series: [{
                        //     data: arr,
                        //     type: 'bar',
                        //     itemStyle: {
                        //           normal: {
                        //             label: {
                        //               show: true, //开启显示
                        //               position: 'top', //在上方显示
                        //               textStyle: { //数值样式
                        //                 color: 'black',
                        //                 fontSize: 16
                        //               }
                        //             }
                        //           }
                        //         },
                        // }]
                        color: ['#3398DB'],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '6%',
                            right: '6%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data :crr,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'直接访问',
                                type:'bar',
                                barWidth: '60%',
                                data:arr
                            }
                        ]
                   })
          })
        }
        downloadInstall();
//渠道数据 -渠道下拉列表
         var countChannel =function(){
            service.countChannel($.param(dato))
            .then(function(res) {
               // console.log(res)
               $scope.countChannel = res.data.data.list;
               var countChannel= res.data.data.list;
              for (var i = 0; i < countChannel.length; i++) {
                countChannel[i]
                 var coutName =countChannel[i].name;       
              };  
            })
        }
        countChannel();
//渠道数据 -渠道周期下载数据
    var deto ={
          startTime:getBeforeDate(8),
          endTime:getBeforeDate(1),
          type:1
    }
  var countInstall =function(){
        service.countInstall($.param(deto))
          .then(function(res) {
             // console.log(res)
            $scope.countName = res.data.data.name 
            var dayCenter = res.data.data.day; 
             var weekCenter = res.data.data.week;
             var monthCenter = res.data.data.month;
             var arr =[];
             var crr =[];
             var number = 0;
            for (var i = 0; i < dayCenter.length; i++) {
              dayCenter[i]
              var count =dayCenter[i].value;
              var createTime =dayCenter[i].time;
               arr.push(count);
               crr.push(createTime);
               number += count;
             }
              $scope.numbers=number;
              var abb =[];
              for (var i = 0; i < weekCenter.length; i++) {
              weekCenter[i]
              var count1 =weekCenter[i].value;
               abb.push(count1);
               
            };
              var acc =[];
              for (var i = 0; i < monthCenter.length; i++) {
              monthCenter[i]
              var count2 =monthCenter[i].value;
               acc.push(count2);
               
            };

             V_Chart.setOption({
                       legend: {
                          data:['当前数据','周环比数据','月环比数据']
                      },
                      grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          containLabel: true
                      },
                      toolbox: {
                          feature: {
                              saveAsImage: {}
                          }
                      },
                      xAxis: {
                                  type: 'category',
                                  data: crr                              },
                              yAxis: {
                                  type: 'value'
                              },
                              series: [{
                                name:'当前数据',
                                  data: arr,
                                  type: 'line',
                                   itemStyle : { normal: {label : {show: true}}}
                              },
                              {
                                name:'周环比数据',
                                  data: abb,
                                  type: 'line',
                                   itemStyle : { normal: {label : {show: true}}}
                              },
                              {
                                name:'月环比数据',
                                  data: acc,
                                  type: 'line',
                                   itemStyle : { normal: {label : {show: true}}}
                              }
                              ]
               })  
          })
        }
          countInstall();
         auncStart= function(tim){//将选好的时间携带过来
          // console.log(tim)
             deta.startTime = tim ;
             downloadInstall()
             deto.startTime = tim ;
             countInstall();
          }
          auncEnd= function(tim){//
            // console.log(tim)
              deta.endTime = tim ;
              downloadInstall()
              deto.endTime = tim ;
              countInstall();
          }
        var methods = {
           potName :function(datas){
                 console.log(datas)
                  date.type = datas.value;
               registerData();
              },
               petName :function(value){
                 // console.log(value)
                  deto.type = value.value;
                  countInstall();
              },
        }    
      angular.extend($scope, methods)
    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('vestManage', {
    url: '/vestManage',
    name: 'vestManage',
    templateUrl: './frontend/components/vestManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
        // console.log(bir)
       var service = apiActions.list;
       var data={
              current:1,
              size:20
          }
         var fictitiousList =function(){
            service.fictitiousList($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.fictitious = res.data.data;
            var fictitiousList = res.data.data.list;
            $scope.fictitiousList = fictitiousList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        fictitiousList();
          //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            fictitiousList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          fictitiousList();
        }
        var methods = {
            cc :function(id){
                  console.log(id)
             var url = './index.html#/vestDynamic/'+id.id;
             console.log(url);
             window.open(url,'_blank');
          }, 
           aa :function(){
                 
             var url = './index.html#/vestWrite/';
             console.log(url);
             window.open(url,'_blank');
          }, 
            bb :function(id,img,name){
              console.log(id,img,name)
            sessionStorage.setItem('name',name)
            
             var url = './index.html#/vestEd/'+id+"?img="+img;
             console.log(url);
             window.open(url,'_blank');
          }, 
            dd :function(id){
             var url = './index.html#/vestImg/'+id.id;
             console.log(url);
             window.open(url,'_blank');
          }, 
           //发布视频
            reVideo: function(id) {
              console.log(id);
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/vest.html',
              backdrop: 'static',
              windowClass: 'modal-avd',
              controller: function($scope, $uibModalInstance, uploadAdv,uploadMusic) {
                      //ficTag
                   var data={
                      
                    }
                   service.ficTag(data)
                    .then(function(res) {
                      console.log(res)
                     $scope.ficTag = res.data.data.list;
                     console.log($scope.ficTag)
                    })
                    service.getQiniuToken(data)
                      .then(function(res) {
                        var qiniuToken = res.data.data.token;
                        console.log(1111111111+'aha')
                        if (qiniuToken) {
                          uploadAdv(qiniuToken, token, $scope,$uibModalInstance)
                          
                        }
                      })
                    service.getQiniuToken(data)
                    .then(function(res) {
                      var qiniuToken = res.data.data.token;
                      if (qiniuToken) {
                        uploadMusic(qiniuToken, token, $scope,$uibModalInstance)
                      }
                    })
                  $scope.vestmove=function(tag,names){
                    var index = document.getElementById('tag').selectedIndex;
                    var b =parseInt(index);
                    var tagName=document.getElementById('tag').options[b].text;
                    var vestVideo =$('#advVideo')[0].src
                    var vestAudio =$('#advAudio')[0].src
                    // console.log(vestVideo,tag,tagName,vestAudio,names);
                    // ficContentAdd
                     // if (vestAudio!='') {
                     //    var vestAudio
                     //  };

                     var date={
                        userId:id,
                        content:names,
                        tagId:tag,
                        tagName:tagName,
                        contentMedias:[
                            {
                                mediaType:2,
                                url:vestVideo
                            }
                           
                          ]
                      }
               $http.post('http://wangsocial.com:8084/admin/fictitious/content/add' , date , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('发布成功！');
                        $uibModalInstance.close();
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });


                          // 
                  }



              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },

        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.noticeManage', {
    url: '/noticeManage',
    name: 'noticeManage',
    templateUrl: './frontend/components/operateManage/noticeManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
          var service = apiActions.list;
       var data={
              current:1,
              size:20
          }
         var noticeList =function(){
            service.noticeList($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.notice = res.data.data;
            var noticeList = res.data.data.list;
            $scope.noticeList = noticeList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        noticeList();


    //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            noticeList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          noticeList();
        }
        //deleteAdvertising

        var methods = {
            dele:function(id){
            var data={
                  id:id,
                }
               service.deleteAdvertising($.param(data))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('删除成功！');
                   setTimeout('window.location.reload()',100)
                }else {
                              alert("删除失败!");
                            };
          })
            },
       bannerUpd:function(id,state){
            console.log(id,state)
                 var date={
                  id:id,
                  state:state
                }
               service.noticUpdate($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('成功！');
                   noticeList();
                }else {
                              alert("失败!");
                            };
          })
          },
           aa: function() {
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/nont.html',
            backdrop: 'static',
            windowClass: 'modal-avd',
            controller: function($scope, $uibModalInstance) {
                $scope.abc =function(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont){ 
                console.log(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont)
                 var start_date = document.getElementById('start_date_gou');
                var over_date = document.getElementById('over_date_gou');

                  if (start_date && over_date) {
                    var startTime = start_date.value;
                    var endTime = over_date.value;
                  }
                  // console.log(startTime,endTime)
               var start = startTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')
               var end = endTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')  
                console.log(start,end)
             var date={
                  startTime:start,
                  endTime:end,
                  unit:nontData,
                  intervaltime:notTime,
                  time:noTime,
                  name:nontName,
                  content:nontCont,
                  type:nont,
                  url:nontUrl
                }
               service.saveAdvertising($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('创建成功！');
                  $uibModalInstance.close();
                    noticeList();
                }else {
                              alert("创建失败！");
                            };
          })
              }
              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
          cc: function(id,name,content,unit,time,type,intervaltime,url,startTime,endTime) {
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/nonts.html',
            backdrop: 'static',
            windowClass: 'modal-avd',
            controller: function($scope, $uibModalInstance) {
              // console.log(id,name,content,unit,time,type,intervaltime,url)
                $scope.nontName =name;
                $scope.nontCont =content;
                $scope.unit =unit;
                $scope.types=type;
                $scope.notTime=intervaltime;
                $scope.noTime= time;
                $scope.nontUrl= url;
                $scope.startdate = startTime;
                $scope.overdate  = endTime;
            $scope.abcd =function(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont){
             
                console.log(notTime,nontData,nontName,noTime,nont,nontUrl,nontCont)
                 var start_date = document.getElementById('start_date_gous');
                var over_date = document.getElementById('over_date_gous');

                  if (start_date && over_date) {
                    var startTime = start_date.value;
                    var endTime = over_date.value;
                  }
                  // console.log(startTime,endTime)
            var start = startTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')
            var end = endTime.replace('年','-').replace('月','-').replace('日','').replace('分','-').replace('时','-').replace('秒','')  
                console.log(start,end)

             var date={
                  id:id,
                  unit:nontData,
                  intervaltime:notTime,
                  time:noTime,
                  name:nontName,
                  content:nontCont,
                  type:nont,
                  url:nontUrl
                }
                date.startTime = start;
                date.endTime = end;
               service.noticUpdate($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('编辑成功！');
                  $uibModalInstance.close();
                   noticeList();
                }else {
                              alert("编辑失败！");
                            };
          })
              }
              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
        }
        angular.extend($scope, methods);

    }
  })
})

// 启动页，这里是启动页
wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.startManager', {
    url: '/startManager',
    name: 'startManager',
    templateUrl: './frontend/components/operateManage/startManager/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals,uploadStr) {
        var service = apiActions.list;
        var data={
              current:1,
              size:10,
          }
          console.log(data)
         var startManagerList =function(){
            service.startManagerList($.param(data))
          .then(function(res) {
              console.log(1)
              console.log(res)  
              console.log(2);
                          
            $scope.startup = res.data.data;
            var startManagerList = res.data.data.list;
            $scope.startManagerList = startManagerList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        startManagerList();

         //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            startManagerList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          startManagerList();
        }
       //点击图片时放大显示图片  
    //     $scope.changePic = function($event){  
    //         var img=$event.srcElement || $event.target;   
    //         $("#bigimage").attr('src',img.src);  
    //         $("#js-imgview").css("display",'block');  
    //         $("#js-imgview-mask").css("display",'block');
    //     }  
    //   //点击图片时放小显示图片  
    //     $scope.closePic =function(){ 
    //         $("#js-imgview").css("display",'none');  
    //         $("#js-imgview-mask").css("display",'none');  
    //     }
        var methods = {
                   //新增
          bannerIncrease: function() {
              alert('功能正在开发')
        //   var $ctrl = this;
        //   $ctrl.animationsEnabled = true
        //   var modalInstance = $uibModal.open({
        //     animation: $scope.animationsEnabled, //打开时的动画开关
        //     templateUrl: './frontend/template/banner.html',
        //     backdrop: 'static',
        //     windowClass: 'modal-avd',
        //     controller: function($scope, $uibModalInstance, uploadBanners) {
        //       service.getQiniuToken(data)
        //         .then(function(res) {
        //           var qiniuToken = res.data.data.token;
        //           if (qiniuToken) {
        //             uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
        //           }else{
        //               alert('保存失败')
        //           }
        //         })
                
        //       $scope.close_modal = function() {
        //         $uibModalInstance.close();
        //       }
        //     //   闪屏话题列表
        //       var  startupTopicList = function(startupTopicList){
        //         service.startupTopicList().then(function(res){
        //             console.log('话题')
        //             console.log(res)
        //             console.log('话题')
        //             $scope.startupTopicList = res.data.data.list                
        //         })
        //     }
        //     $scope.linkType="1"
        //     $scope.goType='jh'
        //      startupTopicList()
        //     //  if(scope.goType=='jh'){
        //     //     $scope.linkType="3"
        //     //  }
        //     $scope.ly_test = function(){
        //          console.log($scope.goType,$scope.linkUrl, $scope.linkType)
        //      }
        //     }
        //   })
        },
            //编辑
        // exit_bannerIncrease: function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId) {
        //     var $ctrl = this;
        //     $ctrl.animationsEnabled = true
        //     var modalInstance = $uibModal.open({
        //         animation: $scope.animationsEnabled, //打开时的动画开关
        //         templateUrl: './frontend/template/exit_banner.html',
        //         backdrop: 'static',
        //         windowClass: 'modal-avd',
        //         controller: function($scope, $uibModalInstance, uploadBanners) {
        //         $scope.banUrl = url;
        //         $scope.billboardName = billboardName;
        //         $scope.time = time;
        //         $scope.id = id;
        //         $scope.startTime = startTime;
        //         $scope.endTime = endTime;
        //         $scope.linkUrl = linkUrl;
        //         $scope.linkType = linkType;
        //         $scope.tagId = tagId;
        //         if($scope.linkType=='1' || $scope.linkType=='2'){
        //             $scope.goType='lj'
        //         }else{
        //             $scope.goType='jh' 
        //         }
                
        //             service.getQiniuToken(data)
        //             .then(function(res) {
        //             var qiniuToken = res.data.data.token;
        //             if (qiniuToken) {
        //                 uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
        //             }
        //             })
        //         $scope.abc =function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId){
        //             // console.log(desc,time)
        //             var date={
        //             billboardId:id,
        //             time:time,
        //             billboardName:billboardName,
        //             startTime:startTime,
        //             endTime:endTime,
        //             linkUrl:linkUrl,
        //             linkType:linkType,
        //             tagId:tagId
        //             }
               
        //             console.log(date)
        //         service.startUpdate($.param(date))
        //             .then(function(res) {
        //                 console.log('16日下午')
        //             console.log(res)
        //             if (res.data.msg == '成功.') {
        //             toastr.success('修改成功！');
        //             $uibModalInstance.close();
        //             startManagerList();
        //             }else {
        //                     alert("添加失败！");
        //                 };
        //     })
        //         }
        //              //   闪屏话题列表
        //       var  startupTopicList = function(startupTopicList){
        //         service.startupTopicList().then(function(res){
        //             console.log('话题')
        //             console.log(res)
        //             console.log('话题')
        //             $scope.startupTopicList = res.data.data.list                
        //         })
        //     }
        //     startupTopicList()
        //         $scope.close_modal = function() {
        //             $uibModalInstance.close();
        //         }
        //         }
        //     })
        // },
        // 更改状态
        // bannerUpd:function(id,state){
        //     console.log(id,state)
        //     var date={
        //         billboardId:id,
        //         state:state
        //     }
        //     service.startUpdate($.param(date))
        //         .then(function(res) {
        //         console.log(res)
        //         if (res.data.msg == '成功.') {
        //             toastr.success('成功！');
        //             setTimeout('window.location.reload()',100)
        //         }else {
        //                 alert("启动广告只能开启一个，已存在开启的启动广告!");
        //                 };
        //     })
        //   },
 
        }
        angular.extend($scope, methods);
    }
  })
})

// 原为启动页管理，现改成闪屏管理
wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.startupManage', {
    url: '/startupManage',
    name: 'startupManage',
    templateUrl: './frontend/components/operateManage/startupManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals,uploadStr) {
        var service = apiActions.list;
        var data={
              current:1,
              size:10,
          }
         var startupList =function(){
            service.startupList($.param(data))
          .then(function(res) {
            $scope.startup = res.data.data;
            var startupList = res.data.data.list;
            $scope.startupList = startupList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        startupList();

         //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            startupList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          startupList();
        }
       //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        var methods = {
                   //新增
          bannerIncrease: function() {
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/banner.html',
            backdrop: 'static',
            windowClass: 'modal-avd',
            controller: function($scope, $uibModalInstance, uploadBanners) {
              service.getQiniuToken(data)
                .then(function(res) {
                  var qiniuToken = res.data.data.token;
                  if (qiniuToken) {
                    uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
                  }else{
                      alert('保存失败')
                  }
                })
                
              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            //   闪屏话题列表
              var  startupTopicList = function(startupTopicList){
                service.startupTopicList().then(function(res){
                    $scope.startupTopicList = res.data.data.list                
                })
            }
            function today(){
                var today=new Date();
                var h=today.getFullYear();
                var m=today.getMonth()+1;
                var d=today.getDate();
                m= m<10?"0"+m:m;     
                d= d<10?"0"+d:d;
                if( $scope.startTime==undefined)
                $scope.startTime=h+"-"+m+"-"+d;
                if( $scope.endTime==undefined){
                    $scope.endTime=h+"-"+m+"-"+d;
                }
            }
            today()
            funcStart= function(tim){//将选好的时间携带过来
                $scope.startTime = tim ;
              }
            funcEnd= function(tim){//
                $scope.endTime = tim ;
              }
            //   chosen 插件
              ss=function(){
                $('.ly_chosenTopic').chosen({
                    disable_search_threshold: 10,
                    width: '95%',
                    search_contains:true,
                  })
                  $(".chosen-search-input").attr('placeholder','输入搜索的内容')
                  $('.ly_chosenTopic').on('change',function(p,e){
                    $scope.tagId=parseInt(e.selected)
                    // $('.ly_chosenTopic')['chosen']='close'
                })
                
              }
            
            $scope.linkType="1"
            $scope.goType='lj'
             startupTopicList()
         
            $scope.ly_test = function(){
                 ss()
                 $scope.goType='jh'
                 console.log($scope.tagId,$scope.picUrl);
                 
             }

            }
          })
        },
            //编辑
        exit_bannerIncrease: function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId) {
            var $ctrl = this;
            $ctrl.animationsEnabled = true
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/exit_banner.html',
                backdrop: 'static',
                windowClass: 'modal-avd',
                controller: function($scope, $uibModalInstance, uploadBanners) {
                $scope.banUrl = url;
                $scope.billboardName = billboardName;
                $scope.time = time;
                $scope.id = id;
                var d= new Date(startTime)
                var dend = new Date(endTime)
                d_m= d.getMonth() + 1>9 ? (d.getMonth() + 1) :( 0+''+(d.getMonth() + 1))
                d_d=  d.getDate()>9 ?  d.getDate() :  0+''+d.getDate()
                dend_m= dend.getMonth() + 1>9 ? (dend.getMonth() + 1) :(0+''+(dend.getMonth() + 1))
                dend_d= dend.getDate()>9 ? dend.getDate() : 0+''+dend.getDate()
                startTime=d.getFullYear() + '-' + d_m + '-' + d_d;
                endTime = dend.getFullYear() + '-' + dend_m + '-' + dend_d;
                $scope.startTime = startTime;
                $scope.endTime = endTime;
                $scope.linkUrl = linkUrl;
                $scope.linkType = linkType+'';
                $scope.tagId = tagId;
                if($scope.linkType=='1' || $scope.linkType=='2'){
                    $scope.goType='lj'
                }else{
                    $scope.goType='jh' 
                }
                
                    service.getQiniuToken(data)
                    .then(function(res) {
                    var qiniuToken = res.data.data.token;
                    if (qiniuToken) {
                        uploadBanners(qiniuToken, token, $scope,$uibModalInstance)
                    }
                    })
                    // 编辑不上传图片时执行此函数，上传图片时执行banners.js里的函数
                $scope.abc =function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId){
                    var date={
                    billboardId:id,
                    time:time,
                    billboardName:billboardName,
                    startTime:startTime,
                    endTime:endTime,
                    linkUrl:linkUrl,
                    linkType:linkType,
                    tagId:tagId
                    }
                if($scope.time && $scope.billboardName){
                    service.startUpdate($.param(date))
                        .then(function(res) {
                        if (res.data.msg == '成功.') {
                        toastr.success('修改成功！');
                        $uibModalInstance.close();
                        startupList();
                        }else {
                                alert("添加失败！");
                            };
                    })
                }else{
                    alert('名称，持续时间')
                    console.log('时间：'+$scope.time +"名字："+ $scope.billboardName +"图片"+ date.picUrl)
                }
                }
                     //   闪屏话题列表
              var  startupTopicList = function(startupTopicList){
                service.startupTopicList().then(function(res){
                    $scope.startupTopicList = res.data.data.list                
                })
            }
            startupTopicList()
            funcStart= function(tim){//将选好的时间携带过来
                $scope.startTime = tim ;
              }
            funcEnd= function(tim){//
                $scope.endTime = tim ;
              }
              $scope.ss=function(){
                  $scope.goType='jh'
                $('.ly_chosenTopic').chosen({
                    disable_search_threshold: 10,
                    width: '95%',
                    search_contains:true,
                  })
                  $(".chosen-search-input").attr('placeholder','输入搜索的内容')
                  $('.ly_chosenTopic').on('change',function(p,e){
                    $scope.tagId=parseInt(e.selected)
                    $('.ly_chosenTopic')['chosen']='close'
                })
              }
                $scope.close_modal = function() {
                    $uibModalInstance.close();
                }
                }
            })
        },
        // 更改状态
        bannerUpd:function(id,state){
            var date={
                billboardId:id,
                state:state
            }
            service.startUpdate($.param(date))
                .then(function(res) {
                    var hint = res.data.msg
                if (hint == '成功.') {
                    toastr.success('成功！');
                    setTimeout('window.location.reload()',100)
                }else {
                        alert(hint);
                        };
            })
          },
        }
        angular.extend($scope, methods);
    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('operateManage.topicManage', {
    url: '/topicManage',
    name: 'topicManage',
    templateUrl: './frontend/components/operateManage/topicManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
         var service = apiActions.list;
         var data ={
             current:1,
              size:10
         }
         var topicList =function(){
            service.topicList($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.topic = res.data.data;
            var topicList = res.data.data.list;
            $scope.topList = topicList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        topicList();

          //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            topicList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          topicList();
        }


        var methods = {          
        //新增话题
        newTopic: function() {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/topic.html',
                backdrop: 'static',
                windowClass: 'modal-user',
                controller: function($scope, $uibModalInstance) {
              $scope.topicAdd = function(name,val) {
                console.log(name,val)
               
                var data={
                  name:name,
                  showOrder:val,
                    
                };
                    service.topicAdd($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                           $("#btn1").attr({ disabled: "disabled" });
                          window.location.reload()

                          $uibModalInstance.close();
                        }else if (res.data.msg == '排序错误.') {
                              alert("排序已存在，请重新填写");
                           }else if (res.data.msg == '名称已存在') {
                              alert("名称已存在，请重新填写");
                           };
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },
        setUP: function() {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/setUP.html',
                backdrop: 'static',
                windowClass: 'modal-new',
                controller: function($scope, $uibModalInstance) {

                  //topRecommend
                  service.topRecommend(data)
                    .then(function(res) {
                      // console.log(res)
                      var cont = res.data.data.list;
                      console.log(cont)
                      var v1;
                      var v2;
                      for (var i = 0; i < cont.length; i++) {
                        if(cont[i].name == 2){
                          v1 = cont[i].value;
                        }else{
                          v2 = cont[i].value;
                        }
                      };
                       $scope.v1= v1;
                       $scope.v2 =v2;
                    })



                      $scope.set = function(val,num) {
                      console.log(val,num)
                      $("#btn1").attr({ disabled: "disabled" });
                      var data={
                         objectNum:val,
                         objectNum1:num
                      };
                    service.topicRecommend($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                          window.location.reload()

                          $uibModalInstance.close();
                        }
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },	
         exit_topic: function(id,name,val) {
          console.log(id,name,val)
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/edit_topic.html',
                backdrop: 'static',
                windowClass: 'modal-user',
                controller: function($scope, $uibModalInstance) {
                  $scope.exitName =name;
                  $scope.exitNum = val;
                  $scope.exitId =id;
                    $scope.topicUpdate = function(name,val,id) {
                      console.log(name,val,id)
                      
                      var data={
                        name:name,
                        showOrder:val,
                        id:id
                      };
                    service.topicUpdate($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                          $("#btn1").attr({ disabled: "disabled" });
                          window.location.reload()

                          $uibModalInstance.close();
                        }else if (res.data.msg == '排序错误.') {
                              alert("排序已存在，请重新填写");
                            }else if (res.data.msg == '名称已存在') {
                              alert("名称已存在，请重新填写");
                           };
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },
            //顶置和已顶置
                   topSet: function(id,i) {
                    console.log(id,i)
                      if (i=="置顶") {
                        var data ={
                          id:id,
                          isRecommendTag:1

                        }
                        service.topicUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                              topicList();
                            }
                          })
                           
                      }else if (i=="取消置顶") {
                         var data ={
                          id:id,
                          isRecommendTag:0
                        }
                        service.topicUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                               topicList();
                            }
                          }) 
                      };
                     
                  },

        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('commentManage', {
    url: '/commentManage',
    name: 'commentManage',
    templateUrl: './frontend/components/sunManage/commentManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
      var ROOT_DIR = baseUrl.api;
        var data={
           current:1,
            size:20
        }
     
        var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            // console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
        var commentExamine = function(){
          service.commentExamine($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.commentExamine = res.data.data;
            $scope.commentExamineList = res.data.data.list;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        commentExamine();
           //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            commentExamine();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          commentExamine();
        }
               //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        var cc =[];
        var methods = {
         infos: function(state,id,commentId,userId,contentId){  
          var abc={infos:state+','+id+','+commentId+','+userId+','+contentId,index:id}
          for(var info in cc){
            if (cc[info].index === id) {
              var i = cc.indexOf(cc[info]);
              // console.log(i)
              cc.splice(i,1);
              cc.splice(i,1,abc)
              console.log(cc)
              return;
            };
          }
          cc.push(abc);
          
         },
         comm: function(){
          console.log(cc)
          for (var i = 0; i < cc.length; i++) {
            delete cc[i].index;
          };
          var cont=''
         for (var i = 0; i < cc.length; i++) {
           cc[i]
           // console.log(cc[i].infos)
           if(i ==0){
              cont=cont+cc[i].infos;
            }else{
              cont=cont+'&infos='+cc[i].infos;
            }
         };
        console.log(cont)
         // http.get(ROOT_DIR + "/admin/content/audit/comment;
          $http.get(ROOT_DIR+'/admin/content/audit/comment?infos='+cont , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('提交成功！');
                         setTimeout('window.location.reload()',1000);
                        
                        cc.length = 0;
                        console.log(cc)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
        
     
         }
           

        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('opinionManage', {
    url: '/opinionManage',
    name: 'opinionManage',
    templateUrl: './frontend/components/sunManage/opinionManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
      var ROOT_DIR = baseUrl.api;
        var data={
           current:1,
           size:20
        }
     
        var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            // console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
         var listUserIdea =function(){
          service.listUserIdea(data)
          .then(function(res) {
            console.log(res)
            $scope.listUserIdea = res.data.data.list;

            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
            var userIdea = res.data.data.list;
       
          })
        }
        listUserIdea();
        var cc =[];
            //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            listUserIdea();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          listUserIdea();
        }
                   //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        var methods = {
         
            infos: function(state,ideaId,userId){  
              // console.log(state,ideaId,userId)
          var abc={infos:state+','+ideaId+','+userId,index:ideaId}
          console.log(abc)
          for(var info in cc){
            if (cc[info].index === ideaId) {
              var i = cc.indexOf(cc[info]);
              console.log(i)
              cc.splice(i,1);
              cc.splice(i,1,abc)
              console.log(cc)
              return;
            };
          }
          cc.push(abc);
          
         },
         comm: function(){
          console.log(cc)
          for (var i = 0; i < cc.length; i++) {
            delete cc[i].index;
          };
          var cont=''
         for (var i = 0; i < cc.length; i++) {
           cc[i]
           // console.log(cc[i].infos)
           if(i ==0){
              cont=cont+cc[i].infos;
            }else{
              cont=cont+'&infos='+cc[i].infos;
            }
         };
        console.log(cont)
         // http.get(ROOT_DIR + "/admin/content/audit/comment;
          $http.get(ROOT_DIR+'/admin/userIdea/updateIdeaState?infos='+cont , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('提交成功！');
                         listUserIdea();
                        
                        cc.length = 0;
                        // console.log(cc)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
        
     
         }

        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('portraitManage', {
    url: '/portraitManage',
    name: 'portraitManage',
    templateUrl: './frontend/components/sunManage/portraitManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
        var data={

        }
      var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
          var commentAvatar =function(){
          service.commentAvatar()
          .then(function(res) {
            console.log(res)
            $scope.commentAvatar = res.data.data;
          })
        }
        commentAvatar();

        var methods = {
         adopt:function(userID,id,img){
               var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/adopt.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                 var date ={
                  state:1,
                  id:id,
                  userId:userID,
                  avatar:img
                }
                $scope.adopt=function(){
                        service.commentAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('审核通过！')
                             }
                              commentAvatar();
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
         },
           //commentAudit
              notAdopt:function(userID,id,img){

               var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/adopt.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                 var date ={
                  state:2,
                  id:id,
                  userId:userID,
                  avatar:img
                }
                $scope.adopt=function(){
                        service.commentAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('成功！')
                             }
                              commentAvatar();
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
         }

        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('userManage', {
    url: '/userManage/:id',
    name: 'userManage',
    templateUrl: './frontend/components/sunManage/userManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals,$stateParams) {
      var service = apiActions.list;
      var id = $stateParams.id;
        var data={
            id:id
        }
      var commentUser =function(){
          service.commentUser(data)
          .then(function(res) {
            console.log(res)
            $scope.commentUser = res.data.data;
          })
        }
        commentUser();
       


        var methods = {
               //封禁
            col: function(userID) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/closure.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
              //audit
              var date ={
                state:1,
                userId:userID
              }
                $scope.colt=function(){
                        service.commentUserAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('封禁成功！')
                             }
                             setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
              //屏蔽
            shie: function(userID) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/shield.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
               var date ={
                state:2,
                userId:userID
              }
                $scope.shi=function(){
                        service.commentUserAudit(date)
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('屏蔽成功！')
                             }
                            setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },

        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('contentManage', {
    url: '/contentManage',
    name: 'contentManage',
    templateUrl: './frontend/components/sunManage/contentManage/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$http,locals) {
      var service = apiActions.list;
        var data={
          current:1,
          size:1
        }
     
         var sunPending =function(){
          service.sunPending()
          .then(function(res) {
            // console.log(res)
            $scope.sunPending = res.data.data;
          })
        }
        sunPending();
        // sunConList
          var sunConList =function(){
          service.sunConList($.param(data))
          .then(function(res) {
            console.log(res)
             $scope.sunCon = res.data.data;
            $scope.sunConList = res.data.data.list;
          })
        }
        sunConList();
            //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }
        var methods = {
             //封禁
            col: function(userID,id,contID,content) {
              console.log(userID,id,contID)
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/closure.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
              //audit
              var date ={
                userId:userID,
                state:1,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.colt=function(){
                        service.audit($.param(date))
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('封禁成功！')
                             }
                               setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
           //警告
            war: function(userID,id,contID,content) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/warning.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                var date ={
                userId:userID,
                state:2,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.wat=function(){
                        service.audit($.param(date))
                            .then(function(res) {
                               // console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('警告成功！')
                             }
                              setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },  
          //屏蔽
            shie: function(userID,id,contID,content) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/shield.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
               var date ={
                userId:userID,
                state:3,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.shi=function(){
                        service.audit($.param(date))
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('屏蔽成功！')
                             }
                             setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
            //不处理
            noth: function(userID,id,contID,content) {
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled, //打开时的动画开关
              templateUrl: './frontend/template/notHandle.html',
              backdrop: 'static',
              windowClass: 'modal-col',
              controller: function($scope, $uibModalInstance) {
                  var date ={
                userId:userID,
                state:0,
                id:id,
                contentId:contID,
                content:content
              }
                $scope.not=function(){
                        service.audit($.param(date))
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('操作成功！')
                             }
                              setTimeout('window.location.reload()',1000);
                            })  
                           
                          $uibModalInstance.close();
                  }
              

              $scope.close_modal = function() {
                $uibModalInstance.close();
              }
            }
          })
        },
        }
        angular.extend($scope, methods);

    }
  })
})





wwApp.config(function($stateProvider) {
  $stateProvider.state('vestDynamic', {
    url: '/vestDynamic/:id',
    templateUrl: './frontend/components/vestManage/vestDynamic/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$stateParams) {
       // console.log($stateParams);
        var service = apiActions.list;
        var userId = $stateParams.id;
        var data ={
              userId:userId,
              current:1,
              size:10
        }

        var fictitiousContentList =function(){
            service.fictitiousContentList($.param(data))
          .then(function(res) {
            // console.log(res)
            $scope.fictitiousContent = res.data.data;
            var fictitiousContentList = res.data.data.list;
            $scope.fictitiousContentList = fictitiousContentList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        fictitiousContentList();




            //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            fictitiousContentList();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          fictitiousContentList();
        }
          //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }


        var methods = {
                //删除
        del:function(id){
          var $ctrl = this;
          $ctrl.animationsEnabled = true
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled, //打开时的动画开关
            templateUrl: './frontend/template/del.html',
            backdrop: 'static',
            windowClass: 'modal-music',
            controller: function($scope, $uibModalInstance, token) {
              // console.log(id);
              var date={
                      id:id,
                      state:1
                            }
                 $scope.sunSeal=function(){
                        service.ficUpdate($.param(date))
                            .then(function(res) {
                               console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                            toastr.success('操作成功！')
                             }
                              fictitiousContentList();
                            })  
                           
                          $uibModalInstance.close();
                  }
               $scope.close_modal = function() {
                $uibModalInstance.close();
                  }
              }
            })
          },
           //设为开放和设为隐私
                   topSet: function(id,i) {
                    // console.log(id,i)
                      if (i=="设为隐私") {
                        var data ={
                          id:id,
                          showOrHide:0

                        }
                        service.ficUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                              fictitiousContentList();
                            }
                          })
                           
                      }else if (i=="设为开放") {
                         var data ={
                          id:id,
                          showOrHide:1
                        }
                        service.ficUpdate($.param(data))
                          .then(function(res) {
                            console.log(res)
                            var result = res.data.code;
                            if (result == '499999') {
                              toastr.success('操作成功！')
                               fictitiousContentList();
                            }
                          }) 
                      };
                     
                  },
                   cc :function(id){
                      // console.log(id)
                       var url = './index.html#/vestComment/'+id.id;
                     // console.log(url);
                      window.open(url,'_blank');
                  }, 
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('vestEd', {
    url: '/vestEd/:id',
    templateUrl: './frontend/components/vestManage/vestEd/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,uploadBanner,$stateParams) {
        console.log($stateParams)
        var id = $stateParams.id;
        var service = apiActions.list;
        var data ={};
        $scope.cont = id;
      
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j
                .substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj['img'];;
    var name= sessionStorage.getItem('name')

     var newstr=returnValue.replace("%2F","/").replace("%2F","/").replace("%2F","/").replace("%2F","/").replace("%2F","/"); 
    $scope.newstr =newstr;
    $scope.name =name;
    var resa = function(){
        var changeDD = 1;//->一个全局变量
    function YYYYMMDDstart() {
        MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //先给年下拉框赋内容
        var y = new Date().getFullYear();
        for (var i = (y - 47); i < (y + 21); i++) //以今年为准，前30年，后30年
            document.reg_testdate.YYYY.options.add(new Option(" " + i + " 年", i));
        //赋月份的下拉框
        for (var i = 1; i < 13; i++)
            document.reg_testdate.MM.options.add(new Option(" " + i + " 月", i));
        document.reg_testdate.YYYY.value = y;
        document.reg_testdate.MM.value = new Date().getMonth() + 1;
        var n = MonHead[new Date().getMonth()];
        if (new Date().getMonth() == 1 && IsPinYear(YYYYvalue)) n++;
        writeDay(n); //赋日期下拉框
        //->赋值给日，为当天日期
//        document.reg_testdate.DD.value = new Date().getDate();
    }
    if (document.attachEvent)
        window.attachEvent("onload", YYYYMMDDstart);
    else
        window.addEventListener('load', YYYYMMDDstart, false);

    function YYYYDD(str) //年发生变化时日期发生变化(主要是判断闰平年)
    {
        var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value;
        if (MMvalue == "") {
//            var e = document.reg_testdate.DD;
            optionsClear(e);
            return;
        }
        var n = MonHead[MMvalue - 1];
        if (MMvalue == 2 && IsPinYear(str)) n++;
        writeDay(n)
    }

    function MMDD(str) //月发生变化时日期联动
    {
        var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value;
        if (YYYYvalue == "") {
            var e = document.reg_testdate.DD;
            optionsClear(e);
            return;
        }
        var n = MonHead[str - 1];
        if (str == 2 && IsPinYear(YYYYvalue)) n++;
        writeDay(n)
    }

    function writeDay(n) //据条件写日期的下拉框
    {
        var e = document.reg_testdate.DD;
        optionsClear(e);
        for (var i = 1; i < (n + 1); i++)
        {
            e.options.add(new Option(" " + i + " 日", i));
            if(i == changeDD){
                e.options[i].selected = true;  //->保持选中状态
            }
        }
    }

    function IsPinYear(year) //判断是否闰平年
    {
        return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
    }

    function optionsClear(e) {
        e.options.length = 1;
    }
    //->随时监听日的改变
    function DDD(str){
        changeDD = str;
    }
        }
        resa();
        var birthday = function (){
          AreaSelector().init();
          function getValue(id)
          {
            var sel = document.getElementById(id);
            if  (sel && sel.options)
            {
              alert(sel.options[sel.selectedIndex].value);
            }
          }

          function getText(id)
          {
            var sel = document.getElementById(id);
            if  (sel && sel.options)
            {
              alert(sel.options[sel.selectedIndex].text);
            }
          }
        }
        
        birthday();

          var uploadPic = function() {
              service.getQiniuToken(data)
                      .then(function(res) {
                        // console.log(res);
                        console.log(id)
                        var qiniuToken = res.data.data.token;
                        var cont = id;
                        if (qiniuToken) {
                          uploadBanner(qiniuToken, token, $scope)
                        }
                      })
             }
      uploadPic();

        var methods = {
           del:function(){
            window.open("","_self").close()
           },
           sat:function(nameCk,sex){
                console.log(nameCk,sex)
                $("#btn1").attr({ disabled: "disabled" });
          //省份
          var index = document.getElementById('sel_Province').selectedIndex;
          var index1 =document.getElementById('sel_City').selectedIndex;
          var b =parseInt(index);
          var c =parseInt(index1);
           var a=document.getElementById('sel_Province').options[b].text;
           var v=document.getElementById('sel_City').options[c].text;
           // console.log(a,v)
           //日期
           var yearIndex =document.getElementById('year').selectedIndex;
           var yearIn =parseInt(yearIndex);
           var year =document.getElementById('year').options[yearIn].text;
           var monthIndex =document.getElementById('month').selectedIndex;
           var monthIn =parseInt(monthIndex);
           var month =document.getElementById('month').options[monthIn].text;
           var dayIndex =document.getElementById('day').selectedIndex;
           var dayIn =parseInt(dayIndex);
           var day =document.getElementById('day').options[dayIn].text;
           var y1= parseInt(year);
           var y2 =parseInt(month);
           var y3 =parseInt(day);
           var birthday =y1+'-'+y2+'-'+y3
           console.log(nameCk,sex,a,v,birthday)
                 var data={
                  id:id,
                  birthday:birthday,
                  nickname:nameCk,
                  sex:sex,
                  province:a,
                  city:v
                }
               service.fictitiousUpdate($.param(data))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('修改成功！');
                  // setTimeout('window.open("","_self").close()',1000)
                  $uibModalInstance.close();
                }
          })
           }
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('vestImg', {
    url: '/vestImg/:id',
    templateUrl: './frontend/components/vestManage/vestImg/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$stateParams,uploadMusic,sunImg) {
       console.log($stateParams);
       console.log($scope)
        var service = apiActions.list;
        var userId = $stateParams.id;
        var data={};
        var ficTag = function() {
              service.ficTag(data)
                    .then(function(res) {
                      console.log(res)
                     $scope.ficTag = res.data.data.list;
                    })
             }
          ficTag();
          var ficMusic = function() {
               service.getQiniuToken(data)
                    .then(function(res) {
                      var qiniuToken = res.data.data.token;
                      if (qiniuToken) {
                        uploadMusic(qiniuToken, token, $scope)
                      }
                    })
             }
          ficMusic();
          var ficImg = function() {
               service.getQiniuToken(data)
                    .then(function(res) {
                      var qiniuToken = res.data.data.token;
                      if (qiniuToken) {
                        sunImg($scope,qiniuToken,token,userId)
                      }
                    })
             }
          ficImg(1);
        var methods = {
        
            del:function(){
            window.open("","_self").close()
           }         
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('vestWrite', {
    url: '/vestWrite/',
    templateUrl: './frontend/components/vestManage/vestWrite/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,uploadBanner) {

        var service = apiActions.list;
        var data ={};
  var resa = function(){
        var changeDD = 1;//->一个全局变量
    function YYYYMMDDstart() {
        MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //先给年下拉框赋内容
        var y = new Date().getFullYear();
        for (var i = (y - 47); i < (y + 21); i++) //以今年为准，前30年，后30年
            document.reg_testdate.YYYY.options.add(new Option(" " + i + " 年", i));
        //赋月份的下拉框
        for (var i = 1; i < 13; i++)
            document.reg_testdate.MM.options.add(new Option(" " + i + " 月", i));
        document.reg_testdate.YYYY.value = y;
        document.reg_testdate.MM.value = new Date().getMonth() + 1;
        var n = MonHead[new Date().getMonth()];
        if (new Date().getMonth() == 1 && IsPinYear(YYYYvalue)) n++;
        writeDay(n); //赋日期下拉框
        //->赋值给日，为当天日期
//        document.reg_testdate.DD.value = new Date().getDate();
    }
    if (document.attachEvent)
        window.attachEvent("onload", YYYYMMDDstart);
    else
        window.addEventListener('load', YYYYMMDDstart, false);

    function YYYYDD(str) //年发生变化时日期发生变化(主要是判断闰平年)
    {
        var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value;
        if (MMvalue == "") {
//            var e = document.reg_testdate.DD;
            optionsClear(e);
            return;
        }
        var n = MonHead[MMvalue - 1];
        if (MMvalue == 2 && IsPinYear(str)) n++;
        writeDay(n)
    }

    function MMDD(str) //月发生变化时日期联动
    {
        var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value;
        if (YYYYvalue == "") {
            var e = document.reg_testdate.DD;
            optionsClear(e);
            return;
        }
        var n = MonHead[str - 1];
        if (str == 2 && IsPinYear(YYYYvalue)) n++;
        writeDay(n)
    }

    function writeDay(n) //据条件写日期的下拉框
    {
        var e = document.reg_testdate.DD;
        optionsClear(e);
        for (var i = 1; i < (n + 1); i++)
        {
            e.options.add(new Option(" " + i + " 日", i));
            if(i == changeDD){
                e.options[i].selected = true;  //->保持选中状态
            }
        }
        console.log(i);
        console.log(changeDD);
    }

    function IsPinYear(year) //判断是否闰平年
    {
        return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
    }

    function optionsClear(e) {
        e.options.length = 1;
    }
    //->随时监听日的改变
    function DDD(str){
        changeDD = str;
    }
        }
        resa();
        var birthday = function (){
          AreaSelector().init();
          function getValue(id)
          {
            var sel = document.getElementById(id);
            if  (sel && sel.options)
            {
              alert(sel.options[sel.selectedIndex].value);
            }
          }

          function getText(id)
          {
            var sel = document.getElementById(id);
            if  (sel && sel.options)
            {
              alert(sel.options[sel.selectedIndex].text);
            }
          }
        }
        
        birthday();

         var uploadPic = function() {
              service.getQiniuToken(data)
                      .then(function(res) {
                        console.log(res);
                        var qiniuToken = res.data.data.token;
                        if (qiniuToken) {
                          uploadBanner(qiniuToken, token, $scope)
                        }
                      })
             }
      uploadPic();

        var methods = {
           del:function(){
            window.open("","_self").close()
           }
        }
        angular.extend($scope, methods);

    }
  })
})

wwApp.config(function($stateProvider) {
  $stateProvider.state('vestComment', {
    url: '/vestComment/:id',
    templateUrl: './frontend/components/vestManage/vestDynamic/vestComment/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,$stateParams) {
       console.log($stateParams);
        var service = apiActions.list;
        var contentId = $stateParams.id;
        var data ={
              contentId:contentId,
              current:1,
              size:10
        }

        var ficComment =function(){
            service.ficComment($.param(data))
          .then(function(res) {
            console.log(res)
            $scope.ficComment = res.data.data;
            var ficCommentList = res.data.data.list;
            $scope.ficCommentList = ficCommentList;
            $scope.pageTotal = res.data.data.total;
            $scope.pageCurrent = res.data.data.current;
            $scope.pages = res.data.data.pages*10 ;
          })
        }
        ficComment();




            //分页
        $scope.jumpPage = function(pageNum){
            
            data.current = pageNum;
            ficComment();
        }
        $scope.pageChanged = function(pageNum) {
          data.current  = pageNum;
          ficComment();
        }
          //点击图片时放大显示图片  
        $scope.changePic = function($event){  
            var img=$event.srcElement || $event.target;   
            $("#bigimage").attr('src',img.src);  
            $("#js-imgview").css("display",'block');  
            $("#js-imgview-mask").css("display",'block');
        }  
      //点击图片时放小显示图片  
        $scope.closePic =function(){ 
            $("#js-imgview").css("display",'none');  
            $("#js-imgview-mask").css("display",'none');  
        }


        var methods = {
            comment: function(user,ans,par,tag,con,name) {
              console.log(user,ans,par,tag,con,name)
              var $ctrl = this;
              $ctrl.animationsEnabled = true
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled, //打开时的动画开关
                templateUrl: './frontend/template/comment.html',
                backdrop: 'static',
                windowClass: 'modal-now',
                controller: function($scope, $uibModalInstance) {
                      $scope.sunSeal = function(names) {
                      // console.log(id,names)
                      $("#btn1").attr({ disabled: "disabled" });
                      var data={
                         content:names,
                         tagId:tag,
                         userId:user,
                         answeredUserId:ans,
                         parentId:par,
                         contentId:con,
                         nickname:name
                      };
                    service.ficCommentAdd($.param(data))
                      .then(function(res) {
                        console.log(res)
                        if (res.data.msg == '成功.') {
                          toastr.success('添加成功！');
                          // window.location.reload()

                          $uibModalInstance.close();
                        }
                      })
             },
                  $scope.close_modal = function() {
                    $uibModalInstance.close();
                  }
                }
              })
        },  
          
        }
        angular.extend($scope, methods);

    }
  })
})
