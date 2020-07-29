import { FormItemType, ValidationResult } from '../constant';
import { CSSProperties, ElementType, ReactElement, ReactNode, ReactType } from 'react';
import { formBuilderComponentProps } from '../components/originComponent';

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

export interface IBaseComponent {
    type: FormItemType;
    value: any;
    path: string;
    $$value: any;
    $$component?: ElementType<formBuilderComponentProps> | null;
    attributes?: Partial<Record<TAttributes, boolean | string>>;
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
export interface ISchema {
    data: HashObj;
    components: TAllComponents[];
}

export type TComponentConfig = { [k in FormItemType]?: ReactNode | null };

export type HashType<T> = { [k in string]: T };

export interface IBuildTreeParams {
    component: HashType<ReactNode>;
    actions: HashType<formChange>;
}
