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
