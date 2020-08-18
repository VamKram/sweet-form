import React, { ReactElement, ReactNode } from 'react';
import { Wrapper } from '../../components/wrapper';
import Manage from '../manage';
import produce from 'immer';
import {
    HashObj,
    HashType,
    ISchema,
    TAllComponents,
    TComponentConfig,
    TSchemaLayout,
} from '../../types/project';

import { get, isObject, isUndefined, set } from '../../utils';
import { FormItemType } from '../../constant';

interface IBuildSchema {
    register(path: string): void;
    generate(param: TAllComponents[], componentLayout: TSchemaLayout): ReactElement[] | void | null;
    build(schema: ISchema, componentLib: HashType<ReactElement>): ReactElement[] | null;
}

export default class BuildSchema implements IBuildSchema {
    components: HashType<ReactNode> = {};
    manage: Manage<HashObj>;
    setComponents(data) {
        this.components = data;
    }
    constructor() {
        this.manage = Manage.getManageInstance();
    }

    public buildDataTree(dataStruct: HashObj, components: TAllComponents[]): TAllComponents[] | void {
        if (!Array.isArray(components)) {
            throw new TypeError('ComponentTree->buildDataTree: Wrong Type .Params Must Be Array');
        }
        const newComponents: TAllComponents[] = [];
        for (let i = 0, len = components.length; i < len; i++) {
            const componentItem = components[i];
            if (isUndefined(componentItem)) {
                throw new Error(`buildDataTree: Component Invalid`);
            }

            const { path, type } = componentItem || {};
            const currentVal = get(dataStruct, path);

            if (isUndefined(currentVal)) {
                throw new Error(
                    `buildDataTree: current: wrong path ${path}, components should have corresponding component`,
                );
            }

            if (!isObject(currentVal) || type === FormItemType.CUSTOM) {
                const produceItem = produce(componentItem, draft => {
                    set(draft, 'value', currentVal);
                    this.buildComponentTree(draft);
                });
                newComponents.push(produceItem);
            }
        }
        return newComponents;
    }

    public buildComponentTree(component: TAllComponents, componentConfig?: TComponentConfig) {
        const { type, typeName } = component;
        let componentType: FormItemType | string = type;
        console.log('>>>>>>>>>componentConfig', componentConfig);
        if (type === FormItemType.CUSTOM) {
            if (!typeName) {
                console.error('custom must have typeName');
            }
            componentType = typeName;
        }
        set(component, '$$component', this.components[componentType]);
    }

    public buildTree(schema: ISchema, componentLib: HashType<ReactElement>): TAllComponents[] | void {
        this.setComponents(componentLib);
        const { data, components } = schema;
        if (!data || !components) {
            throw new TypeError('ComponentTree::buildTree: Data Or Component Is Invalid');
        }
        return this.buildDataTree(data, components);
    }

    public build(schema: ISchema, componentLib: HashType<ReactElement>): ReactElement[] | null {
        const componentTree = this.buildTree(schema, componentLib);
        if (componentTree) {
            return this.generate(componentTree, schema.layout);
        }
        return null;
    }

    register(path: string): void {}

    private createJSX(compAttributes: TAllComponents): ReactElement | void {
        const {
            label,
            $$component: Component,
            path,
            attributes,
            styles,
            extension,
            name,
            options,
        } = compAttributes;
        const triggerPath = `result.${path}`;
        if (Component) {
            return (
                <Component
                    label={label}
                    onFormChange={val => this.manage.notifyByPath(triggerPath, val)}
                    options={options}
                    key={name}
                    path={path}
                    styles={styles}
                    value={this.manage.formData as any}
                    attributes={attributes}
                    {...extension}
                />
            );
        }
    }

    public generate(compSchema: TAllComponents[], componentLayout: TSchemaLayout): ReactElement[] | null {
        return componentLayout.map(layoutInfo => {
            if (typeof layoutInfo === 'string') {
                return (
                    <Wrapper key={layoutInfo} title={''}>
                        {this.generateLayout(compSchema, layoutInfo)}
                    </Wrapper>
                );
            }
            const { title, element } = layoutInfo;
            return (
                <Wrapper key={title} title={title || ''}>
                    {element.map(el => {
                        if (typeof el !== 'string') return this.generate(compSchema, [el]);
                        return this.generateLayout(compSchema, el);
                    })}
                </Wrapper>
            );
        });
    }

    private generateLayout(compSchema: TAllComponents[], layoutInfo: string) {
        const curComponentSchema = compSchema.find(schema => schema.name === layoutInfo);
        if (!curComponentSchema) {
            console.error(`${layoutInfo} is not exist in components`);
            throw new RangeError(`${layoutInfo} is not exist in components`);
        }
        return this.createJSX(curComponentSchema) as ReactElement;
    }
}
