export interface ValidationRule {
    validate: (value: any, formData?: Record<string, any>) => boolean;
    message: string;
}

export interface ValidationRules {
    [key: string]: ValidationRule[];
}

export interface ValidationErrors {
    [key: string]: string[];
}

export const commonRules = {
    required: (message = 'This field is required'): ValidationRule => ({
        validate: (value) => value !== undefined && value !== null && value !== '',
        message
    }),

    email: (message = 'Invalid email address'): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },
        message
    }),

    minLength: (length: number, message?: string): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            return value.length >= length;
        },
        message: message || `Must be at least ${length} characters`
    }),

    maxLength: (length: number, message?: string): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            return value.length <= length;
        },
        message: message || `Must be at most ${length} characters`
    }),

    pattern: (regex: RegExp, message: string): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            return regex.test(value);
        },
        message
    }),

    number: (message = 'Must be a number'): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            return !isNaN(Number(value));
        },
        message
    }),

    min: (min: number, message?: string): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            return Number(value) >= min;
        },
        message: message || `Must be at least ${min}`
    }),

    max: (max: number, message?: string): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            return Number(value) <= max;
        },
        message: message || `Must be at most ${max}`
    }),

    password: (message = 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'): ValidationRule => ({
        validate: (value) => {
            if (!value) return true;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(value);
        },
        message
    }),

    match: (field: string, message?: string): ValidationRule => ({
        validate: (value, formData = {}) => {
            if (!value) return true;
            return value === formData[field];
        },
        message: message || 'Fields do not match'
    })
};

export function validateForm(data: Record<string, any>, rules: ValidationRules): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(rules).forEach(field => {
        const fieldRules = rules[field];
        const value = data[field];

        fieldRules.forEach(rule => {
            if (!rule.validate(value, data)) {
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(rule.message);
            }
        });
    });

    return errors;
}

export function isValidForm(errors: ValidationErrors): boolean {
    return Object.keys(errors).length === 0;
}

// Example usage:
/*
const formRules = {
    email: [
        commonRules.required(),
        commonRules.email()
    ],
    password: [
        commonRules.required(),
        commonRules.password()
    ],
    confirmPassword: [
        commonRules.required(),
        commonRules.match('password', 'Passwords do not match')
    ]
};

const formData = {
    email: 'user@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
};

const errors = validateForm(formData, formRules);
const isValid = isValidForm(errors);
*/ 