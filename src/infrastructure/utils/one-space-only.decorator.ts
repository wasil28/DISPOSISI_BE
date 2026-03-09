import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function OneSpaceOnly(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: validationOptions.message,
      },
      validator: OneSpaceOnlyConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class OneSpaceOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value.length != 0) {
      const pattern = new RegExp(/^\S+(?: \S+)*$/);

      return pattern.test(value);
    }

    return true;
  }
}
