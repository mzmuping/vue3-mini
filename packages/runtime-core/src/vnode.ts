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
