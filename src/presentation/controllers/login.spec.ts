import {LogInController} from "./login";
import {badRequest, serverError, unauthorized} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";
import {SignUpController} from "./signup";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";
import {HttpRequest} from "../protocols/http";
import {Authentication} from "../../domain/usecases/authentication";


const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication{
        async auth(email: string,password:string): Promise<string>{
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticationStub()
}

interface SutTypes{
    sut: LogInController,
    emailValidatorStub: EmailValidator,
    authenticationStub: Authentication
}

const  makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LogInController(emailValidatorStub,authenticationStub)
    return {
        sut,
        emailValidatorStub,
        authenticationStub
    }
}

const makeFakeHttpRequest = (): HttpRequest => ({
    body:{
        email:'mail@mail.com',
        password:'password'
    }
})

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
         const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('should call EmailValidator with correct email',async () => {
        const {sut,emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub,'isValid')
        await sut.handle(makeFakeHttpRequest())
        expect(isValidSpy).toHaveBeenCalledWith('mail@mail.com')
    })

    test('should return 500 if EmailValidator throws',async () => {
        const {sut,emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(() =>{
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should call Authentication with correct values',async () => {

        const {sut, authenticationStub} = makeSut()
        const authSpy = jest.spyOn(authenticationStub,'auth')
        await sut.handle(makeFakeHttpRequest())
        expect(authSpy).toHaveBeenCalledWith('mail@mail.com','password')
    })

    test('should return 401 if invalid credentials are provided',async () =>{
        const {sut, authenticationStub} = makeSut()
        jest.spyOn(authenticationStub,'auth').mockReturnValueOnce(new Promise(resolve => resolve(
            null)))
        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(unauthorized())
    })


});