//左右触摸滑动效果事件
var status = 0;
var start_x;
var end_x;
$("#z").css("background", "#AEEEEE");

function touch(event) {
    switch (event.type) {
        case "touchstart":
            start_x = event.touches[0].clientX;
            break;
        case "touchend":
            end_x = event.changedTouches[0].clientX;
            var moving_x = end_x - start_x;
            start_x = 0;
            end_x = 0;
            if (moving_x > 100) {
                if (status == 0) {
                    status = 1;
                    $(".slide").animate({
                        left: '0%'
                    })
                    $("#l").css("background", "#AEEEEE");
                    $("#z").css("background", "");
                    $("#r").css("background", "");
                } else if (status == -1) {
                    status = 0;
                    $(".slide").animate({
                        left: '-100%'
                    })
                    $("#z").css("background", "#AEEEEE");
                    $("#l").css("background", "");
                    $("#r").css("background", "");
                }
            }
            if (moving_x < -100) {
                if (status == 0) {
                    status = -1;
                    $(".slide").animate({
                        left: '-200%'
                    })
                    $("#r").css("background", "#AEEEEE");
                    $("#z").css("background", "");
                    $("#l").css("background", "");
                } else if (status == 1) {
                    status = 0;
                    $(".slide").animate({
                        left: '-100%'
                    });
                    $('#z').css("background", "#AEEEEE");
                    $("#l").css("background", "");
                    $("#r").css("background", "");
                }
            }
    }
}
$(document).ready(function() {
    var music_player = $("#music_player")[0]; //声明DOM音频播放对象
    var music_infos; //声明所有音频数据
    var cur_idx = 0; //声明默认下标为0
    //请求服务器上所有音频数据，返回JSON对象
    $.getJSON("http://123.207.123.37/music_player_backstage/test.php", function(rsp) {
        music_infos = rsp;
        for (var idx in music_infos) {
            var music_info = music_infos[idx];
            var music = $("<li class = 'muisc'></li>");
            music.attr("id", idx);
            music.text(music_info["name"]);
            $("#music_list").append(music);
        }
        if (music_infos.length > 0) {
            music_player.src = music_infos[0]["mp3"];
        }
        $("samp").text("(" + $('#music_list').children().length + ")");
    });
    //播放cur_idx下标指定音频函数
    function play_other_music() {
        if (music_infos.length > cur_idx) {
            var music_info = music_infos[cur_idx];
            music_player.src = music_info["mp3"];
            play_music();
        }
    }
    //开始播放函数
    function play_music() {
        music_player.play();
        $('#play').css("background", "url(img/Pause.png) no-repeat");
        $('#play').css("background-size", "100% 100%");
    }
    //点击指定音频事件回调函数
    $("#music_list").on("click", function(event) {
        cur_idx = parseInt(event.target.id);
        play_other_music();
    });
    //播放开始事件回调函数
    music_player.onplay = function() {
            $("#music_list").children().css("color", "");
            $("#" + cur_idx).css("color", "#ADD8E6");
            if (music_infos != null) {
                $("#underway").text("正在播放：");
                $("#music_title").text(music_infos[cur_idx]["name"]);
            } else {
                $("#music_title").text("正在加载中，请稍等。。。");
            }
        }
        //播放结束事件回调函数
    music_player.onended = function() {
            if (cur_idx == music_infos.length - 1) {
                cur_idx = 0;
            } else {
                cur_idx = cur_idx + 1;
            }
            play_other_music();
        }
        //当前音频播放进度事件回调函数
    music_player.ontimeupdate = function() {
            if (music_player.readyState == 4) {
                $('#progress')[0].value = music_player.currentTime;
                $('#progress')[0].max = music_player.duration;
                $("#current_time").text(Math.floor(music_player.currentTime / 60) + ":" + Math.floor(music_player.currentTime % 60));
                $("#duration").text(Math.floor(music_player.duration / 60) + ":" + Math.floor(music_player.duration % 60));
                $(".head_portrait").animate({
                    deg: 0
                }, {
                    step: function(n, fx) {
                        $(".head_portrait").css({
                            transform: "rotate(" + music_player.currentTime * 10 + "deg)"
                        });
                    }
                });
            }
        }
        //点击播放按钮事件函数
    $("#play").click(function() {
        if (music_player.paused == false) {
            music_player.pause();
            $('#play').css("background", "url(img/Play-1.png) no-repeat");
            $('#play').css("background-size", "100% 100%");
        } else {
            play_music();
        }
    });

    //点击上一曲按钮事件函数
    $("#pre").click(function() {
        if (music_infos.length > 0) {
            if (cur_idx == 0) {
                cur_idx = music_infos.length - 1;
            } else {
                cur_idx = cur_idx - 1;
            }
            play_other_music();
        }
    });
    //点击下一曲按钮事件函数
    $("#next").click(function() {
        if (cur_idx == music_infos.length - 1) {
            cur_idx = 0;
        } else {
            cur_idx = cur_idx + 1;
        }
        play_other_music();
    });
});
