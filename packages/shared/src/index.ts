import { ReacitveFlags } from "./typeProps";

export const isObject = (value) => {
  return typeof value === "object" && value !== null;
};

export const isFunction = (value) => {
  return typeof value === "function";
};

export const isArray = Array.isArray;

export const assign = Object.assign;

//是否响应式
export const isReactive = (target) => {
  return !!(target && target[ReacitveFlags.IS_REACTIVE]);
};
