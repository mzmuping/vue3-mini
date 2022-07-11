import { isArray, isObject } from "@vue/shared";
import { reactive } from "@vue/reactivity";
import { tarckEffect, triggerEffects } from "./effect";

export function ref(value) {
  return new RefImpl(value);
}

//转换响应式对象
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

class ObjectRefImpl {
  constructor(public object, public key) {}

  get value() {
    return this.object[this.key];
  }

  set value(value) {
    this.object[this.key] = value;
  }
}
//响应式对象转为为单个ref
export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

//响应式对象转为为单个ref
export function toRefs(object) {
  let result = isArray(object) ? new Array(object.length) : {};

  for (let key in object) {
    result[key] = toRef(object, key);
  }

  return result;
}
//ref 转换 proxy
export function proxyRefs(object) {
  new Proxy(object, {
    get(target, key, recevier) {
      let r = Reflect.get(target, key, recevier);

      return r.__v_isRef ? r.value : r;
    },

    set(target, key, value, recevier) {
      let oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
}
//
class RefImpl {
  public _value;
  public dep = new Set();
  public __v_isRef = true;
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }

  get value() {
    tarckEffect(this.dep);
    return this._value;
  }

  set value(newValue) {
    if (newValue !== this.value) {
      this._value = toReactive(newValue);
      this.rawValue = this._value;
      triggerEffects(this.dep);
    }
  }
}
