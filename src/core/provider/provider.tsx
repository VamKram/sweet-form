import Manage from '../manage';
import React, { ReactElement, useEffect, useState } from 'react';
import { HashType, ISchema, TOptions } from '../../types/project';
import { SingleContext } from './context';

export interface IFormProvider<T extends ISchema> {
    formData: T;
    children: ReactElement;
    actions?: HashType<(params: any) => TOptions>;
    source?: any;
}

export function FormProvider({ formData, children, source, actions }: IFormProvider<ISchema>) {
    const Provider = SingleContext.getContext().Provider;
    const managerIns = Manage.getManageInstance(formData, source, actions);
    const [state, setState] = useState(managerIns.formData);

    useEffect(() => {
        const subscription = managerIns.subscribe(setState);
        return () => subscription?.();
    }, []);

    return <Provider value={{ state, managerIns }}>{children}</Provider>;
}
