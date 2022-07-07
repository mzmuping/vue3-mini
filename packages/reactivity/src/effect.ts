export let activeEffect = undefined;
/**
 * 解决effect嵌套原理，树形结构parent(vue2使用栈原理)
 * 案例分析：
 * effect(()=>{   // parent=null; activeEffect = e1;
 *    state.name;  // name -> e1
 *    effect(()=>{// parent=e1; activeEffect = e2;
 *      state.age; // name -> e2
 *     })
 *    effect.address; // activeEffect = parent;
 * })
 */
export class ReactiveEffect {
  public parent = null; //依赖收集节点
  public deps = []; //
  //这里表示在实例上新增active属性
  public active = true; //这个effect 默认激活状态
  constructor(public fn, public scheduler) {} //用户传递的参数也会当this上this.fn = fn
  //执行effect
  run() {
    if (!this.active) {
      //这里表示如果是非激活的情况，只需要执行函数，不需要进行收集依赖
      return this.fn();
    }

    //这里就是要依赖收集了，核心就是将当前effect 和 稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect;
      activeEffect = this;
      clearupEffect(this);
      //当稍后调用取值操作的时候就可以获取到这个全局的activeEffect
      return this.fn();
    } finally {
      activeEffect = this.parent;
    }
  }

  stop() {
    if (this.active) {
      this.active = false;
      clearupEffect(this);
    }
  }
}
export function effect(fn, options: any = {}) {
  //这里fn可以根据状态变化，重新执行，effect可以嵌套着写
  const _effect = new ReactiveEffect(fn, options.scheduler); //创建响应式effect
  _effect.run(); //默认执行一次

  const runner = _effect.run.bind(_effect); //绑定this执行
  runner.effect = runner; //将effect挂载到runner函数上
  return runner;
}

const targetsMap = new WeakMap();
//收集依赖
export function track(target, type, key) {
  //对象 某个属性 -》 多个effect
  //weakMap = {对象：map{name:Set}}
  //{对象：{name:[]}}
  if (!activeEffect) return;

  let depsMap = targetsMap.get(target);
  if (!depsMap) {
    targetsMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  //同个属性多个使用，只收集一次
  tarckEffect(dep);
}

//收集effect
export function tarckEffect(dep) {
  if (!activeEffect) return;
  let shouldTrack = !dep.has(activeEffect); //去重
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep); //让effect记录对应的dep,稍后清理的时候会用到
  }
}

//触发
export function trigger(target, type, key, vlaue, oldValue) {
  const depsMap = targetsMap.get(target);

  if (!depsMap) return; //是否存在

  let effects = depsMap.get(key); //获取集合

  //属性对应的effect
  if (effects) {
    triggerEffects(effects);
  }
}
//触发effect
export function triggerEffects(effects) {
  effects = new Set(effects);
  effects.forEach((effect) => {
    //如果effect有设置key值，回死循环（effect->set->effect->set ....），所以屏蔽
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler(); //有调度函数
      } else {
        effect.run();
      }
    }
  });
}

//清除effect
export function clearupEffect(effect) {
  let { deps } = effect;

  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }

  effect.deps.length = 0;
}
