
(function () {
    var loadImages = function (Parameter) {
        var sources = Parameter.loadArr;
        var loadingPercent = "";
        var count = 0;
        var images = {};
        var imgNum = sources.length;
        for (var src in sources) {
            var path = src;
            images[path] = new Image();
            images[path].onload = function () {
                count++;
                if (count >= imgNum) {
                    Parameter.complete(images);
                }
            };
            images[path].onerror = function () {
                count++;
                if (count >= imgNum) {
                    Parameter.complete(images);
                }
            };
            images[path].src = sources[path];
        }
    };

$(document).ready(function () {
	var info = $(".info");
	var process = $(".process");
	var settings = $(".settings");

	var framePlayer;

	var imgArr = [];
	for (var i = 0; i < 62; i++) {
		imgArr.push("../images/frame/video_0/" + i + ".jpg");
	}

	loadImages({
		loadArr: imgArr,
		complete: function () {

			framePlayer = new vFramePlayer({
				dom: $(".framePlayer")[0],
				imgArr: imgArr,
				loop: -1,
				yoyo: false,
				useCanvas: true
			});

			framePlayer.goto(framePlayer.get("startFrame"));

			var default_set = function () {
				settings.find(".yoyo").attr("checked", framePlayer.get("yoyo"));
				settings.find(".times").val(framePlayer.get("loop"));
				settings.find(".fps").val(framePlayer.get("fps"));
				settings.find(".start").val(framePlayer.get("startFrame")).attr("max", imgArr.length - 1);
				settings.find(".end").val(framePlayer.get("endFrame")).attr("max", imgArr.length - 1);
				var mode_id = framePlayer.get("useCanvas") ? 0 : 1;
				settings.find(".mode[name='mode']").eq(mode_id).attr('checked', 'true');
			};

			default_set();

			framePlayer.on("play", function () {
				console.log("开始播放");
				$(".start").attr("disabled", true).addClass("disabled");
				$(".end").attr("disabled", true).addClass("disabled");
				default_set();
			});

			framePlayer.on("stop", function () {
				console.log("停止播放");
				$(".start").attr("disabled", false).removeClass("disabled");
				$(".end").attr("disabled", false).removeClass("disabled");
			});

			framePlayer.on("pause", function () {
				console.log("暂停播放");
			});

			framePlayer.on("update", function (frame, times, asc) {
//                  console.log(frame,times,asc);
				info.find(".curFrame").find("span").text(frame);
				info.find(".times").find("span").text(times);
				info.find(".asc").find("span").text(asc);
				info.find(".fps").find("span").text(framePlayer.get("fps"));

				var process_total = imgArr.length - 1;
				var a = 100 / process_total;
				process.css({"width": frame * a + "%"});
            });
            

             framePlayer.set("fps",16);
             framePlayer.play();


			$(".fa-play").on("click", function () {
				var fps = settings.find(".fps").val();
				var yoyo = settings.find(".yoyo").is(':checked');
				var start = settings.find(".start").val();
				var end = settings.find(".end").val();
				var $selectedvalue = settings.find("input[name='mode']:checked").val();
				var useCanvas = $selectedvalue === "true";
				framePlayer.play(start, end, {
					"fps": fps, "yoyo": yoyo, "useCanvas": useCanvas, onComplete: function () {
//                      console.log("完成播放");
					}, onUpdate: function (frame, times, asc) {
//                      console.log(frame,times,asc);
					}
				});
			});

			$(".fa-pause").on("click", function () {
				framePlayer.pause();
			});

			$(".fa-stop").on("click", function () {
				framePlayer.stop();
			});

			$(".fa-backward").on("click", function () {
				var fps = framePlayer.get("fps");
				if (Math.round(fps / 1.5) > 0) {
					framePlayer.set("fps", Math.round(fps / 1.5));
				}
			});

			$(".fa-forward").on("click", function () {
				var fps = framePlayer.get("fps");
				if (Math.round(fps * 1.5) < 60) {
					framePlayer.set("fps", Math.round(fps * 1.5));
				}
			});

			$(".mode").on("change", function () {
				var $selectedvalue = $("input[name='mode']:checked").val();
				var useCanvas = $selectedvalue === "true";
				framePlayer.set("useCanvas", useCanvas);
			});

			$(".times").on("change", function () {
				var times = $(this).val();
				framePlayer.set("loop", times);
			});

			$(".start").on("change", function () {
				var start = $(this).val();
				framePlayer.set("startFrame", start);
			});

			$(".end").on("change", function () {
				var end = $(this).val();
				framePlayer.set("endFrame", end);
			});

			$(".fps").on("change", function () {
				var fps = $(this).val();
				framePlayer.set("fps", fps);
			});

			$(".yoyo").on("change", function () {
				var yoyo = $(this).is(':checked');
				framePlayer.set("yoyo", yoyo);
			});
		}
	});

});
    // function chooseVideoPng(){ 
    //     var animations = ['app_start_black'];
    //     var i, len = animations.length;
    //     for(i = 0; i < len; i += 1) {
            
    //         var urlRoot = 'video_png/'+ animations[i]+'/';
    //         var indexRange = [1, 62];
    //         var maxLength = indexRange[1] - indexRange[0] + 1;
    //         // loading
    //         var eleContainer = document.getElementById('video_'+animations[i])
    //         var eleLoading = document.getElementsByClassName('loading');
    //         // 存储预加载的DOM对象和长度信息
    //         var store = {
    //             length: 0
    //         };
    //         // 图片序列预加载
    //         for ( var start = indexRange[0]; start <= indexRange[1]; start++) {
    //             (function (index) {
    //                 var img = new Image();
    //                 img.onload = function () {
    //                     store.length++;
    //                     // 存储预加载的图片对象
    //                     store[index] = this;
    //                     play(this);
    //                     console.log(this)
    //                 };
    //                 img.onerror = function () {
    //                     store.length++;
    //                     play(this);
    //                 };
    //                 img.src = urlRoot + index + '.png';
    //             })(start);
    //         }
    //         var play = function () {
    //             // loading进度
    //             var percent = Math.round(100 * store.length / maxLength);
    //             console.log('store.length='+store.length);
    //             console.log('maxlength='+maxLength);
    //             console.log('percent='+percent);
    //             //eleLoading.setAttribute('data-percent', percent);
    //             eleLoading['data-percent'] = percent;
    //             //eleLoading.style = 'background-size:'+ percent% '100'

                
    //             // 全部加载完毕，无论成功还是失败
    //             if (percent == 100) {
    //                 var index = indexRange[0];
    //                  //eleContainer.innerHTML = 
    //                 // 依次append图片对象
    //                 var step = function () {
    //                     var framePrevious = store[index-1];
    //                     var frameNow = store[index];
    //                     console.log(frameNow)
    //                     if (store[index - 1]) {
    //                         eleContainer.removeChild(framePrevious);
    //                     }
    //                     eleContainer.appendChild(frameNow);
    //                     // 序列增加
    //                     index++;
    //                     // 如果超过最大限制
    //                     if (index <= indexRange[1]) {
    //                         setTimeout(step, 42);
    //                     } else {
    //                         // 本段播放结束回调
    //                         // 我这里就放一个重新播放的按钮
    //                         eleContainer.insertAdjacentHTML('beforeEnd', '<button onclick="play()">再看一遍英姿</button>');
    //                     }
    //                 };
    //                 // 等100%动画结束后执行播放
    //                 setTimeout(step, 100);
    //             }
    //         };
            

            
                 
    //     }
    // };
    
    // chooseVideoPng();




    })();







