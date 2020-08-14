import React, { useRef } from "react";
import "./App.less";
import { FormProvider } from "./core";
import { useFormChange } from "./hooks";
import { ISchema } from "./types/project";
import BuildSchema from "./core/builder/buildSchema";

export default function FormRender({ schema, source }: { schema: ISchema, source: any }) {
    if (!schema) {
        console.error("Must have props 'schema'");
        return null;
    }

    return (
        <FormProvider formData={schema} source={source}>
            <FormContent />
        </FormProvider>
    );
}

function FormContent() {
    const { current: builder } = useRef(new BuildSchema());
    const [state] = useFormChange<ISchema>('a.b.c');
    const result = builder.build(state);
    console.log('>>>>>>>>>state', state);
    return (
        <div className="pure-g">
            {JSON.stringify(state)}
            {result}
        </div>
    );
}
