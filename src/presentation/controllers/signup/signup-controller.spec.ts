import {SignUpController} from "./signup-controller";
import {MissingParamError} from "../../errors/errors";
import {AddAccount,AddAccountModel} from "../../../domain/usecases/add-account";
import {AccountModel} from "../../../domain/models/account";
import {HttpRequest} from "../../protocols/http";
import {badRequest, forbidden, ok, serverError} from "../../helpers/http/http-helper";
import {Validation} from "../../protocols/validation";
import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {EmailInUseError} from "../../errors/email-in-use-error";

const makeFakeRequest = (): HttpRequest => ({
    body: {
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
            passwordConfirmation: 'any_password'
    }
})

const makeFakeAccount = (): AccountModel => ({
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'valid_password',
    id:'valid_id'
})

const makeAddAccount = (): AddAccount =>{
    class AddAccountStub implements AddAccount{
        async add(account: AddAccountModel): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountStub()
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation{
        validate(input:any): Error{
            return null
        }
    }
    return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication{
        async auth(authentication: AuthenticationModel) :Promise<string>{
           return new Promise(resolve => resolve('any_token'))
        }
    }
    return new AuthenticationStub()
}

interface SutTypes{
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
}

const makeSut = (): SutTypes =>{
    const validationStub = makeValidation()
    const addAccountStub = makeAddAccount()
    const authenticationStub = makeAuthentication()
    const sut =  new SignUpController(addAccountStub, validationStub,authenticationStub)
    return {
        sut,
        addAccountStub,
        validationStub,
        authenticationStub
    }
}
describe('SignUp Controller',() => {
    test('Should call AddAccount with the correct values',() =>{
        const {sut,addAccountStub} = makeSut()
        const addSpy = jest.spyOn(addAccountStub,'add')
        sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenCalledWith({
            name:'any_name',
            email:'any_email@mail.com',
            password:'any_password',
        })
    })
    test('should call authentication with correct values',async () => {
        const {sut,authenticationStub} = makeSut()
        const authenticationSpy = jest.spyOn(authenticationStub,'auth')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(authenticationSpy).toHaveBeenCalledWith({
            email:'any_email@mail.com',
            password:'any_password'
        })
    })

    test('Should return 200 if valid data is provided',async () =>{
        const {sut} = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok( {accessToken: 'any_token'}));
    })

    test('should call Validation with correct value',async () => {
         const {sut, validationStub} = makeSut()
         const validatedSpy = jest.spyOn(validationStub,'validate')
         const httpRequest = makeFakeRequest()
         await sut.handle(httpRequest)
        expect(validatedSpy).toHaveBeenCalledWith(httpRequest.body)
    })
    test('should call 400 if validation returns an error',async () =>{
        const {sut, validationStub} = makeSut()
        jest.spyOn(validationStub,'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

    test('should return 403 if addAccount returns null', async () => {
        const {sut, addAccountStub} = makeSut()
        jest.spyOn(addAccountStub,'add').mockReturnValueOnce(
            null)

        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })

    test('should return 500 if validation throws',async () => {
        const {sut, authenticationStub} = makeSut()
        jest.spyOn(authenticationStub,'auth').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})


