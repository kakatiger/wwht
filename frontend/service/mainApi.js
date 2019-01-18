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
