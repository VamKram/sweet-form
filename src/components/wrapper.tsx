import React, { ElementType, FC, useState } from 'react';
import TemplateEngine from '../helper/template-engine';
import { get, isAsyncConfig, isString, noop } from '../utils';
import { useManage } from '../hooks';
import { formBuilderComponentProps, HashObj, TAttributesProps } from '../types/project';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap } from 'rxjs/operators';

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
        const reg = /{{value}}/i;
        const manage = useManage();
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
        console.log('>>>>>>>>>relation', relation);
        // const handleRows = row => "row-8"
        // validation
        const labelComponent = label && <div className="field-label">{label}</div>;
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
            </div>
        );
    };
};
