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
