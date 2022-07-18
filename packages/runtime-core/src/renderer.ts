import { ShapeFlags, Text, isString } from "@vue/shared";
import { createvnode, isSameVnode } from "./vnode";

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

  const normalize = (children, i) => {
    if (isString(children[i])) {
      let vnode = createvnode(Text, null, children[i]);
      children[i] = vnode;
    }

    return children[i];
  };

  //子类循环
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalize(children, i);
      patch(null, child, container);
    }
  };

  //创建元素
  const mountElement = (vnode, container, anchor) => {
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

    hostInsert(el, container, anchor);
  };

  const processText = (n1, n2, container) => {
    if (n1 === null) {
      let text = (n2.el = hostCreateText(n2.children));
      hostInsert(text, container);
    } else {
      const el = (n2.el = n1.el);
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };

  //diff 属性
  const patchProps = (el, oldProps, newProps) => {
    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }

    for (let key in oldProps) {
      //如果没有，就删除
      if (newProps[key] === null || newProps[key] === undefined) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };

  //卸载子集
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };

  //数组
  const patchKeyedChildren = (c1, c2, el) => {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    // sync from start
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];

      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }
    //sync from end
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    //common sequence + mount
    //i要e1大说明有新增
    //i和e2之间的就是新增部分

    if (i > e1) {
      if (i <= e2) {
        while (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < c2.length ? c2[nextPos].el : null;
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    }

    console.log(i, e1, e2);
  };

  const patchChildren = (n1, n2, el) => {
    //比较两个虚拟节点的儿子差异，el就是当前的父节点
    const c1 = n1.children; //旧
    const c2 = n2.children; //新
    const prevShapeFlage = n1.shapeFlage;
    const shapeFlage = n2.shapeFlage;
    //文本 | 数组 | 删除老儿子，设置文本内容
    if (shapeFlage & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlage & ShapeFlags.ARRAY_CHILDREN) {
        //删除所有子节点
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        //文本 文本
        hostSetElementText(el, c2);
      }
    } else {
      //现在为数组或者为空
      if (prevShapeFlage & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
          //数组 数组
          patchKeyedChildren(c1, c2, el); //全量更新
        } else {
          //现在不是数组
          unmountChildren(c2);
        }
      } else {
        if (prevShapeFlage & ShapeFlags.TEXT_CHILDREN) {
          //数组 文本
          hostSetElementText(el, "");
        }
        if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
          //数组 文本
          mountChildren(c2, el);
        }
      }
    }
  };

  //diff 元素
  const patchElement = (n1, n2, container) => {
    let el = (n2.el = n1.el);
    let oldProps = n1.props || {};
    let newProps = n2.props || {};

    patchProps(el, oldProps, newProps);

    //子集
    patchChildren(n1, n2, el);
  };

  const processElement = (n1, n2, container, anchor) => {
    //初次渲染，直接创建
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      // 更新流程
      patchElement(n1, n2, container);
    }
  };

  //对比diff
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 === n2) return; //新旧没有变化，直接返回

    if (n1 && !isSameVnode(n1, n2)) {
      //判断是否相同，不同卸载再添加
      unmount(n1);
      n1 = null;
    }

    const { type, shapeFlage } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlage & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        }
    }
  };

  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };

  const render = (vnode, container) => {
    //渲染过程是用传入的renderOption来渲染
    // console.log(vnode, container);

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

/**
 更新逻辑：
 1. 如果前后完全不一样，删除老的，添加新的
 2. 老和新的一样，复用，属性可能不一样，在对比属性，更新属性
 3. 比对子集
 */
