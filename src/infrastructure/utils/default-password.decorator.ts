import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function DefaultPassword(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: 'Kata sandi baru tidak boleh menggunakan kata sandi default.',
      },
      validator: DPConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class DPConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return value !== '123456' && value !== 'abcdef';
  }
}
