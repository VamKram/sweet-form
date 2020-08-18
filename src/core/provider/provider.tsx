import Manage from '../manage';
import React, { ReactElement, useEffect, useState } from 'react';
import { ISchema } from '../../types/project';
import { SingleContext } from './context';

export interface IFormProvider<T extends ISchema> {
    formData: T;
    children: ReactElement;
    source?: any;
}

export function FormProvider({ formData, children, source }: IFormProvider<ISchema>) {
    const Provider = SingleContext.getContext().Provider;
    const managerIns = Manage.getManageInstance(formData, source);
    const [state, setState] = useState(managerIns.formData);

    useEffect(() => {
        const subscription = managerIns.subscribe(setState);
        return () => subscription?.();
    }, []);

    return <Provider value={{ state, managerIns }}>{children}</Provider>;
}
