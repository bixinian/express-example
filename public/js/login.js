$(document).ready(function () {
    $('#loginform').on('submit', function () {
        var username = document.getElementById('username').value
        var password = document.getElementById('pwd').value

        $.ajax({
            type: "post",
            url: "/api/login",
            dataType: "json",
            data: { username: username, password: password },
            success: function (data) {
                if (data) {
                    if (data.code != "0") {
                        swal("登录失败！", data.msg, "error");
                    } else {
                        swal("登录成功！", "即将跳转用户页", "success",)
                            .then(
                                function () { window.location = "/index.html" }
                            )
                    }
                }
            }
        });
    });
});
