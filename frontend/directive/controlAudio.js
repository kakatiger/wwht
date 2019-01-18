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
