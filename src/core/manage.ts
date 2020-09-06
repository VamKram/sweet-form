import produce from 'immer';
import TemplateEngine from '../helper/template-engine';
import { HashObj, HashType, ISchema, IValidation, TOptions } from '../types/project';
import { Subject } from 'rxjs';
import { Dispatch, EffectCallback, SetStateAction } from 'react';
import { get, isEmptyArray, set, simpleCloneObj } from '../utils';
import { Validators } from '../helper/validator';
import { ValidationResult } from '../constant';

interface IManage<T extends HashObj> {
    subscribe(setState: Dispatch<SetStateAction<T>>): EffectCallback;

    notifyByPath(path: string, data: T): void;

    registryValidation(path: string, validation: IValidation): void;
}

export default class Manage<T extends HashObj> implements IManage<T> {
    public $form: Subject<T> = new Subject<T>();
    private _storeForm: T;
    public formData: T;
    private static instance: Manage<any>;
    private readonly isFreeze: boolean = false;
    private haveSetDefault = false;
    public validations: Map<string, IValidation> = new Map<string, IValidation>();
    private engine = new TemplateEngine();

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

    public static getManageInstance(schema?: ISchema, source?: any, actions?: HashType<(params: any) => TOptions>) {
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

    public registryValidation(path: string, validation?: IValidation): void {
        if (this.validations.has(path) || !validation) {
            return;
        }
        this.validations.set(path, validation);
    }

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

    public getTemplateResult(value, currentData?: any): any {
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

    private notify = (data: T) => {
        const newData = { ...data };
        this.$form.next(newData);
    };

    public notifyByPath = (path: string, changed: HashObj, other?: HashObj): void => {
        console.log('I\'m in ', path, this.formData, this.validations);
        const originPath = other!.path;
        const validation = this.validations.get(originPath);
        const newData = produce(this.formData, draft => {
            set(draft, path, changed);
            if (validation && !isEmptyArray(validation.rules)) {
                const errors = validation.rules.map((validatorName: string) => {
                    let defaultValidatorFunc = Validators?.[validatorName];
                    let validatorFunc = this.actions?.[validatorName];
                    if (typeof validatorFunc === 'function') {
                        return validatorFunc(changed);
                    }
                    if (typeof defaultValidatorFunc === 'function') {
                        return defaultValidatorFunc?.(changed);
                    }

                    throw new Error('invalid validation in' + originPath);
                }).filter(r => r !== ValidationResult.PASS);
                const currentComp = draft.components.find(comp => comp.path === originPath)?.validation;
                if (currentComp) {
                    currentComp.errors = errors;
                    set(draft, originPath + 'components', currentComp);
                }
            }
        });

        this.notify(newData);
    };
}
