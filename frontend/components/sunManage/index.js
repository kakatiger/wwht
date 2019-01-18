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




