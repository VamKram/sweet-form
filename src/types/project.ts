import { FormItemType, ValidationResult } from "../constant";
import { CSSProperties, ElementType, ReactNode } from "react";

export interface HashObj {
    [key: string]: any;
}

export type TTemplateResult = string | number | boolean;

export type callback<T> = () => T;

export type TAttributes = 'required' | 'disabled' | 'visible' | 'hidden';

export type validator = (data: HashObj, notice: (error?: string) => ValidationResult) => ValidationResult;

interface IValidation {
    rules: validator[];
    error: string[];
    warn: string[];
}

export interface formBuilderComponentProps {
    value: any;
    path: string;
    onFormChange?: formChange;
    attributes?: Partial<Record<TAttributes, boolean | string>>;
    styles?: CSSProperties & { row?: number | string };
    validators?: validator[];

    [key: string]: any;
}

export interface IBaseComponent {
    type: FormItemType;
    name: string;
    value?: any;
    path: string;
    $$value?: any;
    $$component?: ElementType<formBuilderComponentProps> | null;
    attributes?: Partial<Record<TAttributes, boolean>>;
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

export type TComponents = IFormComponentTree[];
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

export interface IBuildTreeParams {
    component: HashType<ReactNode>;
    actions: HashType<formChange>;
}

export type ArrayType<T> = T extends (infer R)[] ? R : never;
