import React from 'react';
import ReactDOM from 'react-dom';
import FormRender from './App';
import demo from './components/originComponent';
const schema = {
    data: {
        test: {
            name: '{{age + 2}}',
            age: '11',
            checkbox: 'Apple',
            select: 'Apple',
            select1: 'Apple',
            radio: 'Apple',
        },
        textarea: "",
        gender: '',
        switch: true,
        cascader: [],
    },
    components: [
        {
            type: 'input',
            name: 'name',
            label: 'name',
            path: 'test.name',
        },
        {
            type: 'checkbox',
            name: 'checkbox',
            label: 'checkbox',
            options: [
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' },
            ],
            attributes: {
                disabled: '{{+test.name % 2 == 1 ? true : false}}',
            },
            path: 'test.checkbox',
        },
        {
            type: 'select',
            name: 'select',
            label: 'select',
            options: "{{options}}",
            attributes: {
                disabled: '{{+test.name % 2 == 1 ? true : false}}',
            },
            path: 'test.select',
        },
        {
            type: 'select',
            name: 'select1',
            label: 'select1',
            options: "{{options}}",
            attributes: {
                multiple: true,
                disabled: '{{+test.name % 2 == 1 ? true : false}}',
            },
            path: 'test.select1',
        },
        {
            type: 'radio',
            name: 'radio',
            label: 'radio',
            options: [
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' },
            ],
            attributes: {
                disabled: '{{+test.name % 2 == 1 ? true : false}}',
            },
            path: 'test.radio',
        },
        {
            type: 'input',
            name: 'age',
            label: 'age',
            path: 'test.age',
        },
        {
            type: 'input',
            name: 'gender',
            path: 'gender',
            label: 'gender',
            attributes: {
                disabled: "{{test.name === 'aaa'}}",
                hidden: '{{+test.name % 2 == 1 ? true : false}}',
            },
        },
        {
            type: 'textarea',
            name: 'textarea',
            path: 'textarea',
            label: 'textarea',
            attributes: {
                disabled: "{{test.name === 'aaa'}}",
            },
        },
        {
            type: 'switch',
            name: 'switch',
            path: 'switch',
            label: 'switch'
        },
        {
            type: 'cascader',
            name: 'cascader',
            path: 'cascader',
            label: 'cascader'
        },
    ],
    layout: [
        'name',
        'age',
        'gender',
        {
            title: '组合',
            element: ['checkbox', 'select'],
        },
        "radio",
        "textarea",
        "switch",
        "cascader",
        "select1"
    ],
    // layout: [
    //     {
    //         element: [
    //             'name',
    //             {element: ['name', 'gender'] },
    //             {element: ['age', 'gender'] },
    //         ],
    //     },
    //     {
    //         element: ['gender'],
    //     },
    //     'gender',
    // ],
};

const data = {
    name: 1,
    age: 1,
    gender: 2,
    options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
    ]
};

ReactDOM.render(
    <FormRender schema={schema as any} source={data} componentLib={demo} />,
    document.getElementById('app'),
);
