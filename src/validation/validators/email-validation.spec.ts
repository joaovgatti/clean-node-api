import {EmailValidation} from "./email-validation";
import {EmailValidator} from "../protocols/email-validator";
import {ServerError} from "../../presentation/errors/server-error";


const makeEmailValidator = (): EmailValidator =>{
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}


interface SutTypes{
    sut: EmailValidation
    emailValidatorStub: EmailValidator

}

const makeSut = (): SutTypes =>{
    const emailValidatorStub = makeEmailValidator()
    const sut =  new EmailValidation('email',emailValidatorStub)
    return {
        sut,
        emailValidatorStub,
    }
}

describe('Email Validation',() => {
    test('Should call EmailValidator with correct email',() => {
        const {sut,emailValidatorStub} = makeSut()
        const isvValidSpy = jest.spyOn(emailValidatorStub,'isValid')
        sut.validate({
            email:'any_email@mail.com'
        })
        expect(isvValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should throws if EmailValidator throws', () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub,'isValid').mockImplementation(() =>{
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })

})
