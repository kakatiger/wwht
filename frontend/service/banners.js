// 上传图片
service.factory("uploadBanners", function(apiActions) {
  var service = apiActions.list;
  var uploadBanners = function(qiniuToken, token, $scope,$uibModalInstance,list,id) {
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: bannerimg,
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
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
        $('#bannerimg').css('background-image', 'url(' + src + ')');
      }, 1, 1);
    });
    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
      $('#cover').css('display','none')
      $scope.bannerIncrease = function(val,time,startTime,endTime,linkUrl,linkType,tagId) {
        
        console.log(val,time)
      	var data={
          billboardName:val,
          time:time,
          startTime:startTime,
          endTime:endTime,
          linkUrl:linkUrl,
          linkType:linkType,
          tagId:tagId,
          state:2,
      		picUrl:'http://resouce.dongdongwedding.com/' + response.key,
          };
          if($scope.goType=='jh'){
              data.linkType='3'
          }else{
              data.tagId=undefined
          }
          if(data.time && data.billboardName && data.picUrl){
               service.startUpdate($.param(data))
                  .then(function(res) {
                if (res.data.msg == '成功.') {
                  toastr.success('添加成功！');
                  $uibModalInstance.close();
                   setTimeout('window.location.reload()',2000)
                }else  {
                              alert("添加失败");
                            };
          })
        }else{
            alert('名称，持续时间，图片为必填内容')
        }
      },
 
    $scope.abc =function(id,url,billboardName,time,startTime,endTime,linkUrl,linkType,tagId){
            var date={
                billboardId:id,
                billboardName:billboardName,
                time:time,
                startTime:startTime,
                endTime:endTime,
                linkUrl:linkUrl,
                linkType:linkType,
                tagId:tagId,
                picUrl:'http://resouce.dongdongwedding.com/' + response.key,
            }
            if($scope.goType=='jh'){
                data.linkType='3'
            }else{
                date.tagId=undefined
            }
            console.log(date)
            if($scope.time && $scope.billboardName){
                service.startUpdate($.param(date))
                    .then(function(res) {
                    if (res.data.msg == '成功.') {
                    toastr.success('修改成功！');
                    $uibModalInstance.close();
                    setTimeout('window.location.reload()',1000)
                    
                    }else{
                            alert("修改失败");
                        };
                    })
            }else{
                alert('名称，持续时间为必填内容')
                }
        }
    });
    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadBanners;
});
