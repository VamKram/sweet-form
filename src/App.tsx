import React, { ReactNode, useRef } from "react";
import "./App.less";
import { FormProvider } from "./core";
import { useFormChange } from "./hooks";
import { HashObj, HashType, ISchema, TOptions } from "./types/project";
import BuildSchema from "./core/builder/buildSchema";
import { deepEqual } from "./utils";

export default function FormRender({
                                       schema,
                                       source,
                                       actions,
                                       componentLib,
                                       onFormChange,
                                   }: {
    schema: ISchema;
    source: any;
    componentLib: HashType<ReactNode>;
    actions: HashType<(params: any) => TOptions>;
    onFormChange: (data: HashType<any>) => void;
}) {
    if (!schema) {
        console.error('Must have props \'schema\'');
        return null;
    }
    return (
        <FormProvider formData={schema} source={source} actions={actions}>
            <FormContent componentLib={componentLib} onFormChange={onFormChange} />
        </FormProvider>
    );
}

function FormContent({ componentLib, onFormChange }) {
    const { current: builder } = useRef(new BuildSchema());
    let box = useRef<HashObj | undefined>({});
    const [state] = useFormChange<ISchema>();
    const result = builder.build(state, componentLib);
    if (!deepEqual(box.current, state.result)) {
        onFormChange?.(state.result);
        box.current = state.result;
    }

    return (
        <div className="pure-g">
            {result}
        </div>
    );
}
