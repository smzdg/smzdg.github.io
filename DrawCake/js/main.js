import { drawCanvas } from './draw_IMG.js';
import { dragDecoration } from './drag.js';

function replaceSvgImages() {
    // 创建一个 Promise 对象并返回它
    return new Promise(function (resolve, reject) {
        var promises = [];
        jQuery('img.svg').each(function () {
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            // 创建一个 Promise 对象，并将它添加到 promises 数组中
            var promise = jQuery.get(imgURL, function (data) {
                var $svg = jQuery(data).find('svg');
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns:a');
                if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
                }
                $img.replaceWith($svg);
            }, 'xml');

            // 将 promise 添加到 promises 数组中
            promises.push(promise);
        });

        // 在所有 Promise 对象都执行完毕之后调用 resolve() 方法
        Promise.all(promises).then(function () {
            resolve();
        }).catch(function (error) {
            reject(error);
        });
    });
}

replaceSvgImages().then(function () {
    console.log('All SVG images have been replaced!');
    const drawCanva = new drawCanvas();
    const MydragDecoration = new dragDecoration();
    const decoration = $(".decoration");
    const backToDraw = $(".pastry-bag02");
    const goToDrag = $(".drag");
    const draggable = $(".draggable");

    drawCanva.CreamColorChange();//換奶油顏色
    drawCanva.CreamSizeChange();//換奶油大小
    drawCanva.draw();//換奶油大小
    drawCanva.useUndo();
    drawCanva.useEraser();//橡皮擦功能切換
    drawCanva.CakeColorChange();//換蛋糕顏色

    /* 裝飾功能 */
    MydragDecoration.useRubbish();
    decoration.on("mousedown", (e) => {
        closeDrawNav();
    });
    MydragDecoration.ClickDecoration();
    backToDraw.on("mousedown", (e) => {
        openDrawNav();
    });
    goToDrag.on("mousedown", (e) => {
        closeDrawNav();
    });

    saveMyCake();//儲存畫布
})

/* 儲存畫布按鈕 */
var saveMyCake = () => {
    var element = document.getElementById('imageDIV');
    $("#download").on('click', function () {

        $('.dialog').removeClass("close").addClass("open");
        var options = {
            width: 1440,
            height: 1440,
            style: {
                "transform-origin": "680px 200px",
                scale: "2.3",
            }
        };
        domtoimage.toPng(element, options)
            .then(function (dataUrl) {
                $('.dialog').find("h6").html("完成拉~");
                closeDialog();
                var link = document.createElement('a');
                link.download = 'image.png';
                link.href = dataUrl;
                link.click();

                var newWindow = window.open();
                newWindow.document.body.innerHTML = '<img src="' + dataUrl + '">';
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    });
}

/* 介面互動相關 */
var closeDialog = () => {
    $('.dialog').on("click", (e) => {
    
        if ($(e.target).is("img") || $(e.target).is("h6")) {
            return;
        } else {
            $('.dialog').removeClass("open").addClass("close");
        }
    });
}
var closeDrawNav = () => {
    $("#touch-draw").removeClass("open").addClass("close");
    $(".nav1").removeClass("open").addClass("close");
    $(".nav2").removeClass("close").addClass("open");
}
var openDrawNav = () => {
    $("#touch-draw").removeClass("close").addClass("open");
    $(".nav2").removeClass("open").addClass("close");
    $(".nav1").removeClass("close").addClass("open");
}
