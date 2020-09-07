import React, { ReactNode, useRef } from 'react';
import './App.less';
import { FormProvider } from './core';
import { useFormChange } from './hooks';
import { HashType, ISchema, TOptions } from './types/project';
import BuildSchema from './core/builder/buildSchema';

export default function FormRender({
                                       schema,
                                       source,
                                       actions,
                                       componentLib,
                                   }: {
    schema: ISchema;
    source: any;
    componentLib: HashType<ReactNode>;
    actions: HashType<(params: any) => TOptions>;
}) {
    if (!schema) {
        console.error('Must have props \'schema\'');
        return null;
    }
    return (
        <FormProvider formData={schema} source={source} actions={actions}>
            <FormContent componentLib={componentLib} />
        </FormProvider>
    );
}

function FormContent({ componentLib }) {
    const { current: builder } = useRef(new BuildSchema());
    const [state] = useFormChange<ISchema>();
    const result = builder.build(state, componentLib);
    console.log('>>>>>>>>>state', state);
    return (
        <div className="pure-g">
            {result}
        </div>
    );
}
