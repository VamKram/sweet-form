import React, { ReactNode, useRef } from 'react';
import './App.less';
import { FormProvider } from './core';
import { useFormChange } from './hooks';
import { HashType, ISchema } from './types/project';
import BuildSchema from './core/builder/buildSchema';

export default function FormRender({
    schema,
    source,
    componentLib,
}: {
    schema: ISchema;
    source: any;
    componentLib: HashType<ReactNode>;
}) {
    if (!schema) {
        console.error("Must have props 'schema'");
        return null;
    }

    return (
        <FormProvider formData={schema} source={source}>
            <FormContent componentLib={componentLib} />
        </FormProvider>
    );
}

function FormContent({ componentLib }) {
    const { current: builder } = useRef(new BuildSchema());
    const [state] = useFormChange<ISchema>('a.b.c');
    const result = builder.build(state, componentLib);
    console.log('>>>>>>>>>state', state);
    return (
        <div className="pure-g">
            <div style={{ width: '80%', whiteSpace: "pre-line" }}>{JSON.stringify(state.result || {}, null, 2)}</div>
            {result}
        </div>
    );
}
