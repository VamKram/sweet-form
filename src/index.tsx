import FormRender from './App';
import { adaptorComponent } from './components/wrapper';
import { useManage } from './hooks';
import ReactDOM from 'react-dom';
import componentLib from './components/originComponent';
import { FormItemType } from "./constant";
import React from "react";
//
// export default FormRender;
//
// export { FormRender, adaptorComponent, useManage };
//TODO 每次修改都更新的问题 样式依赖外部 data的变化触发改动
const schema = {
    data: {
        PassportNO: "",
        PassportNO1: "",
        PassportNO2: "",
        PassportNO3: "",
        PassportNO4: "",
        PassportNO5: "",
        PassportNO6: "",
    },
    components:[
        {
            type: FormItemType.INPUT,
            name: 'PassportNO',
            label: '证件号码',
            path: 'PassportNO',
            validation: {
                rules: ['required']
            }
        },{
            type: FormItemType.INPUT,
            name: 'PassportNO1',
            label: '证件号码',
            path: 'PassportNO1',
            validation: {
                rules: ['required']
            }
        },{
            type: FormItemType.INPUT,
            name: 'PassportNO2',
            label: '证件号码',
            path: 'PassportNO2',
            validation: {
                rules: ['required']
            }
        },{
            type: FormItemType.INPUT,
            name: 'PassportNO3',
            label: '证件号码',
            path: 'PassportNO3',
            validation: {
                rules: ['required']
            }
        },{
            type: FormItemType.INPUT,
            name: 'PassportNO4',
            label: '证件号码',
            path: 'PassportNO4',
            validation: {
                rules: ['required']
            }
        },{
            type: FormItemType.INPUT,
            name: 'PassportNO5',
            label: '证件号码',
            path: 'PassportNO5',
            validation: {
                rules: ['required']
            }
        },
        {
            type: FormItemType.INPUT,
            name: 'PassportNO6',
            label: '证件号码',
            path: 'PassportNO6',
            validation: {
                rules: ['required']
            }
        },
    ],
    layout: [
      'PassportNO',
        {
            title: "asd",
            element: ['PassportNO1',
                'PassportNO2',
                'PassportNO3',]
        },
      'PassportNO4',
      'PassportNO5',
      'PassportNO6',
    ]
}
ReactDOM.render(
    <FormRender
        schema={schema}
        source={{}}
        componentLib={componentLib}
        actions={{}}
        onFormChange={val => console.log('>>>>>>>>>val', val)}
    />,
    document.getElementById('app'),
);
