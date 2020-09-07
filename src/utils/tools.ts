import { HashObj } from '../types/project';
import { isObject, isUndefined } from './checker';

export const get = (obj: HashObj, path: string | Array<string>, defaultValue: any = undefined): any => {
    const travel = (regexp: RegExp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
};

/**
 * just for pure object, not cover other object like function/Date..
 * @param {HashObj} obj
 * @param {string | Array<string>} path
 * @param value
 * @return {HashObj}
 */
export const set = <T extends HashObj = HashObj>(
    obj: T,
    path: string | Array<string>,
    value: any = undefined,
) => {
    if (isUndefined(value)) {
        console.error(`The Value Must Be Given. ${JSON.stringify(obj)} ${path} ${value}`);
        return obj;
    }
    String.prototype.split
        .call(path, /[.,]/i)
        .filter(Boolean)
        .reduce((acc, cur, curInd, arr) => {
            const isLast = curInd === arr.length - 1;
            let result = acc[cur];
            if ((isUndefined(result) || !isObject(result)) && !isLast) {
                acc[cur] = {};
            }
            if (isLast) {
                acc[cur] = value;
            }
            return acc[cur];
        }, obj as HashObj);
    return obj;
};

/**
 * simple for clone
 * @param {HashObj} param
 * @return {any}
 */
export const simpleCloneObj = (param: HashObj) => JSON.parse(JSON.stringify(param));

/**
 * deep clone object with multiple data type
 * @param {HashObj} obj
 * @param {WeakMap<object, any>} hash
 * @return {HashObj}
 */
export function deepClone(obj: HashObj, hash = new WeakMap()): HashObj {
    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    const result =
        obj instanceof Set
            ? new Set(obj) // See note about this!
            : obj instanceof Map
            ? new Map(Array.from(obj, ([key, val]) => [key, deepClone(val, hash)]))
            : obj instanceof Date
            ? new Date(obj)
            : obj instanceof RegExp
            ? new RegExp(obj.source, obj.flags)
            : obj.constructor
            ? new (obj as any).constructor()
            : Object.create(null);
    hash.set(obj, result);
    return Object.assign(result, ...Object.keys(obj).map(key => ({ [key]: deepClone(obj[key], hash) })));
}

export function pickByKeys(all: any[], keyName: string, keys: string[]) {
    return all.filter(item => keys.includes(String(item[keyName])));
}

export function noop(){}

export function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    } else if (isObject(obj1) && isObject(obj2)) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) { return false; }
        for (const prop in obj1) {
            if (!deepEqual(obj1[prop], obj2[prop])) {
                return false;
            }
        }
        return true;
    }
    function isObject(obj) {
        return typeof obj === "object" && obj != null;
    }
    return false;
}