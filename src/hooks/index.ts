import { useContext, useMemo } from 'react';
import { IContextParams, SingleContext } from '../core';
import { HashObj, IValidation } from '../types/project';

export function useFormChange<T extends HashObj>(path?: string): [T, (data: T) => void] {
    const formContext = SingleContext.getContext<T>();
    const { state, managerIns } = useContext<IContextParams<T>>(formContext);
    return [state, (changed: HashObj, currentPath?: string) => managerIns.notifyByPath(path || currentPath || '', changed)];
}

export function useManage<T extends HashObj>() {
    const formContext = SingleContext.getContext<T>();
    const { managerIns } = useContext<IContextParams<T>>(formContext);
    return managerIns;
}

export function useValidation<T extends HashObj>(path: string, validation?: IValidation) {
    if (!validation) return;
    const formContext = SingleContext.getContext<T>();
    const { managerIns } = useContext<IContextParams<T>>(formContext);
    useMemo(() => {
        managerIns.registryValidation(path, validation);
    }, []);
}