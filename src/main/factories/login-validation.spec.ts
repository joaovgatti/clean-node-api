import {EmailValidator} from "../../presentation/protocols/email-validator";
import {makeLoginValidation} from "./login-validation";
import {Validation} from "../../presentation/helpers/validators/validation";
import {RequiredFieldValidation} from "../../presentation/helpers/validators/required-field-validation";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {EmailValidation} from "../../presentation/helpers/validators/email-validation";
import {ValidationComposite} from "../../presentation/helpers/validators/validation-composite";


jest.mock('../../presentation/helpers/validators/validation-composite')


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

