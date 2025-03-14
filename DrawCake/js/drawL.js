/* 畫布處理區塊 */
var _canvas = document.getElementById('draw-cake');
var ctx = _canvas.getContext('2d');
_canvas.width = 480;
_canvas.height = 540;

//奶油大小和橡皮擦的事件再replaceSvgImages()完成後做。
export class drawCanvas {
    constructor() {
        /* 控制器們 */
        this.drawCanvas = this;
        this.drawColor = document.getElementById("drawColor");
        this.cakeColor = document.getElementById("cakeColor");
        this.cream = $('.cream');
        this.eraser = $('.eraser');
        this.isEraser = false;
        this.color = this.drawColor.value;
        this.color02 = "#ffffff";
        this.scale = 1;
    }

    CreamColorChange() {
        this.drawColor.addEventListener("change", function (e) {
            this.color = e.target.value;
        }.bind(this))
    }
    CreamSizeChange() {
        const self = this; 

        this.cream.eq(0).attr("aria-label", "0.2");
        this.cream.eq(1).attr("aria-label", "0.4");
        this.cream.eq(2).attr("aria-label", "0.7");
        this.cream.eq(3).attr("aria-label", "1.0");

        this.cream.eq(3).find("path").addClass("checked");
        this.cream.on("click", function (e) {
            console.log($('.checked').not($(this)));
            $(self.cream).find('.checked').not($(this)).removeClass('checked');
            $(this).find("path").toggleClass("checked");
            self.scale = $(this).attr("aria-label");
        });
    }
    useEraser() {
        const self = this;
        this.eraser.on("click", function (e) {
            if (!self.isEraser) {
                self.isEraser = true;
            } else {
                self.isEraser = false;
            }
            $(self.eraser).find("path").toggleClass("checked");
        });
    }
    draw = () => {
        const self = this;
        var canterX = 30;
        var canterY = 30;

        $(_canvas).on("mousedown", openCvs);
        $(_canvas).on("mouseup", closeCvs);

        function openCvs() {
            _canvas.addEventListener("mousemove", clickCvs);
        }
        function closeCvs() {
            _canvas.removeEventListener("mousemove", clickCvs);
        }
        function clickCvs(e) {
            /* 獲得滑鼠之於canvas的位置 */
            /* 01.因為我的canvas和瀏覽器窗口的量是會變的，所以要算差多少 */
            /* 02.我的滑鼠位置之於瀏覽器窗口也會一直變 */
            /* 03.所以取得當前變量後，相減才會得到正確的位置 */
            /*canvas*/
            var rect = ctx.canvas.getBoundingClientRect();
            var canvasOffsetX = rect.left;
            var canvasOffsetY = rect.top;
            /* 滑鼠 */
            /*e.client就直接是滑鼠與目前瀏覽器的距離*/
            var x =  e.clientX - canvasOffsetX;
            var y =  e.clientY - canvasOffsetY;

            drawCream(x, y);
        }
        function drawCream(x, y) {
            /* 這是我要畫的圖案 01.points 02.把文字拆成兩兩一組 */
            var points = "55.28 30.27 56.97 32.65 59.7 35.53 59.04 38.09 53.85 38.98 55.07 42.01 52.95 43.57 54.63 47.58 49.44 46.63 48.81 49.15 46.51 50.01 44.97 51.72 43.89 54.39 40.68 53.22 40.32 58.66 37.7 59.01 35.26 60 32.44 57.79 30.04 56.22 27.67 57.57 25.6 55.63 22.27 59.43 20.46 56.73 18.83 54.45 16.79 53.35 13.9 53.46 10.59 53.58 8.67 51.77 7.31 49.46 6.98 46.51 7.27 43.49 7.1 41.03 3.54 39.97 1.05 38.08 2.61 35.14 0 32.92 2.79 30.27 3.94 27.98 .85 25.1 1.18 22.5 4.23 20.83 6.5 19.24 4.35 15.36 7.47 14.38 6.96 10.8 10.58 10.7 12.47 9.21 12.94 5.71 16.6 6.85 19.13 6.73 19.71 1.74 22.95 3.65 25.13 2.27 27.54 1.52 30.04 0 32.57 1.22 34.72 3.64 37.64 1.77 40.48 1.44 42.92 2.52 43.95 6.07 44.44 9.6 48.96 7.6 49.61 10.61 53.42 10.56 50.65 15.77 54.92 15.84 55.59 18.3 56.68 20.53 54.53 23.67 59.83 24.99 60 27.64 55.28 30.27";
            var coords = points.split(' ').reduce(function (acc, point, index, array) {
                if (index % 2 === 0) {
                    acc.push([
                        /*把svg改成數組，後面再加上x、y就可以形成繪製關係 -的部分則是為了讓滑鼠看起來在中間*/
                        (parseFloat(point) * self.scale + x) - canterX * self.scale,
                        (parseFloat(array[index + 1]) * self.scale + y) - canterY * self.scale
                    ]);
                }
                return acc;
            }, []);
            ctx.save();

            /* 顏色 */
            var gr = ctx.createLinearGradient(50*self.scale + x, 0+y, 0+x, 50*self.scale + y);
            gr.addColorStop(0, self.color);
            gr.addColorStop(1, self.color02);
            ctx.fillStyle = gr;

            ctx.beginPath();
            coords.forEach(function (coord, index) {
                if (index === 0) {
                    ctx.moveTo(coord[0], coord[1]);
                } else {
                    ctx.lineTo(coord[0], coord[1]);
                }
            });
            ctx.closePath();

            
            /* 這裡決定是要畫還是要擦除 */
            if (!self.isEraser) {
                ctx.globalCompositeOperation = "source-over";
                ctx.fill();
            } else {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fill();
            }
            ctx.restore();
        }
    }
    CakeColorChange() {/*換蛋糕顏色*/
        this.cakeColor.addEventListener("change", (e) => {
            $(".cakePIC").attr("src", `./Source/SVG/game/${cakeColor.value}.svg`);
        })
    }
}

