export function patchEvents(el, eventName: string, nextValue) {
  //可以移除掉事件，在重新绑定
  // remove => add ====> add + 自定义事件（里面调用绑定的方法）

  let invokers = el._vel || (el._vel = {});

  let exits = invokers[eventName];

  //注册过
  if (exits && nextValue) {
    exits.value = nextValue;
  } else {
    //没注册，onClick
    let event = eventName.slice(2).toLowerCase();

    if (nextValue) {
      let invoker = craeteInoker(nextValue);

      el.addEventListener(event, invoker);
    } else if (exits) {
      //删除
      el.removeEventListener(event, exits);
      invokers[eventName] = undefined;
    }
  }
}

export function craeteInoker(callback: Function) {
  let inoker: any = (e) => inoker.value(e);
  inoker.value = callback;
  return inoker;
}
