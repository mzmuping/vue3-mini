import { ReacitveFlags } from "./typeProps";
import { activeEffect } from "./effect";

export const mutableHandlers = {
  get(target, key, receiver) {
    //去代理对象上获取值，就走get

    if (key === ReacitveFlags.IS_REACTIVE) {
      return true;
    }

    //receiver改变this指向
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    //去代理上设置值，执行set
    //监听属性被设置新增
    return Reflect.set(target, key, value, receiver);
  },
};
