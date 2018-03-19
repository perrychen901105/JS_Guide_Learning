function getElements(/*ids...*/) {
  var elements = {};
  for(var i = 0; i < arguments.length; i++) {
    var id = arguments[i];
    var elt = document.getElementById(id);
    if (elt == null) {
      throw new Error("No element with id: " + id);
    }

    elements[id] = elt;
  }
    console.log(elements);
    //{ele1: p#ele1, ele3: p#ele3.warning} ele1: p#ele1ele3: p#ele3.warning__proto__: Object
    return elements;
}

function getElementByTagName() {
  var spans = document.getElementsByTagName("i");
  // console.log("spans is " + spans[0]);

  var parentNode = parent(spans[0], 2);

  var pnode = document.getElementById("ele2");
  // console.log(pnode);
  var siblingNode = sibling(pnode, 1);

  var childNode = document.getElementById("ele2");
  var actualNode = child(childNode, 0);

  var matrix = getElementPosition(pnode);
  console.log(matrix);

  // getBoxSize(spans[0]);
  // spans is [object HTMLSpanElement]
}

function getElementsByClassName() {
  var classnames = document.getElementsByClassName("warning");
  console.log("class name is " + classnames[0]);
  // class name is [object HTMLParagraphElement]
}

function getChildNode() {
  // var element = document.childNodes[0].childNodes[1].childNodes[0];
  var element = document.firstChild.firstChild.nextSibling.nodeType;
  console.log(element);
}

function parent(e, n) {
  if (n === undefined) { n = 1 }
  while(n-- && e) e = e.parentNode;
  if (!e || e.nodeType !== 1) { return null; }
  return e
}

function sibling(e, n) {
  while(e && n !== 0) {
    if (n > 0) {
      if (e.nextElementSibling) { 
        e = e.nextElementSibling 
      } else {
        for (e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling) {
        }
      }
     n--;
    }  else {
      if (e.previousElementSibling) {
        e = e.previousElementSibling;
      } else {
        for ( e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling) {

        }
      }
       n++;
    }
    return e;
  }
}

function child(e, n) {
  if (e.children) {
    if (n < 0) { n += e.children.length; }
    if (n < 0) { return null; }
    return e.children[n];
  }

  //
  if (n >= 0) {
    if (e.firstElementChild) { e = e.firstElementChild } else {
      for ( e = e.firstChild; e && e.nodeType !== 1; e = e.nextSibling) {}
    }
    return sibling(e, n);
  } else {
    if (e.lastElementChild) { e = e.lastElementChild; } else {
      for (e = e.lastChild; e && e.nodeType !== 1; e = e.previousSibling) {}
    }
    return sibling(e, n+1);
  }
}

function getScrollOffsets(w) {
  w = w || window;

  // 除了IE 8及更早版本以外，其他浏览器都能用
  if (w.pageOffset != null) {
    return {x: w.pageXOffset, y: w.pageYOffset};
  }
  // 对标准模式下的IE （或任何浏览器）
  var d = w.document;
  if (document.compatMode == "CSS1Compat") {
    return {x: d.documentElement.scrollLeft, y:d.documentElement.scrollTop};
  }

  // 对怪异模式下的浏览器
  return {x: d.body.scrollLeft, y: d.body.scrollTop };
}

function getViewportSize(w) {
  w = w || window;

  if (w.innerWidth != null) { 
    return {w: w.innerWidth, h: w.innerHeight};
  }

  // 标准模式下的IE
  var d = w.document;
  if (document.compatMode == "CSS1Compat") {
    return { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight};
  }

  return { w: d.body.clientWidth, h: d.body.clientHeight };
}

function getBoxSize(e) {
  // 内联元素用getClientRects，返回数组
  var box = e.getClientRects();//e.getBoundingClientRects
  console.log(box);
  var offsets = getScrollOffsets();
  var x = box.left + offsets.x;
  var y = box.top + offsets.y;

  var w = box.width || (box.right - box.left)
  var h = box.height || (box.bottom - box.top)

  console.log("x " + x + " y " + y + " w " + w + " h " + h);
}

function scrollToBottom() {
  var documentHeight = document.documentElement.offsetHeight;
  var viewportHeight = window.innerHeight;
  console.log("documentHeight " + documentHeight + " viewportHeight " + viewportHeight)
  window.scrollTo(0, documentHeight - viewportHeight);
}

function getElementPosition(e) {
  var x = 0, y = 0;
  while (e != null) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return {x: x, y: y};
}
