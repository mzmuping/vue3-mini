import { isObject, isReactive } from "@vue/shared";
import { mutableHandlers } from "./baseHandle";
//1)将数据转换成响应式数据
const reactiveMap = new WeakMap(); //key只能是对象，弱引用，不会导致内存泄漏
export function reactive(target) {
  if (!isObject(target)) {
    return;
  }

  /**
   * 第一次普通对象代理，我们会new proxy 代理一次
   * 如果已经代理了，直接放回
   * 并没有添加新值，
   * 原理：
   *   1) target是普通对象,获取ReacitveFlags.IS_REACTIVE为undefined,
   *   2) target是proxy对象，获取ReacitveFlags.IS_REACTIVE会走get方法，get方法里有判断
   */
  if (isReactive(target)) {
    return target;
  }

  //不能重复代理相同对象
  let exisitingProxy = reactiveMap.get(target);
  if (exisitingProxy) {
    return exisitingProxy;
  }

  //没有重新定义属性，只是代理，在取值的时候回调用get,赋值时候回调用set
  //get 陷阱中的 receiver 存在的意义就是为了正确的在陷阱中传递上下文
  // Proxy 中 get 陷阱的 receiver 不仅仅代表的是 Proxy 代理对象本身，同时也许他会代表继承 Proxy 的那个对象。
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}

//---------
/**
 * 

const parent = {
  name: "19Qingfeng",
  get value() {
    return this.name;
  },
};

const handler = {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
    // 这里相当于 return target[key]
  },
};

const proxy = new Proxy(parent, handler);

const obj = {
  name: "wang.haoyu",
};

// 设置obj继承与parent的代理对象proxy
Object.setPrototypeOf(obj, proxy);

// log: false
console.log(obj.value);
 */
