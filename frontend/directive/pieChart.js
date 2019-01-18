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

