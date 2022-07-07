import { ReactiveEffect } from "./effect";
import { isObject, isReactive } from "@vue/shared";

function traversal(value, set = new Set()) {
  //第一步递归有终结条件，不是对象就不在递归了
  if (!isObject(value)) return value;

  //考虑循环引用问题
  if (set.has(value)) {
    return value;
  }

  set.add(value);

  for (let key in value) {
    traversal(value[key], set);
  }

  return value;
}

//source 是用户传入的对象，cb 就是对应的用户的回调
export function watch(sourse, cb) {
  let getter;
  if (isReactive(sourse)) {
    //
    getter = () => traversal(sourse);
  } else if (typeof sourse === "function") {
    getter = sourse;
  } else {
    return sourse;
  }
  let cleanup;
  //这里做异步
  const onCleanup = (fn) => {
    cleanup = fn;
  };
  let oldValue;
  const job = () => {
    //执行 cb前，执行上次onCleanup 回调函数
    if (cleanup) cleanup();
    const newValue = effect.run();
    cb(newValue, oldValue, onCleanup);
    oldValue = newValue;
  };
  //监控自检构造的函数，变化后重新执行job
  const effect = new ReactiveEffect(getter, job);

  oldValue = effect.run();
}
