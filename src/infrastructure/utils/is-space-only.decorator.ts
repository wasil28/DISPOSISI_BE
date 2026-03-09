import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsSpaceOnly(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: validationOptions.message,
      },
      validator: IsSpaceOnlyConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class IsSpaceOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value.length != 0) {
      const pattern = new RegExp(/^$|.*\S+.*/);

      return pattern.test(value);
    }

    return true;
  }
}
