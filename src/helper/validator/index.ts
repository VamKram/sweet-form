import { ValidationResult } from '../../constant';
import { isNullOrUndefined, isEmpty } from '../../utils';


export class Validators {
    public static required = (data: unknown): [ValidationResult.FAIL, string] | ValidationResult.PASS => {
        if (isNullOrUndefined(data) || isEmpty(data)) {
            return [ValidationResult.FAIL, '不能为空！'];
        }
        return ValidationResult.PASS;
    };
}
