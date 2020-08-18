import { HashObj, TTemplateResult } from '../../types/project';
import { get, isFunction, isTotalWord, isUndefined } from '../../utils';
import { safeEval } from './safe-eval';

interface ITemplateEngine<T extends HashObj> {
    execute(tpl: string, data: T, current: any): TTemplateResult;
}
// optimization
interface IExpression<T> {
    analyse(tpl: string, data: T, current: any): TTemplateResult;
}

abstract class TemplateExpression<T extends HashObj = HashObj> implements IExpression<T> {
    static getSymbol(tpl: string) {
        let [anchor, variable] = TemplateEngine.symbolReg.exec(tpl) || [];
        if (!(anchor && variable)) {
            console.error('Input Is Invalid: ' + tpl);
            throw new Error('Input Is Invalid: ' + tpl);
        }
        return [anchor, variable];
    }

    abstract analyse(tpl: string, data: T, current: any): TTemplateResult;
}

class PureExpression extends TemplateExpression {
    analyse(tpl: string): string {
        return tpl;
    }
}

class VariableExpression extends TemplateExpression {
    analyse(tpl: string, data: HashObj, current: any): TTemplateResult {
        let [, code] = TemplateExpression.getSymbol(tpl);
        const action = get(data, ['actions', code]);
        const property = get(data, code);
        return isFunction(action) ? action(current, data) : property;
    }
}

class CalculateExpression extends TemplateExpression {
    analyse(tpl: string, data: HashObj): TTemplateResult {
        let [, code] = TemplateExpression.getSymbol(tpl);
        code = code.replace(TemplateEngine.varReg, (current: string) => {
            let result = get(data, current);
            if (['true', 'false'].includes(current)) {
                return `!!${current}`;
            }
            if (typeof result === 'string') {
                return `"${result}"`;
            }
            return result;
        });
        return safeEval(code) || '';
    }
}

export default class TemplateEngine<T extends HashObj> implements ITemplateEngine<T> {
    public static readonly symbolReg: RegExp = /^{{(.+)?}}$/i;
    public static readonly varReg: RegExp = /[A-Za-z.]+(?!["'a-z])/g;

    static isTpl(tpl: string): boolean {
        return TemplateEngine.symbolReg.test(tpl);
    }

    getExpressionHandler(tpl: string, data?: T): TemplateExpression {
        const [, code] = TemplateExpression.getSymbol(tpl);
        if (!TemplateEngine.isTpl(tpl)) {
            return new PureExpression();
        }
        if (isTotalWord(code) && !isUndefined(data)) {
            return new VariableExpression();
        }
        return new CalculateExpression();
    }

    public execute(tpl: string, data: T, current?: any): TTemplateResult {
        const handler = this.getExpressionHandler(tpl, data);
        return handler.analyse(tpl, data as T, current);
    }
}
