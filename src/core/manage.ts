import produce from 'immer';
import TemplateEngine from '../helper/template-engine';
import { HashObj, HashType, ISchema, TOptions } from '../types/project';
import { Subject } from 'rxjs';
import { Dispatch, EffectCallback, SetStateAction } from 'react';
import { get, set, simpleCloneObj } from '../utils';

interface IManage<T extends HashObj> {
    subscribe(setState: Dispatch<SetStateAction<T>>): EffectCallback;
    notify(data: T): void;
    notifyByPath(path: string, data: T): void;
}

export default class Manage<T extends HashObj> implements IManage<T> {
    public $form: Subject<T> = new Subject<T>();
    private _storeForm: T;
    public formData: T;
    private static instance: Manage<any>;
    private readonly isFreeze: boolean = false;
    private haveSetDefault: boolean = false;

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

    static getManageInstance(schema?: ISchema, source?: any, actions?: HashType<(params: any) => TOptions>) {
        if (Manage.instance) {
            return Manage.instance;
        }
        if (!schema) {
            throw new Error('Must have schema when create instance!');
        }
        Manage.instance = new Manage<HashObj>(schema || {}, source, actions);
        return Manage.instance;
    }

    constructor(formData: T, public source?: string, public actions?: HashType<(params: any) => TOptions>) {
        this.formData = formData;
        this._storeForm = simpleCloneObj(formData);
        this.source = source;
        this.actions = actions;
        this.buildResultDefaultField();
        this.isFreeze = true;
    }

    private engine = new TemplateEngine();

    private buildResultDefaultField() {
        if (this.haveSetDefault) return;
        this.haveSetDefault = true;
        const allPath: string[] = this.formData.components?.map(r => r.path);
        allPath?.forEach(path => {
            const defaultData = this.engine.execute(
                get(this.formData, 'data.' + path, ''),
                this.source || this.formData.data,
            );
            this.formData = produce(this.formData, draft => {
                set(draft, `result.${path}`, defaultData);
            });
        });
    }

    getTemplateResult(value, currentData?: any): any {
        return this.engine.execute(value, currentData || this.formData.result);
    }

    private updateData(currentData: T) {
        this.formData = currentData;
    }

    public updateDataByPath(path: string, changed: HashObj) {
        this.formData = produce(this.formData, draft => {
            set(draft, path, changed);
        });
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
