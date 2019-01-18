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
