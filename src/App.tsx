import React, { ReactComponentElement } from 'react';
import './App.less';
import { FormProvider } from './core';
import { useFormChange } from './hooks';

export default function FormRender() {
    const formData = { a: { b: { c: { data: 111 } } } };
    return (
        <FormProvider<typeof formData> formData={formData}>
            <Middle />
        </FormProvider>
    );
}

function Middle(): ReactComponentElement<any> {
    return <Child />;
}

function Child() {
    const [state, updater] = useFormChange('a.b.c');
    return (
        <div>
            {JSON.stringify(state)}
            <button
                onClick={() => {
                    updater({ data: 232 });
                }}
            >
                +
            </button>
        </div>
    );
}
