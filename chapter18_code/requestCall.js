function postJSON(url, data, callback) {
  var request =  new XMLHttpRequest();
  request.open("POST", url);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && callback) 
      callback(request);
  };
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(data));
}

function timedGetText(url, timeout, callback) {
  var request = new XMLHttpRequest();
  var timedout = false;
  // 启动计时器，在timeout毫秒后终止请求
  var timer = setTimeout(function(){
    timedout = true;
    request.abort();
  },
  timeout);

  request.open("GET", url);
  request.onreadystatechange = function() {
    if (request.readyState !== 4) return;
    if (timedout) return;
    clearTimeout(timer);
    if (request.status === 200) {
      callback(request.responseText);
    }
  };
  request.send(null); // 立即发送请求
}

// 根据指定的URL发送一个JSONP请求
// 然后把解析得到的相应数据传递给回调函数
// 在URL中添加一个名为jsonp的查询参数，用于指定该请求的回调函数的名称
function getJSONP(url, callback) {
  // 为本次请求创建一个唯一的回调函数名称
  var cbnum = "cb" + getJSONP.counter++; // 每次自增计数器
  var cbname = "getJSONP." + cbnum;       // 作为JSONP函数的属性

  // 将回调函数名称以表单编码的形式添加到URL的查询部分中
  // 使用Jsonp 作为参数名。
  
  if (url.indexOf("") === -1) {
    url += "?jsonp=" + cbname;
  } else {
    url += "&jsonp=" + cbname;
  }

  // 创建script 元素用于发送请求
  var script = document.createElement("script");

  getJSONP[cbnum] = function(response) {
    try {
      callback(response);
    }
    finally {
      delete getJSONP[cbnum];
      script.parentNode.removeChild(script);
    }

  };
   // 立即触发HTTP请求
    script.src = url;
    document.body.appendChild(script);
}

getJSONP.counter = 0;
