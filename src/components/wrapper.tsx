import React, { ElementType, FC } from 'react';
import TemplateEngine from '../helper/template-engine';
import { get, isString } from '../utils';
import { useManage } from '../hooks';
import { formBuilderComponentProps, HashObj, TAttributesProps } from '../types/project';

export const Wrapper: FC<{ title: string }> = ({ title, children }) => {
    return (
        <div className="item-1-2">
            {title && <h1>{title}</h1>}
            {children}
        </div>
    );
};

export const adaptorComponent = (Component: ElementType, config?: HashObj) => {
    return ({
        label,
        value,
        path,
        options,
        validators,
        styles,
        attributes,
        onFormChange,
    }: formBuilderComponentProps) => {
        onFormChange = config?.onFormChange ? config?.onFormChange : onFormChange;

        const manage = useManage();
        const formatVal = get(value, `result.${path}`, '');
        const formatAttributes = Object.entries(attributes || {}).reduce((acc, [key, value]) => {
            acc[key] = TemplateEngine.isTpl(value as string) ? manage.modifyTemplate(value) : value;
            return acc;
        }, {} as TAttributesProps);
        if (isString(options) && TemplateEngine.isTpl(options)) {
            options = manage.modifyTemplate(options, manage.source);
        }
        // const handleRows = row => "row-8"
        // validation
        const labelComponent = label && <div className="field-label">{label}</div>;
        return (
            <div className={Boolean(formatAttributes?.hidden) ? 'hidden' : ''}>
                {labelComponent}
                <Component
                    options={options}
                    label={label}
                    value={formatVal}
                    {...formatAttributes}
                    style={styles}
                    onChange={onFormChange}
                />
            </div>
        );
    };
};
