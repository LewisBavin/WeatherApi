export const qs = (selector, parent = document) =>
  // query selector shorthand
  parent.querySelector(selector);

export const qsa = (selector, parent = document) =>
  // query selector all shorthand
  Array.from(parent.querySelectorAll(selector));

export const getById = (id) =>
  // get element by id shorthand
  document.getElementById(id);

export function setScrollPosition(htmlEl, stepNum, stepTot, adjust = () => {}) {
  htmlEl.scrollLeft = adjust(
    ((htmlEl.scrollWidth - htmlEl.offsetWidth) * stepNum) / stepTot
  );
}

export function createHtmlNode(appendTo, obj) {
  let el = null;
  obj.hasOwnProperty("tag")
    ? obj.tag == "svg" || obj.tag == "use"
      ? (el = document.createElementNS("http://www.w3.org/2000/svg", obj.tag))
      : (el = document.createElement(obj.tag))
    : (el = document.createElement("div"));

  obj.hasOwnProperty("class") ? (el.className = obj.class) : null;
  obj.hasOwnProperty("doWith") ? obj.doWith(el) : null;
  obj.hasOwnProperty("innerHTML") ? (el.innerHTML = obj.innerHTML) : null;
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
