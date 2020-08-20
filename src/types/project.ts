import { FormItemType, ValidationResult } from '../constant';
import { CSSProperties, ElementType, ReactNode } from 'react';

export interface HashObj {
    [key: string]: any;
}

export type TTemplateResult = string | number | boolean;

export type callback<T> = () => T;

export type TAttributes = 'required' | 'disabled' | 'visible' | 'hidden' | 'multiple' | 'async';

export type validator = (data: HashObj, notice: (error?: string) => ValidationResult) => ValidationResult;

interface IValidation {
    rules: validator[];
    error: string[];
    warn: string[];
}

export type TAjaxMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'getJSON';
export type TAsyncConfig = {
    url: string;
    method: TAjaxMethod;
    formatAction: string;
    config: Object;
    body?: any;
    header?: Object;
};
export type TAttributesProps = Partial<Record<TAttributes, boolean | string | TAsyncConfig>>;

export type TOptions = Array<{ label: string; value: any }>;

export interface commonComponentProps extends TAttributesProps {
    value: any;
    path: string;
    label: string;
    options: TOptions | string;
    onChange: formChange;
    onSearch: formChange;
    styles?: CSSProperties & { row?: number | string };
    validators?: validator[];
}

export interface formBuilderComponentProps {
    value: any;
    path: string;
    label: string;
    options: TOptions | string;
    onFormChange?: formChange;
    attributes?: TAttributesProps;
    styles?: CSSProperties & { row?: number | string };
    validators?: validator[];

    [key: string]: any;
}

export interface IBaseComponent {
    type: FormItemType;
    options: TOptions | string;
    name: string;
    label: string;
    value?: any;
    path: string;
    $$value?: any;
    $$component?: ElementType<formBuilderComponentProps> | null;
    attributes?: TAttributesProps;
    validation?: IValidation;
    styles?: CSSProperties & { row: number | string };
}

export type formChange = (changed: any) => void;

export interface CustomComponent extends IBaseComponent {
    parent: string | null;
    typeName: string;
    extension: HashObj;
    xActions: Record<string, formChange>;
}

export type IFormComponentTree<T extends HashObj = HashObj> = T extends { type: FormItemType.CUSTOM }
    ? CustomComponent
    : IBaseComponent;

export type TAllComponents = CustomComponent & IBaseComponent;

export type TSchemaLayout = Array<
    { title?: string; element: (ArrayType<TSchemaLayout> | string)[] } | string
>;
export interface ISchema {
    data: HashObj;
    components: TAllComponents[];
    layout: TSchemaLayout;
    result?: HashObj;
}

export type TComponentConfig = { [k in FormItemType]?: ReactNode | null };

export type HashType<T> = { [k in string]: T };

export type ArrayType<T> = T extends (infer R)[] ? R : never;
