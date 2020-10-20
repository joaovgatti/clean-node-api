import {DbLoadAccountByToken} from "./db-load-account-by-token";
import {LoadAccountByEmailRepository} from "../../protocols/db/account/load-account-by-email-repository";
import {LoadAccountByToken} from "../../../domain/usecases/load-account-by-token";
import {AccountModel} from "../../../domain/models/account";
import {LoadAccountByTokenRepository} from "../../protocols/db/account/load-account-by-token-repository";


const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter{
        async decrypt(value: string): Promise<string>{
            return new Promise(resolve => resolve('any_value'))
        }
    }
    return new DecrypterStub()
}

const makeFakeAccount = (): AccountModel => ({
    id:'valid_id',
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'hashed_password'
})

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository{
        async loadByToken(token: string, role?: string): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByTokenRepositoryStub()
}

const makeSut  = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
    const sut = new DbLoadAccountByToken(decrypterStub,loadAccountByTokenRepositoryStub)
    return({
        sut,
        decrypterStub,
        loadAccountByTokenRepositoryStub
    })
}

interface SutTypes{
    decrypterStub: Decrypter
    sut: DbLoadAccountByToken
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}



describe('DbLoadAccountByToken Usecase',() => {
    test('should call Decrypter with correct values',async () => {
        const {sut,decrypterStub} = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub,'decrypt')
        await sut.load('any_token')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    })

    test('should return null if Decrypter return null',async () => {
        const{sut,decrypterStub} = makeSut()
        jest.spyOn(decrypterStub,'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
        const account = await sut.load('any_token','any_role')
        expect(account).toBeNull()
    })
    test('should call LoadAccountByTokenRepository with correct values',async () => {
        const {sut, loadAccountByTokenRepositoryStub} = makeSut()
        const loadSṕy = jest.spyOn(loadAccountByTokenRepositoryStub,'loadByToken')
        await sut.load('any_token','any_role')
        expect(loadSṕy).toHaveBeenCalledWith('any_token','any_role')
    })
    test('should return an account on success',async () => {
        const {sut} = makeSut()
        const account = await sut.load('any_token','any_role')
        expect(account).toEqual(makeFakeAccount())
    })

})