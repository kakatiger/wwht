service.factory("sunImg", function($http) {
  var sunImg = function($scope,qiniuToken,token,userId) {

    console.log(userId)
    var id = userId;
    var urlArr = [];
    // console.log($http)
    
    // console.log(b)
    var uploader = WebUploader.create({
      auto: true,
      server: 'http://upload.qiniu.com/?token=' + qiniuToken,
      pick: pickfiles,
    });
    uploader.on('filesQueued', function(file) {
        // console.log(file)
       
    });

    uploader.on('uploadSuccess', function(file, response) {

      // console.log(file)

      var fileId =file.id;
      // console.log(fileId)
      var url = 'http://resouce.dongdongwedding.com/' + response.key
      console.log(urlArr);
     //  console.log(22 + url);
     // if (-1 === urlArr.indexOf(url) || urlArr.length == 0) {
     //    urlArr.push(url);
     // }else{
     //      return;
     // };
      urlArr.push(url);
      
      var num =1;
      var arr = [];
      for (var i=0; i<urlArr.length; i++) {
        var obj = {
                      "mediaType":3,
                      // "picOrder":num++,
                      "url": urlArr[i]
                      // "url":b
                  }

        arr.push(obj);
      }
     
      // console.log(arr)
      var finImg = arr;
      $('#sun_img').empty();
    finImg.forEach(function(e){  
        var cImg = e.url
        // console.log(cImg)
        var str =` <div class='sunUrl'><img  src="  ${cImg}  "><span class="glyphicon glyphicon-remove f28" style=" color: rgb(255, 0, 0); " > </span></div>`  
        $('#sun_img').append(str);
    }) 
     
        $(".glyphicon").click(function () {
            $(this).parent().remove();
            var i = $(this).parent().index()
              console.log(i)
            urlArr.splice(i,1);
             arr.splice(i,1);
          
           if (arr.length < 9) {
            $('#pickfiles').show();
            };


          });

      if (arr.length == 9) {
      alert("只能上传9张图片");

     }
         $scope.hair =function(tag,names){  
              if (arr.length > 9) {
              alert("只能上传9张图片");

               }else{
                    console.log(tag,names)
                    var index = document.getElementById('tag').selectedIndex;
                    var b =parseInt(index);
                    var tagName=document.getElementById('tag').options[b].text;
                    var vestAudio =$('#advAudio')[0].src
                  var cont ={
                      "mediaType":1,
                      "url": vestAudio
                  }
                  if (vestAudio!='') {
                     arr.push(cont);
                  };
                 
                var date={
                          userId:id,
                          content:names,
                          tagId:tag,
                          tagName:tagName,
                          contentMedias:arr
                        }
               $http.post('http://wangsocial.com:8084/admin/fictitious/content/add' , date , {
                        headers : { 'Content-Type' :  "application/json;charset=UTF-8","Authorization":token}
                    }).then(function(result) {
                        console.log(result)
                        if (result.data.msg == '成功.') {
                        toastr.success('发布成功！');
                       setTimeout('window.open("","_self").close()',1000)
                      }
                        //...
                    }).catch(function( result) {
                        //...
                    });
               }
                
            }       

    });
    uploader.on('uploadError', function(file, response) {
      console.log(file, response, "none")

    });
  }
  return sunImg;
});
