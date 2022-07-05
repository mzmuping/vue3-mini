export let activeEffect = undefined;
class ReactiveEffect {
  public parent = null; //依赖收集节点
  //这里表示在实例上新增active属性
  public active = true; //这个effect 默认激活状态
  constructor(public fn) {} //用户传递的参数也会当this上this.fn = fn
  //执行effect
  run() {
    if (!this.active) {
      //这里表示如果是非激活的情况，只需要执行函数，不需要进行收集依赖
    }

    //这里就是要依赖收集了，核心就是将当前effect 和 稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect;
      activeEffect = this;
      //当稍后调用取值操作的时候就可以获取到这个全局的activeEffect
      return this.fn();
    } finally {
      activeEffect = this.parent;
      //   this.parent = null;
    }
  }
}
export function effect(fn) {
  //这里fn可以根据状态变化，重新执行，effect可以嵌套着写
  const _effect = new ReactiveEffect(fn); //创建响应式effect
  _effect.run(); //默认执行一次
}
