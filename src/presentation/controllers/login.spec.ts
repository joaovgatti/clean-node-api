import {LogInController} from "./login";
import {badRequest} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";
import {SignUpController} from "./signup";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";


const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

interface SutTypes{
    sut: LogInController,
    emailValidatorStub: EmailValidator
}

const  makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LogInController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('Login Controller', () => {
    test('should return 400 if no email is provided',async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                password:'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))

    });
    test('should return 400 if no password if provided',async() => {
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                email:'any_email@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('should return 400 if email is invalid',async () => {
        const {sut,emailValidatorStub} = makeSut()
         jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
         const httpRequest = {
            body:{
                email:'invalid_mail@mail.com',
                password:'any_password'
            }
         }
         const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })



    test('should call EmailValidator with correct email',async () => {
        const {sut,emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
        const httpRequest = {
            body:{
                email:'valid_mail@mail.com',
                password: 'valid_password'
            }
        }
        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })














});