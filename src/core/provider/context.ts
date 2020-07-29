import React, { Context } from 'react';
import { HashObj } from '../../types/project';
import Manage from '../manage';

export interface IContextParams<T> {
    state: T;
    managerIns: Manage<T>;
}

export namespace SingleContext {
    export let Context: Context<IContextParams<any>>;

    export function getContext<T extends HashObj>(): Context<IContextParams<T>> {
        if (!Context) {
            Context = React.createContext(null as any);
            Context.displayName = 'FormProvider';
        }
        return Context;
    }

    export let Consumer = getContext().Consumer;
    export let Provider = getContext().Provider;
}
