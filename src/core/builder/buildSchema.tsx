import {
    CustomComponent,
    HashObj,
    HashType,
    IBuildTreeParams,
    ISchema,
    TAllComponents,
    TComponentConfig
} from "../../types/project";

import { get, isObject, isUndefined, set } from "../../utils";
import { FormItemType } from "../../constant";
import defaultComponents from "../../components/originComponent";
import React, { ReactElement, ReactNode } from "react";
import TemplateEngine from "../../helper/template-engine";

interface IBuildSchema<T, P extends HashObj = HashObj> {
    register(path: string): void;
    generate(param: TAllComponents[]): ReactElement[] | void | null;
    build(schema: ISchema): ReactElement | null;
}

export default class BuildSchema<T, P> implements IBuildSchema<any> {
    static usefulComponent: HashType<ReactNode>;

    constructor(private engine: TemplateEngine<HashObj>) {
        this.engine = engine;
    }
    buildDataTree(dataStruct: HashObj, components: TAllComponents[]): TAllComponents[] | void {
        if (!Array.isArray(components)) {
            throw new TypeError('ComponentTree->buildDataTree: Wrong Type .Params Must Be Array');
        }
        const newComponents = [...components];
        for (let i = 0, len = newComponents.length; i < len; i++) {
            const componentItem = newComponents[i];
            if (isUndefined(componentItem)) {
                throw new Error(`buildDataTree: Component Invalid`);
            }

            const { path, type } = componentItem || {};
            const currentVal = get(dataStruct, path);

            if (isUndefined(currentVal)) {
                console.error(`buildDataTree: current: ${JSON.stringify(currentVal)}.${path} undefined`);
                throw new Error(`buildDataTree: current: ${JSON.stringify(currentVal)}.${path} undefined`);
            }

            if (!isObject(currentVal) || type === FormItemType.CUSTOM) {
                const isTpl = TemplateEngine.isTpl(currentVal);
                let resultValue = currentVal;
                if (isTpl) {
                    resultValue = this.engine.execute(currentVal, dataStruct);
                }
                set(componentItem, '$$value', resultValue);
                set(componentItem, 'value', currentVal);
                this.buildComponentTree(componentItem);
            }
        }
        return newComponents;
    }

    buildComponentTree(component: TAllComponents, componentConfig?: TComponentConfig) {
        const { type, typeName } = component;
        let componentType: FormItemType | string = type;
        if (type === FormItemType.CUSTOM) {
            if (!typeName) {
                console.error('custom must have typeName');
            }
            componentType = typeName;
        }
        set(component, '$$component', BuildSchema.usefulComponent[componentType]);
    }

    buildTree(schema: ISchema, customConfig?: IBuildTreeParams): TAllComponents[] | void {
        const { component, actions } = customConfig || {};
        console.log('>>>>>>>>>actions', actions);
        BuildSchema.usefulComponent = { ...defaultComponents, ...(component || {}) };
        const { data, components } = schema;
        if (!data || !components) {
            throw new TypeError('ComponentTree::buildTree: Data Or Component Is Invalid');
        }
        return this.buildDataTree(data, components);
    }

    build(schema: ISchema): ReactElement | null {
        const componentTree = this.buildTree(schema);
        if (Array.isArray(componentTree)) {
            const elementBox = componentTree.map(tree => {
                const { $$component: Component } = tree;
            });
        }
        return undefined;
    }

    register(path: string): void {}

    private static createJSX(compAttributes: TAllComponents): ReactElement | void {
        const { $$component: Component, value, attributes, styles, $$value } = compAttributes;
        if (Component) return <Component styles={styles} value={$$value || value} attributes={attributes} />;
    }

    private static createChildJSX(current: CustomComponent, componentSchema: TAllComponents[]){

    }

    private rateEnclosure(params: TAllComponents[]): Map<string, TAllComponents[]> {
        const map = new Map();
        params.filter(p => p.path.length === 1).forEach(item => {
            const path = item.path;
            map.set(path, [item]);
        })
        for (let i = 0, len = params.length; i < len; i++) {
            const currentItem = params[i];
            const { path } = currentItem;
            const currentPathArr = path.split(".");
            const currentRoot = currentPathArr[0];
            const mapResult = map.get(currentRoot);
            if (!mapResult) {
                throw new Error(`${path} does not have root ${JSON.stringify([...(map.keys() || [])])}`);
            }
            const result = mapResult[currentPathArr.length - 1]
            if (Array.isArray(result)) {
                mapResult[currentPathArr.length - 1].push(currentItem);
            }
            mapResult[currentPathArr.length - 1] = [currentItem];
            map.set(currentRoot, mapResult);
        }
        return map;
    }

    generate(compSchema: TAllComponents[]): ReactElement[] | void | null {
        const componentDraft = this.rateEnclosure(compSchema)
    }
}
