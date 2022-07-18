import { isArray, isObject } from "@vue/shared";
import { createvnode, isVnode } from "./vnode";

export function h(type, propsChildren, children) {
  //其余的除了3个之外的肯定是孩子

  const len = arguments.length;
  //h的用法
  //h('div','hello')
  //h('div',{style:{color:'red'}})
  //h('div',[h('div',null,'hello')])
  if (len === 2) {
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren)) {
        //虚拟节点包装成数组
        return createvnode(type, null, [propsChildren]);
      }
      return createvnode(type, propsChildren); //属性
    } else {
      return createvnode(type, null, propsChildren); //是数组
    }
  } else {
    if (len > 3) {
      children = Array.from(arguments).slice(2);
    } else if (len === 3 && isVnode(children)) {
      //h('div',{},h('span'))
      //等于3
      children = [children];
    }

    return createvnode(type, propsChildren, children); //children的情况有两种 文本 / 数组
  }
}
