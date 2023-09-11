$(document).ready(function() {
    $.ajax({
        type: "post",
        url: "/api/userinfo",
        dataType: "json",
        data: {  },
        success: function (data) {
            if (data) {
                if (data.code != "0") {
                    swal("获取失败！", data.msg, "error").then(function(){ window.location = "/login.html" });
                } else {
                    document.getElementById('username').value = data.username
                    document.getElementById('qq').value = data.qq
                    document.getElementById('img').src= 'https://q.qlogo.cn/g?b=qq&nk='+data.qq+'&s=100'
                }
            }
        }
    });
    $('#logout').click(function() {
        $.ajax({
            type: "post",
            url: "/api/logout",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data) {
                    if (data.code = "0") {
                        swal(data.msg, "即将跳转首页", "success")
                        .then(function(){ window.location = "/login.html" })
                    }
                }
            }
        });
    })
    $('#resetpwd').click(function() {
        swal({
            title: "请输入新密码",
            content: {
                element: "input",
                attributes: {
                  placeholder: "请输入6-20位字符",
                  type: "password",
                },
            },
            buttons: ["取消", "确定"],
        },)
        .then(function(value) {
            if (value.length > 5 && value.length < 20) {
                $.ajax({
                    type: "post",
                    url: "/api/resetpwd",
                    dataType: "json",
                    data: { newpwd: value },
                    success: function (data) {
                        if (data) {
                            if (data.code == 0) {
                                swal("操作成功", data.msg, "success")
                            } else {
                                swal("操作失败", data.msg, "error")
                            }
                        }
                    }
                });
            } else {
                swal("数据出错！", "请重新输入", "error")
            }
        })
    })
})
$(document).ready(function (){
    $.ajax({
      url: 'http://127.0.0.1/api/userlist',
      type: "GET",
      success: function(data) {
        console.log(data.rows[0])
        var username = []
        var qq = []
        var id = []
        for(var i = 0; i<data.total; i++) {
          id[i] = data.rows[i].id
          username[i] = data.rows[i].username
          qq[i] = data.rows[i].qq
        }
        var user = [id,username,qq]
        console.log(id)

        for(var i=0; i<id.length; i++) {
          $('#form').append('<tr><td>'+id[i]+'</td><td>'+username[i]+'</td><td>'+qq[i]+'</td></tr>')
        }
      }
    })
})