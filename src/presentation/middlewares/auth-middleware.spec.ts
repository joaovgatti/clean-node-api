import {HttpRequest} from "../protocols/http";
import {forbidden, ok, serverError} from "../helpers/http/http-helper";
import {AccessDeniedError} from "../errors/access-denied-error";
import {AuthMiddleware} from "./auth-middleware";
import {LoadAccountByToken} from "../../domain/usecases/load-account-by-token";
import {AccountModel} from "../../domain/models/account";
import {throws} from "assert";
import {ServerError} from "../errors/server-error";



const makeFakeRequest = (): HttpRequest => ({
    headers:{
        'x-access-token':'any_token'
    }
})



const makeFakeAccount = (): AccountModel => ({
    id:'valid_id',
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'hashed_password'
})

const makeLoadAccountByTokenStub = (): LoadAccountByToken =>{
    class LoadAccountByTokenStub implements LoadAccountByToken{
        async load(accessToken:string, role?:string): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByTokenStub()
}

interface SutTypes {
    loadAccountByTokenStub: LoadAccountByToken
    sut: AuthMiddleware
}


const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub,role)
    return ({
        loadAccountByTokenStub,
        sut
    })
}


describe('auth middleware',() => {
    test('should return 403 if no x-access-token exists in headers',async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('should call LoadAccountByToken with correct accessToken',async () => {
        const role = 'any_role'
        const {loadAccountByTokenStub,sut} = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub,'load')
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token',role)
    })

    test('should return 403 if LoadAccountByToken returns null',async () => {
        const {loadAccountByTokenStub,sut} = makeSut()
        jest.spyOn(loadAccountByTokenStub,'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const promise = await sut.handle(makeFakeRequest())
        expect(promise).toEqual(forbidden(new AccessDeniedError()))
    })

    test('should return 200 if LoadAccountByToken returns an account',async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok({accountId:'valid_id'}))
    })

    test('should return 500 if LoadAccountByToken throws',async () => {
        const {loadAccountByTokenStub,sut} = makeSut()
        jest.spyOn(loadAccountByTokenStub,'load').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))

        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

})