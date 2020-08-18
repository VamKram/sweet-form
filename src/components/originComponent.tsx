import React from 'react';
import { TComponentConfig } from '../types/project';
import { FormItemType } from '../constant';
import { adaptorComponent } from './wrapper';
import { Checkbox, Input, Select, Radio, Switch, Cascader } from "antd";
const { Option } = Select;

const Config: TComponentConfig = {
    [FormItemType.INPUT]: adaptorComponent(props => (
        <Input {...props} onChange={e => props.onChange(e.target.value)} />
    )),
    [FormItemType.CHECKBOX]: adaptorComponent(props => {
        return (
            <Checkbox.Group
                disabled={props.disabled}
                options={props.options}
                defaultValue={typeof props.value === 'string' ? [props.value] : props.value}
                onChange={checkedValues => props.onChange(checkedValues)}
            />
        );
    }),
    [FormItemType.SELECT]: adaptorComponent(props => {
        return (
            <Select
              mode={props.multiple && "multiple"}
              defaultValue={props.value}
              style={{width: 400}}
              onChange={props.onChange}>
                {(props.options || []).map(({ label, value }) => (
                    <Option key={label} value={value}>{label}</Option>
                ))}
            </Select>
        );
    }),
    [FormItemType.RADIO]: adaptorComponent(props => {
        return (
            <Radio.Group
              value={props.value}
              onChange={e => props.onChange(e.target.value)}>
                {(props.options || []).map(({ label, value }) => (
                    <Radio value={value}>{label}</Radio >
                ))}
            </Radio.Group>
        );
    }),
    [FormItemType.TEXTAREA]: adaptorComponent(props => {
        return (
            <Input.TextArea
              disabled={props.disabled}
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
            />
        );
    }),
    [FormItemType.SWITCH]: adaptorComponent(props => {
        return (
          <Switch
            disabled={props.disabled}
            checked={props.value}
            onChange={checked => props.onChange(checked)}
          />
        );
    }),
    [FormItemType.CASCADER]: adaptorComponent(props => {
        const options = [
            {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                    {
                        value: 'hangzhou',
                        label: 'Hangzhou',
                        children: [
                            {
                                value: 'xihu',
                                label: 'West Lake',
                            },
                        ],
                    },
                ],
            },
            {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                    {
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [
                            {
                                value: 'zhonghuamen',
                                label: 'Zhong Hua Men',
                            },
                        ],
                    },
                ],
            },
        ];
        return (
          <Cascader
            options={options}
            onChange={props.onChange}
          />
        );
    }),
};

export default Config;
