/*
 *  在指定的时间目标上注册用于处理指定类型时间的指定处理程序函数
 *  确保处理程序一直作为时间的目标的方法调用
 */

function addEvent(target, type, handler) {
  if (target.addEventListener)
    target.addEventListener(type, handler, false)
  else
    target.attachEvent("on" + type,
                      function(event) {
                        // 把处理程序作为事件目标的方法调用
                        // 传递事件对象
                        return handler.call(target, event);
                      });
}

/*
 * 传递函数给whenReady(), 当文档解析完毕并且为操作准备就绪时
 * 函数将作为文档对象的方法调用
 * DOMContentLoaded, readystatechange或load事件发生时会出发注册函数
 * 一旦文档准备就绪，所有函数都将被调用，任何传递给whenReady()的函数将立即调用
 */
 var whenReady = (function() { // 这个函数返回whenReady函数
  var funcs = [];
  var ready = false;

  // 当文档准备就绪时，调用事件处理程序
  function handler(e) {
    if (ready) return;

    // 如果发生readystatechange事件，但起状态不是"complete"的话，那么文档没有准备好
    if (e.type === "readystatechange" && document.readyState !== "complete")
      return;

    //运行所有注册函数
    for(var i = 0; i < funcs.length; i++) 
      funcs[i].call(document);

    ready = true;
    funcs = null;
  }

  // 为接收到的任何时间注册处理程序
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", handler, false);
    document.addEventListener("readystatechange", handler, false);
    window.addEventListener("load", handler, false);
  } else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", handler);
    window.attachEvent("onload", handler);
  }
  // 返回whenReady() 函数
  return function test(f) {
    if (ready) f.call(document);
    else funcs.push(f);
  }
 }());





