import { formChange, TAttributes, TComponentConfig, validator } from '../types/project';
import React, { CSSProperties } from 'react';
import { FormItemType } from '../constant';

export interface formBuilderComponentProps {
    value: any;
    onFormChange?: formChange;
    attributes?: Partial<Record<TAttributes, boolean | string>>;
    styles?: CSSProperties & { row?: number | string };
    validators?: validator[];
    [key: string]: any;
}
function Input({
    value = '',
    onFormChange,
    attributes = {},
    styles = {},
    validators = [],
}: formBuilderComponentProps) {
    return <input onChange={onFormChange} value={value} />;
}

const Config: TComponentConfig = {
    [FormItemType.INPUT]: Input,
};

export default Config;
