import { isTotalWord, isUndefined } from '../../utils';
import { TTemplateResult } from '../../types/project';

export function safeEval(code: string): TTemplateResult | void {
    if (isUndefined(window)) {
        console.error('Wrong Environment Just For Browser.');
        throw new ReferenceError('Wrong Environment Just For Browser.');
    }
    const windowContextAttribute: Array<string> = Object.getOwnPropertyNames(window).filter(isTotalWord);
    let globalSafeContextStr: string = '';

    for (let i = 0, len = windowContextAttribute.length; i < len; i++) {
        globalSafeContextStr += `var ${windowContextAttribute[i]} = undefined;`;
    }

    return new Function(`
    ${globalSafeContextStr}
    "use strict";
    return ${code.replace('this', '_this')}
    `)();
}
