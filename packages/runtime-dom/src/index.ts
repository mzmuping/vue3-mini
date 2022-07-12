import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRender } from "@vue/runtime-core";

const renderOptions = Object.assign(nodeOps, { patchProp });

console.log(renderOptions);

export function render(vnode, container) {
  createRender(renderOptions).render(vnode, container);
}

export * from "@vue/runtime-core";
