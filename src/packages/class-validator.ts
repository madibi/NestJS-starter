import {
    ValidationOptions,
    IsNotEmpty as _IsNotEmpty,
    MinLength as _MinLength,
    Length as _Length
} from "class-validator";

export const IsNotEmpty = (validationOptions?: ValidationOptions): PropertyDecorator =>_IsNotEmpty({...validationOptions, message: 
    JSON.stringify({
        key: 'IsNotEmpty',
        properties: [{property: '$property'}],
        constraints: [],
        message: '$property should not be empty'
    })    
});
export const MinLength = (min: number, validationOptions?: ValidationOptions): PropertyDecorator =>_MinLength(min, {...validationOptions, message: 
    JSON.stringify({
        key: 'MinLength',
        properties: [{property: '$property'}],
        constraints: [{constraint1: '$constraint1'}],
        message: '$property must be longer than or equal to $constraint1 characters'
    })
});

// https://github.com/typestack/class-validator/tree/develop/src/decorator/string