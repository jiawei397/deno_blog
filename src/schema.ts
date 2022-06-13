// deno-lint-ignore-file no-explicit-any
import { Reflect } from "deno_reflect";
export type TargetInstance = any;
export type Constructor = new (...args: any[]) => any;
export type Target = Constructor & {
  [x: string]: any;
};

const PROP_META_KEY = Symbol("design:prop");

export interface SchemaType {
  /**
   * Adds a required validator to this SchemaType
   */
  required?: boolean | [required: boolean, errorMsg: string];
}

export function Prop(props: SchemaType = {}) {
  return function (target: TargetInstance, propertyKey: string) {
    addSchemaMetadata(target, propertyKey, props);
    return target;
  };
}

export function addSchemaMetadata(
  target: TargetInstance,
  propertyKey: string,
  props: any = {},
) {
  Reflect.defineMetadata(PROP_META_KEY, props, target, propertyKey);
}

const schemaPropsCaches = new Map();
const instanceCache = new Map();

export function getInstance(cls: Target) {
  if (instanceCache.has(cls)) {
    return instanceCache.get(cls);
  }
  const instance = new cls();
  instanceCache.set(cls, instance);
  return instance;
}

export function getSchemaMetadata(target: Target): Record<string, any>;
export function getSchemaMetadata<T = any>(
  target: Target,
  propertyKey?: string,
): T;
export function getSchemaMetadata(
  target: Target,
  propertyKey?: string,
) {
  const instance = getInstance(target);
  if (propertyKey) {
    return Reflect.getMetadata(PROP_META_KEY, instance, propertyKey);
  }
  let map: Record<string, any> = schemaPropsCaches.get(target);
  if (!map) {
    map = {};
    Object.keys(instance).forEach((key) => {
      const meta = Reflect.getMetadata(PROP_META_KEY, instance, key);
      if (meta !== undefined) {
        map[key] = meta;
      }
    });
    schemaPropsCaches.set(target, map);
  }
  return map;
}
