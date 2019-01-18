service.factory("uploadStr", function(apiActions) {
  var service = apiActions.list;
  var uploadStr = function(qiniuToken, token, $scope,list) {
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: bannerimg,
    });

    uploader.on('fileQueued', function(file) {

      // 创建缩略图
      // 如果为非图片文件，可以不用调用此方法。
      // thumbnailWidth x thumbnailHeight 为 100 x 100
      uploader.makeThumb(file, function(error, src) {
        console.log(src)
        console.log(error)
        if (error) {
          $('#advimg').replaceWith('<span>不能预览</span>');
          return;
        }
        $('#addIcon').css('display','none')
        $('#cover').css('display','block')
        $('#abc').css('background-image', 'url(' + src + ')');
      }, 1, 1);
    });

    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
      
   
    
        // $scope.set =function(name,sex){
         
        //         var date={
        //           birthday:birthday,
        //           nickname:name,
        //           sex:sex,
        //           province:a,
        //           city:v,
        //           avatar:'http://resouce.dongdongwedding.com/' + response.key
        //         }
        //        service.fictitiousAdd($.param(date))
        //           .then(function(res) {
        //         console.log(res)
        //         if (res.data.msg == '成功.') {
        //           toastr.success('添加成功！');
        //           $("#btn1").attr({ disabled: "disabled" });
        //           setTimeout('window.open("","_self").close()',1000)
        //           $uibModalInstance.close();
        //         }
        //   })
        //       }
             // $scope.del = function(){
             //  console.log(11)
             //    window.open("","_self").close()
             // }
    });

    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadStr;
});
