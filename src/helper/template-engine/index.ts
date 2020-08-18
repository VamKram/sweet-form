import { HashObj, TTemplateResult } from '../../types/project';
import { get, isFunction, isTotalWord, isUndefined } from '../../utils';
import { safeEval } from './safe-eval';

interface ITemplateEngine<T extends HashObj> {
    execute(tpl: string, data: T, current: any): TTemplateResult;
    expressionCal(input: string, data: T): TTemplateResult;
}
/*
// optimization
interface IExpression {
    analyse(input: string, data: T): unknown
}
abstract class Expression implements IExpression{
    public static readonly symbolReg: RegExp = /^{{(.+)?}}$/i;
    public static readonly varReg: RegExp = /[A-Za-z.]+(?!["'a-z])/g;
    static isTpl(tpl: string): boolean {
        return Template.symbolReg.test(tpl);
    }
    abstract analyse(tpl: string, data: T, current: any): TTemplateResult;
    // abstract execute(tpl: string, data: T, current: any): string;
}

class PureExpression extends Expression {
    execute(tpl: string, data: HashObj, current: any): string {
        if (!PureExpression.isTpl(tpl)) return tpl;
        return "";
    }
}

class VariableExpression extends Expression {
    execute(tpl: string, data: HashObj, current: any) {
        let [anchor, variable] = VariableExpression.symbolReg.exec(tpl) || [];
        if (!(anchor && variable)) {
            console.error('Input Is Invalid: ' + tpl);
            throw new Error('Input Is Invalid: ' + tpl);
        }

        if (isTotalWord(variable) && !isUndefined(data)) {
            const action = get(data, ['actions', variable]);
            const property = get(data, variable);
            return isFunction(action) ? action(current, data) : property;
        }
    }
}

class CalculateExpression extends Expression {
    execute(tpl: string, data: HashObj, current: any): TTemplateResult {
        let [, code] = TemplateEngine.symbolReg.exec(tpl) || [];
        if (data) {
            code = code.replace(CalculateExpression.varReg, (current: string) => {
                let result = get(data, current);
                if (['true', 'false'].includes(current)) {
                    return `!!${current}`;
                }
                if (typeof result === 'string') {
                    return `"${result}"`;
                }
                return result;
            });
        }
        console.log('>>>>>>>>>code', code);
        return safeEval(code) || '';
    }

}*/

export default class TemplateEngine<T extends HashObj> implements ITemplateEngine<T> {
    public static readonly symbolReg: RegExp = /^{{(.+)?}}$/i;
    public static readonly varReg: RegExp = /[A-Za-z.]+(?!["'a-z])/g;

    static isTpl(tpl: string): boolean {
        return TemplateEngine.symbolReg.test(tpl);
    }
    public execute(tpl: string, data?: T, current?: any): TTemplateResult {
        if (!TemplateEngine.isTpl(tpl)) return tpl;
        let [anchor, variable] = TemplateEngine.symbolReg.exec(tpl) || [];
        if (!(anchor && variable)) {
            console.error('Input Is Invalid: ' + tpl);
            throw new Error('Input Is Invalid: ' + tpl);
        }

        if (isTotalWord(variable) && !isUndefined(data)) {
            const action = get(data, ['actions', variable]);
            const property = get(data, variable);
            return isFunction(action) ? action(current, data) : property;
        }
        return this.expressionCal(variable, data);
    }

    public expressionCal(input: string, data?: T): TTemplateResult {
        let code = input;
        if (data) {
            code = input.replace(TemplateEngine.varReg, (current: string) => {
                let result = get(data, current);
                if (['true', 'false'].includes(current)) {
                    return `!!${current}`;
                }
                if (typeof result === 'string') {
                    return `"${result}"`;
                }
                return result;
            });
        }
        console.log('>>>>>>>>>code', code);
        return safeEval(code) || '';
    }
}
