export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function setScrollPosition(
  htmlEl,
  stepNum,
  stepTot,
  adjuster = () => {}
) {
  htmlEl.scrollLeft = adjuster(
    ((htmlEl.scrollWidth - htmlEl.offsetWidth) * stepNum) / stepTot
  );
}

export function createHtmlNode(appendTo, obj) {
  // It might seam convoluted but it makes creating nested nodes so much easier.
  // Any needed changes to the node can be made clearly as the object
  // visually immitates what it would look like in html.
  // Blocks of code specific to each element can be inserted too to set behaviour's for each nested
  // node element as its being created

  let el = null;
  obj.hasOwnProperty("tag")
    ? obj.tag == "svg" || obj.tag == "use"
      ? (el = document.createElementNS("http://www.w3.org/2000/svg", obj.tag))
      : (el = document.createElement(obj.tag))
    : (el = document.createElement("div"));

  if (obj.hasOwnProperty("class")) el.className = obj.class;
  if (obj.hasOwnProperty("doWith")) obj.doWith(el);
  if (obj.hasOwnProperty("innerHTML")) el.innerHTML = obj.innerHTML;
  if (obj.hasOwnProperty("atts")) {
    for (let att in obj.atts) {
      el.setAttribute(att, obj.atts[att]);
    }
  }
  if (obj.hasOwnProperty("attributesNS"))
    el.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      obj.attributesNS
    );
  appendTo.append(el);
  if (obj.hasOwnProperty("children"))
    obj.children.forEach((innerEl) => {
      createHtmlNode(el, innerEl);
    });
}
