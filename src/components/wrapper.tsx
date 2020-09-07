import React, { ElementType, FC, useState } from 'react';
import TemplateEngine from '../helper/template-engine';
import { get, isAsyncConfig, isString, noop } from '../utils';
import { useManage } from '../hooks';
import { IFormBuilderComponentProps, HashObj, TAttributesProps } from '../types/project';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap } from 'rxjs/operators';
import { useValidation } from '../hooks';


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
                validation,
                styles,
                attributes,
                onFormChange,
            }: IFormBuilderComponentProps) => {
        onFormChange = config?.onFormChange ? config?.onFormChange : onFormChange;
        // TEMP
        const reg = /{{value}}/i;
        const manage = useManage();
        useValidation(path, validation);

        const [relation, setRelation] = useState<unknown>();
        const formatVal = get(value, `result.${path}`, '');
        const formatAttributes = Object.entries(attributes || {}).reduce((acc, [key, value]) => {
            acc[key] = TemplateEngine.isTpl(value as string) ? manage.getTemplateResult(value) : value;
            return acc;
        }, {} as TAttributesProps);

        if (isString(options) && TemplateEngine.isTpl(options)) {
            options = manage.getTemplateResult(options, manage.source);
        }

        function onSearch(val: string) {
            if (isAsyncConfig(formatAttributes.async)) {
                let { url, method, header, body, formatAction, config } = formatAttributes.async;
                url = url.replace(reg, val);
                fromPromise(
                    fetch(url, {
                        method,
                        ...(config || {}),
                        body: JSON.stringify(body),
                        headers: header as any,
                    }),
                )
                    .pipe(flatMap(res => res.json()))
                    .subscribe(res => {
                        const formatter = manage?.actions?.[formatAction];
                        if (typeof formatter === 'function') {
                            res = formatter(res);
                        }
                        setRelation(res);
                    });
            }
        }

        const error = Array.isArray(validation?.errors) && validation?.errors.map(([_, msg]) => <div
            className="size-12 danger text-center">{msg}</div>);
        const requireComponent = formatAttributes.required && <span className="danger">*</span>;
        const labelComponent = label && <div className="field-label">{label}{requireComponent}</div>;

        return (
            <div className={Boolean(formatAttributes?.hidden) ? 'hidden' : ''}>
                {labelComponent}
                <Component
                    {...(formatAttributes.async ? { onSearch } : noop)}
                    options={relation || options}
                    label={label}
                    value={formatVal}
                    {...formatAttributes}
                    style={styles}
                    onChange={onFormChange}
                />
                {error}
            </div>
        );
    };
};
