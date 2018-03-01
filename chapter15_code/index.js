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
  console.log("spans is " + spans[0]);
  // spans is [object HTMLSpanElement]
}

function getElementsByClassName() {
  var classnames = document.getElementsByClassName("warning");
  console.log("class name is " + classnames[0]);
  // class name is [object HTMLParagraphElement]
}

function getChildNode() {
  var element = document.childNodes[0].childNodes[1].childNodes[0];
  console.log(element);
}