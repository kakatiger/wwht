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
