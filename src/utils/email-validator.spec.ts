import {EmailValidatorAdpter} from "./email-validator";
import validator from "validator";
import isEmail = validator.isEmail;

 jest.mock('validator',() => ({
     isEmail (): boolean{
         return true
     }
 }))



describe('EmailValidator Adapter',() => {
    test("Should return false when the validator returns false",() => {
        const sut = new EmailValidatorAdpter()
        jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_mailgmail.com')
        expect(isValid).toBe(false)
})
    test('should return true when the validator returns true',() =>{
        const sut = new EmailValidatorAdpter()
        const isValid = sut.isValid('valid_mail@gmail.com')
        expect(isValid).toBe(true)

    })
})

