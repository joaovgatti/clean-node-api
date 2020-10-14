import {AccountModel} from "../../../domain/models/account";
import {DbAuthentication} from "./db-authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {AuthenticationModel} from "../../../domain/usecases/authentication";
import {compare} from "bcrypt";
import {HashComparer} from "../../protocols/cripto/hash-comparer";
import {Encrypter} from "../../protocols/cripto/encrypter";
import {UpdateAccessTokenRepository} from "../../protocols/db/update-access-token-repo";



const makeFakeAccount = (): AccountModel => ({
    id:'any_id',
    name:'any_name',
    email:'any_email@mail.com',
    password:'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository{
        async loadByEmail(email: string): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
    class HashComparer implements HashComparer{
        async compare(value: string, hash:string): Promise<boolean>{
            return new Promise(resolve => resolve(true))
        }
    }
    return new HashComparer()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepository implements UpdateAccessTokenRepository{
        async updateAccessToken(id:string,token:string): Promise<void>{
            return new Promise(resolve => resolve())
        }
    }
    return new UpdateAccessTokenRepository()

}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string>{
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new EncrypterStub()
}


const makeFakeAuthentication = (): AuthenticationModel => ({
    email:'any_email@mail.com',
    password:'any_password'
})

interface SutTypes{
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository

}


const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const loadAccountByEmailRepositoryStub =  makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub,hashComparerStub,encrypterStub,updateAccessTokenRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    }
}
describe('DbAuthentication Usecase',() => {
    test('Should call LoadAccountByEmailRepository',async () => {
        const {sut,loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('should throw if LoadAccountByEmailRepository throw',async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise  =  sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('should return null if  LoadAccountByEmailRepository returns null',async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').
            mockReturnValueOnce(null)
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBeNull()
    })
    test('should call HashComparer with correct values',async () => {
        const {sut, hashComparerStub} = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub,'compare')
        await sut.auth(makeFakeAuthentication())
        expect(compareSpy).toHaveBeenCalledWith('any_password','hashed_password')
    })
    test('should throw if HashComparer throws',async () => {
        const {sut, hashComparerStub} = makeSut()
        jest.spyOn(hashComparerStub,'compare').mockReturnValueOnce(new Promise((resolve, reject) =>
            reject(new Error)))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('should return null if HashComparer fails',async () => {
        const {sut,hashComparerStub} = makeSut()
        jest.spyOn(hashComparerStub,'compare').mockReturnValueOnce(new Promise(
            resolve => resolve(false)
        ))
        const accessToken = await sut.auth(makeFakeAuthentication())
        await expect(accessToken).toBeNull()
    })
    test('should call Encrypter with correct id',async () => {
        const {sut, encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub,'encrypt')
        await sut.auth(makeFakeAuthentication())
        expect(encryptSpy).toHaveBeenCalledWith('any_id')
    })
    test('should throw if Encrypter throws',async () => {
        const {sut, encrypterStub} = makeSut()
        jest.spyOn(encrypterStub,'encrypt').mockReturnValueOnce(new Promise((resolve, reject) =>
        reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()

    })
    test('should return a token token on success',async () => {
        const {sut} = makeSut()
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBe('any_token')
    })
    test('should call UpdateAcessTokenRepository with correct values',async () => {
        const {sut,updateAccessTokenRepositoryStub} = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub,'updateAccessToken')
        await sut.auth(makeFakeAuthentication())
        expect(updateSpy).toHaveBeenCalledWith('any_id','any_token')
    })
})