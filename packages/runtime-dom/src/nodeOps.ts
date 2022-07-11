export const nodeOps = {
  //插入
  insert(child, parent: HTMLElement, anchor = null) {
    parent.insertBefore(child, anchor); //appendChild
  },

  remove(child: HTMLElement) {
    const parentNode = child.parentNode;
    if (parentNode) {
      parentNode.removeChild(child);
    }
  },
  setElementText(el: HTMLElement, text) {
    el.textContent = text;
  },

  setText(node: Text, text) {
    node.nodeValue = text;
  },

  querySelector(selector) {
    return document.querySelector(selector);
  },
  parentNode(node) {
    return node.parentNode;
  },
  nextSibing(node) {
    return node.nextSibing;
  },
  createElement(el, option) {
    document.createElement(el, option);
  },

  createText(text) {
    return document.createTextNode(text);
  },
};
