import {EmailValidatorAdpter} from "./email-validator";
import validator from "validator";
import isEmail = validator.isEmail;

 jest.mock('validator',() => ({
     isEmail (): boolean{
         return true
     }
 }))

const makeSut = (): EmailValidatorAdpter => {
     return new EmailValidatorAdpter()
}




describe('EmailValidator Adapter',() => {
    test("Should return false when the validator returns false",() => {
        const sut = makeSut()
        jest.spyOn(validator,'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_mailgmail.com')
        expect(isValid).toBe(false)
})
    test('should return true when the validator returns true',() =>{
        const sut = makeSut()
        const isValid = sut.isValid('valid_mail@gmail.com')
        expect(isValid).toBe(true)

    })
    test('should call validator with correct email',() =>{
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator,"isEmail")
        sut.isValid('any_mail@email.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_mail@email.com')
    })
})

