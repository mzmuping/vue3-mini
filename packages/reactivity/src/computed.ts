import { isFunction } from "@vue/shared";
import { ReactiveEffect, tarckEffect, triggerEffects } from "./effect";

class ConputedRefImpl {
  public effect;
  public _dirty = true; //默认取值的时候进行计算
  public __v_isReadonly = true;
  public __v_isRef = true;
  public _value;
  public dep = new Set();
  constructor(public getter, public setter) {
    //
    this.effect = new ReactiveEffect(getter, () => {
      //稍后依赖的属性变化
      if (!this._dirty) {
        console.log("调度函数");
        this._dirty = true;
        //实现触发更新
        triggerEffects(this.dep);
      }
    });
  }

  get value() {
    tarckEffect(this.dep);

    if (this._dirty) {
      //说明这个值是脏的
      this._dirty = false;
      this._value = this.effect.run();
    }

    return this._value;
  }

  set value(value) {
    this.setter(value);
  }
}

export const computed = (getterOrOptions) => {
  let onlyGeeter = isFunction(getterOrOptions);
  let getter;
  let setter;

  if (onlyGeeter) {
    getter = getterOrOptions;
    setter = () => {
      console.warn("no set");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ConputedRefImpl(getter, setter);
};
