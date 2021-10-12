import register from "./callback-registry";

export { default as load } from "./load";
export { default as destroy } from "./destroy";
export { default as show } from "./show";
export { default as hide } from "./hide";
export { default as update } from "./update";
export { default as enable } from "./enable";
export { default as disable } from "./disable";
export { add, remove } from "./item";

export const onReady = register("onReady");
export const onShippingRequired = register("onShippingRequired");
export const onAuthentication = register("onAuthentication");
export const onPayment = register("onPayment");
export const onStart = register("onStart");
export const onAbort = register("onAbort");
export const onHide = register("onHide");
export const onShow = register("onShow");
export const onUpdate = register("onUpdate");
export const onDestroy = register("onDestroy");
export const onError = register("onError");
export const onDisable = register("onDisable");
export const onEnable = register("onEnable");
