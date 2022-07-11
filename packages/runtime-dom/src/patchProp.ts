import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvents } from "./modules/event";
import { patchStyle } from "./modules/style";

export function patchProp(el, key, preValue, nextValue) {
  //类名 el.className
  //样式 el.style
  //events addEventLister
  //普通属性 el.setAttribute()

  if (key === "class") {
    patchClass(el, nextValue);
  } else if (key === "style") {
    patchStyle(el, preValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    patchEvents(el, key, nextValue);
  } else {
    patchAttr();
  }
}
