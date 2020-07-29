export const DEFAULT_ACTIONS_MAP = 'ac';

export enum FormItemType {
    INPUT = 'input',
    SELECT = 'select',
    TEXTAREA = 'textarea',
    DATE = 'date',
    IMAGE = 'image',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    CUSTOM = 'custom',
}

export enum ValidationResult {
    PASS,
    FAIL,
    WARN,
}
