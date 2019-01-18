service.factory("uploadBanner", function(apiActions) {
  var service = apiActions.list;
  var uploadBanner = function(qiniuToken, token, $scope,list) {
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
        $('#bannerimg').css('background-image', 'url(' + src + ')');
      }, 1, 1);
    });

    uploader.on('uploadSuccess', function(file, response) {
      console.log(response)
      $('#cover').css('display','none')
      $scope.sat = function(name,sex,cont) {
          //省份
          var index = document.getElementById('sel_Province').selectedIndex;
          var index1 =document.getElementById('sel_City').selectedIndex;
          var b =parseInt(index);
          var c =parseInt(index1);
           var a=document.getElementById('sel_Province').options[b].text;
           var v=document.getElementById('sel_City').options[c].text;
           // console.log(a,v)
           //日期
           var yearIndex =document.getElementById('year').selectedIndex;
           var yearIn =parseInt(yearIndex);
           var year =document.getElementById('year').options[yearIn].text;
           var monthIndex =document.getElementById('month').selectedIndex;
           var monthIn =parseInt(monthIndex);
           var month =document.getElementById('month').options[monthIn].text;
           var dayIndex =document.getElementById('day').selectedIndex;
           var dayIn =parseInt(dayIndex);
           var day =document.getElementById('day').options[dayIn].text;
           var y1= parseInt(year);
           var y2 =parseInt(month);
           var y3 =parseInt(day);
           var birthday =y1+'-'+y2+'-'+y3
        // console.log(name,sex,cont)
      	var data={
                  id:cont,
                  birthday:birthday,
                  nickname:name,
                  sex:sex,
                  province:a,
                  city:v,
                  avatar:'http://resouce.dongdongwedding.com/' + response.key
      	};
      	console.log(data)
        service.fictitiousUpdate($.param(data))
          .then(function(res) {
            console.log(res)
            if (res.data.msg == '成功.') {
              toastr.success('添加成功！');
              $("#btn1").attr({ disabled: "disabled" });
              setTimeout('window.open("","_self").close()',1000)
              $uibModalInstance.close();
            }
          })
      },
    
        $scope.set =function(name,sex){
         
          //省份
          var index = document.getElementById('sel_Province').selectedIndex;
          var index1 =document.getElementById('sel_City').selectedIndex;
          var b =parseInt(index);
          var c =parseInt(index1);
           var a=document.getElementById('sel_Province').options[b].text;
           var v=document.getElementById('sel_City').options[c].text;
           // console.log(a,v)
           //日期
           var yearIndex =document.getElementById('year').selectedIndex;
           var yearIn =parseInt(yearIndex);
           var year =document.getElementById('year').options[yearIn].text;
           var monthIndex =document.getElementById('month').selectedIndex;
           var monthIn =parseInt(monthIndex);
           var month =document.getElementById('month').options[monthIn].text;
           var dayIndex =document.getElementById('day').selectedIndex;
           var dayIn =parseInt(dayIndex);
           var day =document.getElementById('day').options[dayIn].text;
           var y1= parseInt(year);
           var y2 =parseInt(month);
           var y3 =parseInt(day);
           var birthday =y1+'-'+y2+'-'+y3
           console.log(birthday,a,v,name,sex)
           
                var date={
                  birthday:birthday,
                  nickname:name,
                  sex:sex,
                  province:a,
                  city:v,
                  avatar:'http://resouce.dongdongwedding.com/' + response.key
                }
               service.fictitiousAdd($.param(date))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('添加成功！');
                  $("#btn1").attr({ disabled: "disabled" });
                  setTimeout('window.open("","_self").close()',1000)
                  $uibModalInstance.close();
                }
          })
              }
             $scope.del = function(){
              console.log(11)
                window.open("","_self").close()
             }
    });

    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")
    });
  }
  return uploadBanner;
});
