import {HttpRequest} from "../protocols/http";
import {forbidden} from "../helpers/http/http-helper";
import {AccessDeniedError} from "../errors/access-denied-error";
import {AuthMiddleware} from "./auth-middleware";
import {LoadAccountByToken} from "../../domain/usecases/load-account-by-token";
import {AccountModel} from "../../domain/models/account";



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


const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
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
        const {loadAccountByTokenStub,sut} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub,'load')
        await sut.handle(makeFakeRequest())
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })

    test('should return 403 if LoadAccountByToken returns null',async () => {
        const {loadAccountByTokenStub,sut} = makeSut()
        jest.spyOn(loadAccountByTokenStub,'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const promise = await sut.handle(makeFakeRequest())
        expect(promise).toEqual(forbidden(new AccessDeniedError()))
    })

})