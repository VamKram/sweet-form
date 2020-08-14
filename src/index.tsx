import React from 'react';
import ReactDOM from 'react-dom';
import FormRender from './App';
const schema = {
    data: {
        test: {
            name: '{{age + 2}}',
            age: '11',
        },
        gender: '',
    },
    components: [
        {
            type: 'input',
            name: 'name',
            path: 'test.name',
        },
        {
            type: 'input',
            name: 'age',
            path: 'test.age',
        },
        {
            type: 'input',
            name: 'gender',
            path: 'gender',
            attributes: {
                disabled: "{{test.name === 'aaa'}}",
                hidden: '{{+test.name % 2 == 1 ? true : false}}',
            },
        },
    ],
    layout: [
        {
            title: 'test',
            element: [
                'name',
                { title: 'test1', element: ['name', 'gender'] },
                { title: 'test2', element: ['name', 'gender'] },
            ],
        },
        {
            title: 'gender',
            element: ['gender'],
        },
        'gender',
    ],
};

const data = {
    name: 1,
    age: 1,
    gender: 2,
};
ReactDOM.render(<FormRender schema={schema as any} source={data} />, document.getElementById('app'));
