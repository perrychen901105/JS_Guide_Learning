/**
 * 拖动绝对定位的HTML元素
 * 定义了一个drag() 函数，用于Mousedown时间处理程序的调用
 * 随后的mousemove事件将移动指定元素,mouseup事件将终止拖动
 */

function drag(elementToDrag, event) {
  // 初始鼠标位置，转换为文档坐标
  var scroll = getScrollOffsets();    // 来自其他地方的工具函数
  var startX = event.clientX + scroll.x;
  var startY = event.clientY + scroll.y;

  console.log("client X is " + event.clientX + " scroll X is " + scroll.x);

  // 在文档坐标下，待拖动元素的初始位置
  // 因为elementToDrag是绝对定位的
  // 所以我们可以假设它的offsetParent就是文档的Body元素。
  var origX = elementToDrag.offsetLeft;
  var origY = elementToDrag.offsetTop;


  // 计算mousedown事件和元素左上角之间的距离
  // 我们将它另存为鼠标移动的距离
  var deltaX = startX - origX;
  var deltaY = startY - origY;

  console.log("the start x is " + startX + " originX " + origX + " deltaX " + deltaX);

  // 注册用于响应接着mousedown事件发生的mousemove和moseup事件的时间处理程序
  if (document.addEventListener) {
    // 在document对象上注册捕获事件处理程序
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler)
  } else if (document.attachEvent) {
    // IE5~8的IE事件模型
    elementToDrag.setCapture();
    elementToDrag.attachEvent("onmousemove", moveHandler);
    elementToDrag.attachEvent("onmouseup", upHandler);
    // 作为Mouseup事件看待鼠标捕获的丢失
    elementToDrag.attachEvent("onlosecapture", upHandler);
  }

  // 不让其他任何元素看到它
  if (event.stopPropagation) event.stopPropagation(); // 标准模型
  else event.cancelBubble = true;                     // IE

  // 阻止任何默认操作
  if (event.preventDefault) event.preventDefault();   // 标准模型
  else event.returnValue = false;                     // IE

  /**
   * 当元素正在被拖动时，这就是捕获mousemove事件的处理程序
   * 它用于移动这个元素
   */

   function moveHandler(e) {
    if (!e) e = window.event;

    // 移动这个元素到当前鼠标位置，
    // 通过滚动条的位置和初始单击的偏移量来调整
    var scroll = getScrollOffsets();
    elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
    elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";
    // 同时不让任何其他元素看到这个事件
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true; // IE
   }

   /**
    * 这是捕获在拖动结束时发生的最终mouseup事件的处理程序
    */
   
    function upHandler(e) {
      if (!e) e = window.event;   // IE事件模型

      // 注销捕获事件处理程序
      if (document.removeEventListener) {
        document.removeEventListener("mouseup", upHandler, true);
        document.removeEventListener("mousemove", moveHandler, true);
      } else if (document.detachEvent) {  // IE5 事件模型
        elementToDrag.detachEvent("onlosecapture", upHandler);
        elementToDrag.detachEvent("onmouseup", upHandler);
        elementToDrag.detachEvent("onmousemove", moveHandler);
        elementToDrag.releaseCapture();
      }

      // 并且不让事件进一步传播
      if (e.stopPropagation) e.stopPropagation();
      else e.cancelBubble = true; // IE
    }

}