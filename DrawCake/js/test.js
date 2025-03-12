document.addEventListener("DOMContentLoaded", function () {
    let selectedImage = null; // 用于存储拖拽的图片元素

    // 获取所有 class 以 "cake" 开头的图片
    const cakeImages = document.querySelectorAll('img[class^="cake"]');
    const decorationArea = document.getElementById("cd");
    const clearButton = document.getElementById("clear-button"); 
    console.log(decorationArea);

    // 监听图片的点击事件
    cakeImages.forEach(img => {
        img.addEventListener("mousedown", function (event) {
            event.preventDefault(); // 防止默认拖拽行为
            
            // 复制被点击的图片
            selectedImage = img.cloneNode(true);
            selectedImage.style.position = "absolute";
            selectedImage.style.pointerEvents = "none"; // 避免阻挡鼠标事件
            selectedImage.style.zIndex = "1000"; // 确保在最上层
            document.body.appendChild(selectedImage);

            // 初始化位置
            moveAt(event.pageX, event.pageY);
            
            // 监听鼠标移动事件
            document.addEventListener("mousemove", onMouseMove);
        });
    });

    // 移动图片
    function moveAt(x, y) {
        if (selectedImage) {
            selectedImage.style.left = x - selectedImage.width / 2 + "px";
            selectedImage.style.top = y - selectedImage.height / 2 + "px";
        }
    }

    // 鼠标移动时，更新图片位置
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // 监听鼠标点击事件，决定是否放置图片
    document.addEventListener("mouseup", function (event) {
        if (selectedImage) {
            document.removeEventListener("mousemove", onMouseMove); // 停止跟随鼠标

            // 判断是否在 cake-decoration 区域内
            if (decorationArea.contains(event.target)) {
                selectedImage.style.position = "absolute";
                selectedImage.style.left = event.pageX - decorationArea.getBoundingClientRect().left - selectedImage.width / 2 + "px";
                selectedImage.style.top = event.pageY - decorationArea.getBoundingClientRect().top - selectedImage.height / 2 + "px";
                selectedImage.style.pointerEvents = "auto"; // 允许交互

                decorationArea.appendChild(selectedImage); // 添加到装饰区域
            } else {
                selectedImage.remove(); // 释放未放置的图片
            }

            selectedImage = null; // 清空状态
        }
    });

    const arr1 = ["emmmmm，真的什么都不吃吗？", "一定是你还不饿，是吧，肯定不是三明治蛋糕它不好吃", "可能是三明治蛋糕它不好吃吧😣","是没有什么胃口吗?"];
    const arr2 = ["三明治蛋糕被一扫而空！", "还需要再加点吗？", "不多不少刚刚好呢","下次你应该还会来吃三明治蛋糕吧","欢迎下次再来哦","嘿嘿嘿，吃三明治蛋糕🤤"];
    const arr3 = ["你真的要吃那么多三明治蛋糕吗？", "没有人能抵挡三明治蛋糕的诱惑", "一个，两个，三个...你居然吃了那么多三明治蛋糕","你居然一个人把那么多三明治蛋糕全部吃完啦"];

        // 清空蛋糕按钮功能
    clearButton.addEventListener("click", function () {
        const cakeImagesInDecoration = decorationArea.querySelectorAll('img[class^="cake"]');
        const cakeCount = cakeImagesInDecoration.length; // 获取被清空的蛋糕数量
        cakeImagesInDecoration.forEach(img => img.remove()); // 只删除 class 以 "cake" 开头的图片

        // 选择合适的提示语
        let message;
        if (cakeCount === 0) {
            message = arr1[Math.floor(Math.random() * arr1.length)];
        } else if (cakeCount < 3) {
            message = arr2[Math.floor(Math.random() * arr2.length)];
        } else {
            message = arr3[Math.floor(Math.random() * arr3.length)];
        }

        // 输出提示
        alert(message);
    });
});