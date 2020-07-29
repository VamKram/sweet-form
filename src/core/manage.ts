import { HashObj } from '../types/project';
import { Subject } from 'rxjs';
import { Dispatch, EffectCallback, SetStateAction } from 'react';
import produce from 'immer';
import { set, simpleCloneObj } from '../utils';

interface IManage<T extends HashObj> {
    subscribe(setState: Dispatch<SetStateAction<T>>): EffectCallback;
    notify(data: T): void;
    notifyByPath(path: string, data: T): void;
}

export default class Manage<T> implements IManage<T> {
    public $form: Subject<T> = new Subject<T>();
    private _storeForm: T;
    public formData: T;
    private static instance: Manage<any>;
    private readonly isFreeze: boolean = false;

    get storeForm() {
        return this._storeForm;
    }

    set storeForm(data) {
        if (!this.isFreeze) {
            this._storeForm = { ...data };
        }
    }

    get data() {
        return this.formData;
    }

    static getManageInstance(data: HashObj) {
        if (Manage.instance) {
            return Manage.instance;
        }
        Manage.instance = new Manage<HashObj>(data);
        return Manage.instance;
    }

    constructor(formData: T, public path?: string) {
        this.formData = formData;
        this._storeForm = simpleCloneObj(formData);
        this.path = path;
        this.isFreeze = true;
    }

    private updateData(currentData: T) {
        this.formData = currentData;
    }

    public subscribe = (setState: Dispatch<SetStateAction<T>>) => {
        const subscription = this.$form.subscribe(data => {
            setState(data);
            this.updateData(data);
        });
        return () => subscription.unsubscribe();
    };

    public notify = (data: T) => {
        const newData = { ...data };
        this.$form.next(newData);
    };

    public notifyByPath = (path: string, changed: HashObj): void => {
        const newData = produce(this.formData, draft => {
            set(draft, path, changed);
        });
        this.$form.next(newData);
    };
}
