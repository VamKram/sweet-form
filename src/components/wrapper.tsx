import React, { ElementType, FC } from 'react';
import { get } from '../utils';
import { useManage } from '../hooks';
import TemplateEngine from '../helper/template-engine';
import { formBuilderComponentProps } from '../types/project';

export const Wrapper: FC<{ title: string }> = ({ title, children }) => {
    return (
        <div className="item-1-2">
            {title && <h1>{title}</h1>}
            {children}
        </div>
    );
};

export const adaptorComponent = (Component: ElementType) => {
    return ({ value, path, validators, styles, attributes, onFormChange }: formBuilderComponentProps) => {
        const manage = useManage();
        const formatVal = get(value, `result.${path}`, '');
        const formatAttributes = Object.entries(attributes || {}).reduce((acc, [key, value]) => {
            acc[key] = TemplateEngine.isTpl(value as string) ? manage.modifyTemplate(value) : value;
            return acc;
        }, {});
        // const handleRows = row => "row-8"
        // validation
        return (
            <Component
                value={formatVal}
                {...formatAttributes}
                {...styles}
                onChange={e => onFormChange?.(e.target.value)}
            />
        );
    };
};
