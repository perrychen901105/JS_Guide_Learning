function shake(e, oncomplete, distance, time) {
  if (typeof e === "string") e = document.getElementById(e);
  if (!time) time = 500;
  if (!distance) distance = 5;

  var originalStyle = e.style.cssText;   //保存e的原始style
  e.style.position = "relative";
  var start = (new Date()).getTime();
  animate();                              // 动画开始

  function animate() {
    var now = (new Date()).getTime();
    var elapsed = now - start;
    var fraction = elapsed/time;        //占总时间的百分比

    if (fraction < 1) {   // 动画未完成
      var x = distance * Math.sin(fraction*4*Math.PI);
      e.style.left = x + "px";

      setTimeout(animate, Math.min(25, time-elapsed));
    } else {
      e.style.cssText = originalStyle;
      if (oncomplete) oncomplete(e);
    }
  }
}

function fadeOut(e, oncomplete, time) {
  if (typeof e === "string") e = document.getElementById(e);
  if (!time) time = 500;


  var ease = Math.sqrt;

  var start = (new Date()).getTime();
  animate();

  function animate() {
    var elapsed = (new Date()).getTime() - start;
    var fraction = elapsed/time;
    if (fraction < 1) {
      var opacity = 1 - ease(fraction);
      e.style.opacity = String(opacity);
      setTimeout(animate, Math.min(25, time-elapsed));
    } else {
      e.style.opacity = "0";
      if (oncomplete) oncomplete(e);
    }
  }
}

// 用制定的因子缩放元素e的文本尺寸
function scale(e, factor) {
  // 用计算样式传当前文本的尺寸
  var size = parseInt(window.getComputedStyle(e, "").fontSize);
  // 用内联样式来放大尺寸
  e.style.fontSize = factor*size + "px";
}

// 用指定的因子修改元素e的背景颜色
// factors > 1 颜色变浅, factors < 1 颜色变暗
function scaleColor(e, factor) {
  var color = window.getComputedStyle(e, "").backgroundColor;
  var components = color.match(/[\d\.]+/g);
  for (var i = 0; i < 3; i++) {
    var x = Number(components[i]) * factor;
    x = Math.round(Math.min(Math.max(x, 0), 255));
    components[i] = String(x);
  }

  if (components.length == 3)
    e.style.backgroundColor = "rgb(" + components.join() + ")";
  else
    e.style.backgroundColor = "rgba(" + components.join() + ")";
}

// 脚本化CSS类

function classList(e) {
  if (e.classList) return e.classList;    // 如果e.classList存在，则返回它
  else return new CSSClassList(e);
}

// CSSClassList 是一个模拟DOMTokenList的JavaScript类
function CSSClassList(e) { this.e = e; }

CSSClassList.prototype.contains = function(c) {
  // 检查c是否是合法的类名
  if (c.length === 0 || c.indexOf(" ") != -1)
    throw new Error("Invalid class name: '" + c + "'");

  var classes = this.e.className;
  if (!classes) return false;     // e不含类名
  if (classes === c) return true; // e有一个完全匹配的类名

  // 否则把c自身看做一个单词，利用正则表达式搜索c
  return classes.search("\\b" + c + "\\b") != -1;

};

// 如果c 不存在，将c 添加到e.className 中
CSSClassList.prototype.add = function(c) {
  if (this.contains(c)) return;
  var classes = this.e.className;
  if (classes && classes[classes.length - 1] != " ")
    c = " " + c;
  this.e.className += c;
};

CSSClassList.prototype.remove = function(c) {
  if (c.length === 0 || c.indexOf(" ") != -1)
    throw new Error("Invalid class name: '" + c + "'");
  // 将所有座位单词的c 和多余的尾随空格全部删除
  var pattern = new RegExp("\\b" + c + "\\b\\s*", "g");
  this.e.className = this.e.className.replace(pattern, "");
}

// 如果c 不存在，将c添加到e.className中，并且返回true，否则将在e.className中出现的所有c都删除，并返回false
CSSClassList.prototype.toggle = function(c) {
  if (this.contains(c)) {
    this.remove(c);
    return false;
  } else {
    this.add(c);
    return true;
  }
};

// 返回e.className本身
CSSClassList.prototype.toString = function() {
  return this.e.className;
};

CSSClassList.prototype.toArray = function() {
  return this.e.className.match(/\b\w+\b/g) || [];
}

// 关闭样式表
function disableStylesheet(ss) {
  if (typeof ss === "number")
    document.styleSheets[ss].disable = true;
  else {
    var sheets = document.querySelectorAll(ss);
    for(var i = 0; i < sheets.length; i++)
      sheets[i].disable = true;
  }
}

// 对样式做一些修改
var ss = document.styleSheets[0];
var rules = ss.cssRules? ss.cssRules : ss.rules;

for (var i = 0; i < rules.length; i++) {
  var rule = rules[i];
  if (!rule.selectorText) continue;    // 跳过@import和非样式规则

  var selector = rule.selectorText;     // 选择器
  var ruleText = rule.style.cssText;    // 文本形式的样式

  if (selector == "h1") {
    if (ss.insertRule) ss.insertRule("h2 {" + ruleText + "}", rules.length);
    else if (ss.addRule) ss.addRule("h2", ruleText, rules.length);
  }

  // 如果设置了text-decoration属性，则将其删除
  if (rule.style.textDecoration) {
    if (ss.deleteRule) ss.deleteRule(i);
    else if (ss.removeRule) ss.removeRule(i);
    i--;
  }
}

// 创建一个新的样式表
function addStyles(styles) {
  var styleElt, styleSheet;
  if (document.createStyleSheet) {
    styleSheet = document.createStyleSheet();
  } else {
    var head = document.getElementsByTagName("head")[0]
    styleElt = document.createElement("style");
    head.appendChild(styleElt);

    styleSheet = document.styleSheets[document.styleSheets.length - 1];
  }

  // 现在向其中插入样式
  if (typeof styles === "string") {
    // 阐述是样式表文本 
    if（styleElt）styleElt.innerHTML = styles;
    else styleSheet.cssText = styles;
  } else {
    // 参数是待插入的单独的规则的对象
    var i = 0;
    for (selector in styles) {
      if (styleSheet.insertRule) {
        var rule = selector + " {" + styles[selector] + "}";
        styleSheet.insertRule(rule, i++);
      } else {
        styleSheet.addRule(selector, styles[selector]; i++);
      }
    }
  }
}


