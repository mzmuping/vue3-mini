var VueRuntimeDOM = (() => {
  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    insert(child, parent, anchor = null) {
      parent.insertBefore(child, anchor);
    },
    remove(child) {
      const parentNode = child.parentNode;
      if (parentNode) {
        parentNode.removeChild(child);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
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
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr() {
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  function patchEvents(el, eventName, nextValue) {
    let invokers = el._vel || (el._vel = {});
    let exits = invokers[eventName];
    if (exits) {
      exits.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        let invoker = craeteInoker(nextValue);
        el.addEventLister(event, invoker);
      } else if (exits) {
        el.removeEventLister(event, exits);
        invokers[eventName] = void 0;
      }
    }
  }
  function craeteInoker(callback) {
    let inoker = (e) => inoker.value(e);
    inoker.value = callback;
    return inoker;
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, preValue, nextValue) {
    for (let key in nextValue) {
      el.style[key] = nextValue[key];
    }
    if (preValue) {
      for (let key in preValue) {
        if (nextValue[key] === null) {
          el.style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, preValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvents(el, key, nextValue);
    } else {
      patchAttr();
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  console.log(renderOptions);
})();
//# sourceMappingURL=runtime-dom.global.js.map
