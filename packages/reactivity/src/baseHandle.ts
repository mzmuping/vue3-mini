import { ReacitveFlags } from "../../shared/src/typeProps";
import { track, trigger } from "./effect";
import { reactive } from "./reactive";
import { isObject } from "@vue/shared";
export const mutableHandlers = {
  get(target, key, receiver) {
    //去代理对象上获取值，就走get

    if (key === ReacitveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, "get", key);
    //receiver改变this指向

    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      res = reactive(res); //深度代理
    }

    return res;
  },
  set(target, key, value, receiver) {
    //去代理上设置值，执行set
    //监听属性被设置新增
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);

    if (oldValue !== value) {
      //触发effect
      trigger(target, "set", key, value, oldValue);
    }
    return result;
  },
};
