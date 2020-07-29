import { HashObj } from '../../types/project';
import Manage from '../manage';
import React, { ReactElement, useEffect, useState } from 'react';
import { SingleContext } from './context';

export interface IFormProvider<T extends HashObj> {
    formData: T;
    children: ReactElement;
}

export function FormProvider<T>({ formData, children }: IFormProvider<T>) {
    const Provider = SingleContext.getContext<T>().Provider;
    const managerIns = Manage.getManageInstance(formData);
    const [state, setState] = useState<T>(formData);

    useEffect(() => {
        const subscription = managerIns.subscribe(setState);
        return () => subscription?.();
    }, []);

    return <Provider value={{ state, managerIns }}>{children}</Provider>;
}
