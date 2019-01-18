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