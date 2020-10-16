import {ValidationComposite} from "../../../../validation/validators/validation-composite";
import {Validation} from "../../../../presentation/protocols/validation";
import {RequiredFieldValidation} from "../../../../validation/validators/required-field-validation";
import {EmailValidation} from "../../../../validation/validators/email-validation";
import {EmailValidatorAdapter} from "../../../../infra/validators/utils/email-validator-adapter";

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for(const field of ['email','password']){
      validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email',new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}

