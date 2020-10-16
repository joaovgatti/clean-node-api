import {EmailValidator} from "../../../../validation/protocols/email-validator";
import {makeLoginValidation} from "./login-validation-factory";
import {Validation} from "../../../../presentation/protocols/validation";
import {RequiredFieldValidation} from "../../../../validation/validators/required-field-validation";
import {EmailValidatorAdapter} from "../../../../infra/validators/utils/email-validator-adapter";
import {EmailValidation} from "../../../../validation/validators/email-validation";
import {ValidationComposite} from "../../../../validation/validators/validation-composite";

jest.mock('../../../../validation/validators/validation-composite')


const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('LogIn validation Factory',() => {
    test('should call ValidationComposite with correct values',() => {
      makeLoginValidation()
      const validations: Validation[] = []
      for(const field of ['email','password']){
          validations.push(new RequiredFieldValidation(field))
      }
      validations.push(new EmailValidation('email',makeEmailValidator()));
      expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})

