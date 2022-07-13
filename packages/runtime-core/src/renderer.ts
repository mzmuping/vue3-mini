import { isString } from "@vue/shared";
import { ShapeFlags, Text } from "packages/shared/src/typeProps";
import { createvnode } from "./vnode";

export function createRender(renderOptions) {
  let {
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSibing: hostNextSibing,
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp,
  } = renderOptions;

  const normalize = (child) => {
    if (isString(child)) {
      return createvnode(Text, null, child);
    }

    return child;
  };

  //子类循环
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalize(children[i]);
      patch(null, child, container);
    }
  };

  //创建元素
  const mountElement = (vnode, container) => {
    let { type, props, shapeFlage, children } = vnode;
    let el = (vnode.el = hostCreateElement(type));
    //属性添加
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }

    if (shapeFlage & ShapeFlags.TEXT_CHILDREN) {
      //文本
      hostSetElementText(el, children);
    } else if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
      //数组
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

  //对比diff
  const patch = (n1, n2, container) => {
    if (n1 === n2) return; //新旧没有变化，直接返回
    const { type, shapeFlage } = n2;
    if (n1 === null) {
      //初次渲染，直接创建

      switch (type) {
        case Text:
          processText(n1, n2, container);
          break;
        default:
          if (shapeFlage & ShapeFlags.ELEMENT) {
            mountElement(n2, container);
          }
      }
    } else {
      //更新流程
    }
  };

  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };

  const render = (vnode, container) => {
    //渲染过程是用传入的renderOption来渲染
    console.log(vnode, container);

    //
    if (vnode === null) {
      //卸载逻辑
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
    }

    container._vnode = vnode; //新赋给旧
  };

  return {
    render,
  };
}
