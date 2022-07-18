import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRender } from "@vue/runtime-core";

const renderOptions = Object.assign(nodeOps, { patchProp });

export function render(vnode, container) {
  createRender(renderOptions).render(vnode, container);
}

export * from "@vue/runtime-core";

export { Text } from "packages/shared/src/typeProps";
