import { useContext } from 'react';
import { IContextParams, SingleContext } from '../core';
import { HashObj } from '../types/project';

export function useFormChange<T extends HashObj>(path?: string): [T, (data: T) => void] {
    const formContext = SingleContext.getContext<T>();
    const { state, managerIns } = useContext<IContextParams<T>>(formContext);
    if (path) {
        return [state, (changed: HashObj) => managerIns.notifyByPath(path, changed)];
    }
    return [state, managerIns.notify];
}

export function useManage<T extends HashObj>() {
    const formContext = SingleContext.getContext<T>();
    const { managerIns } = useContext<IContextParams<T>>(formContext);
    return managerIns;
}
