var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    createRender: () => createRender,
    h: () => h,
    render: () => render
  });

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
    createElement(el) {
      return document.createElement(el);
    },
    createText(text) {
      return document.createTextNode(text);
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.setAttribute(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
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
    if (exits && nextValue) {
      exits.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        let invoker = craeteInoker(nextValue);
        el.addEventListener(event, invoker);
      } else if (exits) {
        el.removeEventListener(event, exits);
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
      patchAttr(el, key, nextValue);
    }
  }

  // packages/shared/src/typeProps.ts
  var Text = Symbol("Text");

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isArray = Array.isArray;
  var isString = (value) => typeof value === "string";
  function isVnode(value) {
    return !!(value && value.__v_isVnode);
  }

  // packages/runtime-core/src/vnode.ts
  function createvnode(type, props, children = null) {
    let shapeFlage = isString(type) ? 1 /* ELEMENT */ : 0;
    const vnode = {
      type,
      props,
      children,
      key: props == null ? void 0 : props["key"],
      el: null,
      __v_isVnode: true,
      shapeFlage
    };
    if (children) {
      let typeFlags = 0;
      if (isArray(children)) {
        typeFlags = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        typeFlags = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlage |= typeFlags;
    }
    return vnode;
  }

  // packages/runtime-core/src/renderer.ts
  function createRender(renderOptions2) {
    let {
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      parentNode: hostParentNode,
      nextSibing: hostNextSibing,
      createElement: hostCreateElement,
      createText: hostCreateText,
      patchProp: hostPatchProp
    } = renderOptions2;
    const normalize = (child) => {
      if (isString(child)) {
        return createvnode(Text, null, child);
      }
      return child;
    };
    const mountChildren = (children, container) => {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children[i]);
        patch(null, child, container);
      }
    };
    const mountElement = (vnode, container) => {
      let { type, props, shapeFlage, children } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        for (let key in props) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
      if (shapeFlage & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      } else if (shapeFlage & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
      }
      hostInsert(el, container);
    };
    const processText = (n1, n2, container) => {
      if (n1 === null) {
        let text = hostCreateText(n2.children);
        hostInsert(text, container);
      }
    };
    const patch = (n1, n2, container) => {
      if (n1 === n2)
        return;
      const { type, shapeFlage } = n2;
      if (n1 === null) {
        switch (type) {
          case Text:
            processText(n1, n2, container);
            break;
          default:
            if (shapeFlage & 1 /* ELEMENT */) {
              mountElement(n2, container);
            }
        }
      } else {
      }
    };
    const unmount = (vnode) => {
      hostRemove(vnode.el);
    };
    const render2 = (vnode, container) => {
      console.log(vnode, container);
      if (vnode === null) {
        if (container._vnode) {
          unmount(container._vnode);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    };
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/h.ts
  function h(type, propsChildren, children) {
    const len = arguments.length;
    if (len === 2) {
      if (isObject(propsChildren) && !isArray(propsChildren)) {
        if (isVnode(propsChildren)) {
          return createvnode(type, null, [propsChildren]);
        }
        return createvnode(type, propsChildren);
      } else {
        return createvnode(type, null, propsChildren);
      }
    } else {
      if (len > 3) {
        children = Array.from(arguments).slice(2);
      } else if (len === 3 && isVnode(children)) {
        children = [children];
      }
      return createvnode(type, propsChildren, children);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  function render(vnode, container) {
    createRender(renderOptions).render(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
