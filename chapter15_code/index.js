`use strict`
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
  var spans = document.getElementsByTagName("span");
  // console.log("spans is " + spans[0]);

  var parentNode = parent(spans[0], 2);

  var pnode = document.getElementById("ele1");
  console.log(pnode);
  var siblingNode = sibling(pnode, 1);
  console.log("node is " + siblingNode);
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
  console.log(e);
  while(e && n !== 0) {
    // console.log(e);
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