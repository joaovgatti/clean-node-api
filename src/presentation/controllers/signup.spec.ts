import {SignUpController} from "./signup";
import {MissingParamError} from "../errors/errors";
import {InvalidParamError} from "../errors/invalid-param-error";
import {EmailValidator} from "../protocols/email-validator";
import {ServerError} from "../errors/server-error";
import {AddAccount,AddAccountModel} from "../../domain/usecases/add-account";
import {AccountModel} from "../../domain/models/account";
import exp from "constants";
import {promises} from "dns";
import {HttpRequest} from "../protocols/http";
import {badRequest, ok} from "../helpers/http-helper";
import {Validation} from "../helpers/validators/validation";

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


const makeEmailValidator = (): EmailValidator =>{
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
            }
    }
    return new EmailValidatorStub()
}

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

interface SutTypes{
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeSut = (): SutTypes =>{
    const validationStub = makeValidation()
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut =  new SignUpController(emailValidatorStub,addAccountStub,validationStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub,
        validationStub
    }
}

describe('SignUp Controller',() => {
    test('should return 400 is password confirmation fails',async() => {
         const {sut} = makeSut()
         const httpRequest = {
             body: {
                 name: 'any_name',
                 email: 'any_email@mail.com',
                 password: 'any_password',
                 passwordConfirmation: 'invalid_password'
             }
         }
         const httpResponse = await sut.handle(httpRequest)
         expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))

    })
    test('Should return 400 if an invalid email is provided',async() => {
        const {sut,emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })
    test('Should call EmailValidator with correct email',async() => {
        const {sut,emailValidatorStub} = makeSut()
        const isvValidSpy = jest.spyOn(emailValidatorStub,'isValid')
        sut.handle(makeFakeRequest())
        expect(isvValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('Should return 500 if EmailValidator throws',async () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub,'isValid').mockImplementation(() =>{
            throw new ServerError(null)
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(null))
    })
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

    test('Should return 200 if valid data is provided',async () =>{
        const {sut} = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    })

    test('should call Validation with correct value',async () => {
         const {sut, validationStub} = makeSut()
         const validatedSpy = jest.spyOn(validationStub,'validate')
         const httpRequest = makeFakeRequest()
         await sut.handle(httpRequest)
        expect(validatedSpy).toHaveBeenCalledWith(httpRequest.body)
    })
    test('should call 400 if validation retuns an error',async () =>{
        const {sut, validationStub} = makeSut()
        jest.spyOn(validationStub,'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))













    })
})


