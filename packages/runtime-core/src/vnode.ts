// type props children

import { isArray, isString } from "@vue/shared";
import { ShapeFlags } from "packages/shared/src/typeProps";
//虚拟节点：组件的，元素的， 文本的
export function createvnode(type, props, children = null) {
  // 组合方案 shapeflage 我想知道一个元素中包含的是多个儿子还是儿子 标识
  let shapeFlage = isString(type) ? ShapeFlags.ELEMENT : 0;
  const vnode = {
    type,
    props,
    children,
    key: props?.["key"],
    el: null, //真实dom
    __v_isVnode: true,
    shapeFlage,
  };

  if (children) {
    let typeFlags = 0;
    if (isArray(children)) {
      //是否数组
      typeFlags = ShapeFlags.ARRAY_CHILDREN;
    } else {
      //文本
      children = String(children);
      typeFlags = ShapeFlags.TEXT_CHILDREN;
    }

    vnode.shapeFlage |= typeFlags;
  }

  return vnode;
}

//是否虚拟节点
export function isVnode(value) {
  return !!(value && value.__v_isVnode);
}

//是否相同节点
export function isSameVnode(n1, n2) {
  //判断两个虚拟节点是否是相同节点，标签相同，key一样
  return n1.type === n2.type && n1.key === n2.key;
}
