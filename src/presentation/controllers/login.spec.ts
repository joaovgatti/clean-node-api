import {LogInController} from "./login";
import {badRequest, ok, serverError, unauthorized} from "../helpers/http/http-helper";
import {MissingParamError} from "../errors/errors";
import {SignUpController} from "./signup";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";
import {HttpRequest} from "../protocols/http";
import {Authentication} from "../../domain/usecases/authentication";
import {Validation} from "../protocols/validation";



const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication{
        async auth(email: string,password:string): Promise<string>{
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticationStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation{
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

interface SutTypes{
    sut: LogInController,
    authenticationStub: Authentication
    validationStub: Validation
}

const  makeSut = (): SutTypes => {
    const authenticationStub = makeAuthentication()
    const validationStub = makeValidation()
    const sut = new LogInController(validationStub,authenticationStub)
    return {
        sut,
        authenticationStub,
        validationStub
    }
}

const makeFakeHttpRequest = (): HttpRequest => ({
    body:{
        email:'mail@mail.com',
        password:'password'
    }
})

describe('Login Controller', () => {
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
    test('should return 200 if valid credentials are provided',async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(ok({
            accessToken:'any_token'
        }));
    })
    test('should call Validation with correct values',async () => {
        const {sut,validationStub} = makeSut()
        const validateSpy = jest.spyOn(validationStub,'validate')
        const httpRequest = makeFakeHttpRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
    test('should return 400 if validation returns an error',async () => {

        const {sut,validationStub} = makeSut()
        jest.spyOn(validationStub,'validate').mockReturnValueOnce(
            new MissingParamError('any_field')
        )
        const httpResponse = await sut.handle(makeFakeHttpRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))









    })








});