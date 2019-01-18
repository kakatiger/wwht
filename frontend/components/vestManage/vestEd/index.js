wwApp.config(function($stateProvider) {
  $stateProvider.state('vestEd', {
    url: '/vestEd/:id',
    templateUrl: './frontend/components/vestManage/vestEd/index.html',
    controller: function($scope,$state, apiActions, $uibModal, token,baseUrl,uploadBanner,$stateParams) {
        console.log($stateParams)
        var id = $stateParams.id;
        var service = apiActions.list;
        var data ={};
        $scope.cont = id;
      
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j
                .substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj['img'];;
    var name= sessionStorage.getItem('name')

     var newstr=returnValue.replace("%2F","/").replace("%2F","/").replace("%2F","/").replace("%2F","/").replace("%2F","/"); 
    $scope.newstr =newstr;
    $scope.name =name;
    var resa = function(){
        var changeDD = 1;//->一个全局变量
    function YYYYMMDDstart() {
        MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //先给年下拉框赋内容
        var y = new Date().getFullYear();
        for (var i = (y - 47); i < (y + 21); i++) //以今年为准，前30年，后30年
            document.reg_testdate.YYYY.options.add(new Option(" " + i + " 年", i));
        //赋月份的下拉框
        for (var i = 1; i < 13; i++)
            document.reg_testdate.MM.options.add(new Option(" " + i + " 月", i));
        document.reg_testdate.YYYY.value = y;
        document.reg_testdate.MM.value = new Date().getMonth() + 1;
        var n = MonHead[new Date().getMonth()];
        if (new Date().getMonth() == 1 && IsPinYear(YYYYvalue)) n++;
        writeDay(n); //赋日期下拉框
        //->赋值给日，为当天日期
//        document.reg_testdate.DD.value = new Date().getDate();
    }
    if (document.attachEvent)
        window.attachEvent("onload", YYYYMMDDstart);
    else
        window.addEventListener('load', YYYYMMDDstart, false);

    function YYYYDD(str) //年发生变化时日期发生变化(主要是判断闰平年)
    {
        var MMvalue = document.reg_testdate.MM.options[document.reg_testdate.MM.selectedIndex].value;
        if (MMvalue == "") {
//            var e = document.reg_testdate.DD;
            optionsClear(e);
            return;
        }
        var n = MonHead[MMvalue - 1];
        if (MMvalue == 2 && IsPinYear(str)) n++;
        writeDay(n)
    }

    function MMDD(str) //月发生变化时日期联动
    {
        var YYYYvalue = document.reg_testdate.YYYY.options[document.reg_testdate.YYYY.selectedIndex].value;
        if (YYYYvalue == "") {
            var e = document.reg_testdate.DD;
            optionsClear(e);
            return;
        }
        var n = MonHead[str - 1];
        if (str == 2 && IsPinYear(YYYYvalue)) n++;
        writeDay(n)
    }

    function writeDay(n) //据条件写日期的下拉框
    {
        var e = document.reg_testdate.DD;
        optionsClear(e);
        for (var i = 1; i < (n + 1); i++)
        {
            e.options.add(new Option(" " + i + " 日", i));
            if(i == changeDD){
                e.options[i].selected = true;  //->保持选中状态
            }
        }
    }

    function IsPinYear(year) //判断是否闰平年
    {
        return (0 == year % 4 && (year % 100 != 0 || year % 400 == 0));
    }

    function optionsClear(e) {
        e.options.length = 1;
    }
    //->随时监听日的改变
    function DDD(str){
        changeDD = str;
    }
        }
        resa();
        var birthday = function (){
          AreaSelector().init();
          function getValue(id)
          {
            var sel = document.getElementById(id);
            if  (sel && sel.options)
            {
              alert(sel.options[sel.selectedIndex].value);
            }
          }

          function getText(id)
          {
            var sel = document.getElementById(id);
            if  (sel && sel.options)
            {
              alert(sel.options[sel.selectedIndex].text);
            }
          }
        }
        
        birthday();

          var uploadPic = function() {
              service.getQiniuToken(data)
                      .then(function(res) {
                        // console.log(res);
                        console.log(id)
                        var qiniuToken = res.data.data.token;
                        var cont = id;
                        if (qiniuToken) {
                          uploadBanner(qiniuToken, token, $scope)
                        }
                      })
             }
      uploadPic();

        var methods = {
           del:function(){
            window.open("","_self").close()
           },
           sat:function(nameCk,sex){
                console.log(nameCk,sex)
                $("#btn1").attr({ disabled: "disabled" });
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
           console.log(nameCk,sex,a,v,birthday)
                 var data={
                  id:id,
                  birthday:birthday,
                  nickname:nameCk,
                  sex:sex,
                  province:a,
                  city:v
                }
               service.fictitiousUpdate($.param(data))
                  .then(function(res) {
                console.log(res)
                if (res.data.msg == '成功.') {
                  toastr.success('修改成功！');
                  // setTimeout('window.open("","_self").close()',1000)
                  $uibModalInstance.close();
                }
          })
           }
        }
        angular.extend($scope, methods);

    }
  })
})
