export function patchStyle(el, preValue, nextValue) {
  //样式需要比对差异

  //覆盖
  for (let key in nextValue) {
    el.style[key] = nextValue[key];
  }

  if (preValue) {
    for (let key in preValue) {
      //style属性没有
      if (nextValue === null || nextValue === undefined) {
        el.style = null;
        break;
      }
      if (nextValue[key] === null) {
        //去除没有的
        el.style[key] = null;
      }
    }
  }
}
