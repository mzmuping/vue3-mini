import { isObject } from "@vue/shared";
import { reactive } from "@vue/reactivity";
import { tarckEffect, triggerEffects } from "./effect";

export function ref(value) {
  return new RefImpl(value);
}

//转换响应式对象
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

function toRef(object, key) {}

function toRefs(object) {}

//
class RefImpl {
  public _value;
  public dep = new Set();
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
