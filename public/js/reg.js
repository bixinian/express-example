function checkpwd() {
    var pwd = document.getElementById('pwd').value
    var repwd = document.getElementById('repwd').value

    if (pwd != repwd) {
        document.getElementsByClassName('err')[0].style.display = "flex"
        document.getElementsByClassName("registerbtn")[0].disabled = true
    } else {
        document.getElementsByClassName('err')[0].style.display = "none"
        document.getElementsByClassName("registerbtn")[0].disabled = false
    }
}

$(document).ready(function () {
    $('#signform').on('submit', function () {
        var username = document.getElementById('username').value
        var password = document.getElementById('pwd').value
        var qq = document.getElementById('qq').value

        $.ajax({
            type: "post",
            url: "/api/reg",
            dataType: "json",
            data: { username: username, qq: qq, password: password },
            success: function (data) {
                if (data) {
                    if (data.code != "0") {
                        swal("出现错误！", data.msg, "error");
                    } else {
                        swal("注册成功！", "即将跳转登录页", "success",)
                            .then(
                                function () { window.location = "/login.html" }
                            )
                    }
                }
            }
        });
    });
});
