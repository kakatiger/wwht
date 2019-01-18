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