// 把内容元素装入到一个指定大小的窗体或视口内
// 可选参数 contentX和contentY指定内容相对于窗体的初始偏移量
// 这个窗体有mousewheel事件处理程序
// 它允许用户平移元素和缩放窗体

function enclose(content, framewidth, frameheight, contentX, contentY) {
  // 这些参数不仅仅是初始值
  // 它们保存当前状态，能被Mousewheel处理程序使用和修改
  framewidth = Math.max(framewidth, 50);
  frameheight = Math.max(frameheight, 50);
  contentX = Math.min(contentX, 0) || 0;
  contentY = Math.min(contentY, 0) || 0;

  // 创建frame元素，且设置CSS类名和样式
  var frame = document.createElement("div");
  frame.className = "enclosure";
  frame.style.width = framewidth + "px";
  frame.style.height = frameheight + "px";
  frame.style.overflow = "hidden";
  frame.style.boxSizing = "border-box";
  frame.style.webkitBoxSizing = "border-box";
  frame.style.MozBoxSizing = "border-box";

  // 把frame放入文档中，并把内容移入frame中
  content.parentNode.insertBefore(frame, content);
  frame.appendChild(content);

  // 确定元素相对于frame的位置
  content.style.position = "relative";
  content.style.left = contentX + "px";
  content.style.top = contentY + "px";

  // 我们需要针对下面一些特定浏览器怪癖进行处理
  var isMacWebkit = (navigator.userAgent.indexOf("Macintosh") !== -1 && navigator.userAgent.indexOf("WebKit") !== -1);
  var isFirefox = (navigator.userAgent.indexOf("Gecko") !== -1);

  // 注册Mousewheel事件处理程序
  frame.onwheel = wheelHandler;   // 未来浏览器
  frame.onmousewheel = wheelHandler;  // 大多数当前浏览器
  if (isFirefox) {
    frame.addEventListener("DOMMouseScroll", wheelHandler, false);
  }

  function wheelHandler(event) {
    var e = event || window.event;

    // 查找wheel 事件对象，Mousewheel事件对象 和 Firefox的dommouseScroll事件对象的属性
    // 从事件对象中提取旋转量
    // 绽放delta以便一次鼠标滚轮“单击”相对于屏幕的缩放增量是30像素
    var deltaX = e.deltaX*-30 || e.wheelDeltaX/4 || 0;
    var deltaY = e.deltaY*-30 || e.wheelDeltaY/4 || (e.wheelDeltaY===undefined && e.wheelDelta/4) || e.detail*-10 || 0;

    if (isMacWebkit) {
      deltaX /= 30;
      deltaY /= 30;
    }

    // 如果未来Firefox中得到mousewheel 或者wheel 时间，那么久不再需要DOMMouseScroll
    if (isFirefox && e.type !== "DOMMouseScroll") {
      frame.removeEventListener("DOMMouseScroll", wheelHandler, false);
    }
    // 获取内容元素的当前尺寸
    
    var contentBox = content.getBoundingClientRect();
    var contentwidth = contentBox.right - contentBox.left;
    var contentheight = contentBox.bottom - contentBox.top;

    // 如果按下alt键，那么可以调整frame 大小
    if (e.altKey) {
      if (deltaX) {
        framewidth -= deltaX;
        framewidth = Math.min(framewidth, contentwidth);
        framewidth = Math.max(framewidth, 50);
        frame.style.width = framewidth + "px";
      }
      if (deltaY) {
        frameheight -= deltaY;
        frameheight = Math.min(frameheight, contentheight);
        frameheight = Math.max(frameheight-deltaY, 50);
        frame.style.height = frameheight + "px";
      }
    } else {    //没有按下的话，平移frame中的内容
      if (deltaX) {
        // 不能在滚动了
        var minoffset = Math.min(framewidth-contentwidth, 0);
        // 把deltaX添加到contentX中，但不能小于minoffset
        contentX = Math.max(contentX + deltaX, minoffset);
        contentX = Math.min(contentX, 0);
        content.style.left = contentX + "px";
      }
      if (deltaY) {
        // 不能在滚动了
        var minoffset = Math.min(frameheight-contentheight, 0);
        // 把deltaX添加到contentX中，但不能小于minoffset
        contentY = Math.max(contentY + deltaY, minoffset);
        contentY = Math.min(contentY, 0);
        content.style.left = contentY + "px";
      }
    }

    // 不让这个事件冒泡，阻止任何默认操作
    // 这会组织浏览器使用mousewheel事件滚动文档
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }
}