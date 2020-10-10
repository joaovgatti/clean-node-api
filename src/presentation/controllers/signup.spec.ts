import {SignUpController} from "./signup";
import {MissingParamError} from "../errors/errors";
import {AddAccount,AddAccountModel} from "../../domain/usecases/add-account";
import {AccountModel} from "../../domain/models/account";
import {HttpRequest} from "../protocols/http";
import {badRequest, ok} from "../helpers/http/http-helper";
import {Validation} from "../protocols/validation";

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

interface SutTypes{
    sut: SignUpController
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeSut = (): SutTypes =>{
    const validationStub = makeValidation()
    const addAccountStub = makeAddAccount()
    const sut =  new SignUpController(addAccountStub, validationStub)
    return {
        sut,
        addAccountStub,
        validationStub
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


