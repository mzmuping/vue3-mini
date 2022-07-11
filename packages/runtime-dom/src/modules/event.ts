export function patchEvents(el, eventName: string, nextValue) {
  //可以移除掉事件，在重新绑定
  // remove => add ====> add + 自定义事件（里面调用绑定的方法）

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
      invokers[eventName] = undefined;
    }
  }
}

export function craeteInoker(callback: Function) {
  let inoker: any = (e) => inoker.value(e);
  inoker.value = callback;
  return inoker;
}
