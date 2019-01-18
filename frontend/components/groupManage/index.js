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
