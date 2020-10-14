import {AccountModel} from "../../../domain/models/account";
import {DbAuthentication} from "./db-authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {AuthenticationModel} from "../../../domain/usecases/authentication";
import {compare} from "bcrypt";
import {HashComparer} from "../../protocols/cripto/hash-comparer";
import {TokenGenerator} from "../../protocols/cripto/token-generator";
import {UpdateAccessTokenRepository} from "../../protocols/db/update-access-token-repo";



const makeFakeAccount = (): AccountModel => ({
    id:'any_id',
    name:'any_name',
    email:'any_email@mail.com',
    password:'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository{
        async load(email: string): Promise<AccountModel>{
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
        async update(id:string,token:string): Promise<void>{
            return new Promise(resolve => resolve())
        }
    }
    return new UpdateAccessTokenRepository()

}

const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(id: string): Promise<string>{
            return new Promise(resolve => resolve('any_token'))
        }
    }
    return new TokenGeneratorStub()
}


const makeFakeAuthentication = (): AuthenticationModel => ({
    email:'any_email@mail.com',
    password:'any_password'
})

interface SutTypes{
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository

}


const makeSut = (): SutTypes => {
    const tokenGeneratorStub = makeTokenGenerator()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub,hashComparerStub,tokenGeneratorStub,updateAccessTokenRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub
    }
}
describe('DbAuthentication Usecase',() => {
    test('Should call LoadAccountByEmailRepository',async () => {
        const {sut,loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'load')
        await sut.auth(makeFakeAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
    test('should throw if LoadAccountByEmailRepository throw',async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'load').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise  =  sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()
    })
    test('should return null if  LoadAccountByEmailRepository returns null',async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub,'load').
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
    test('should call TokenGenerator with correct id',async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        const generateSpy = jest.spyOn(tokenGeneratorStub,'generate')
        await sut.auth(makeFakeAuthentication())
        expect(generateSpy).toHaveBeenCalledWith('any_id')
    })
    test('should throw if TokenGenerator throws',async () => {
        const {sut, tokenGeneratorStub} = makeSut()
        jest.spyOn(tokenGeneratorStub,'generate').mockReturnValueOnce(new Promise((resolve, reject) =>
        reject(new Error())))
        const promise = sut.auth(makeFakeAuthentication())
        await expect(promise).rejects.toThrow()

    })
    test('should return an token on success',async () => {
        const {sut} = makeSut()
        const accessToken = await sut.auth(makeFakeAuthentication())
        expect(accessToken).toBe('any_token')
    })
    test('should call UpdateAcessTokenRepository with correct values',async () => {
        const {sut,updateAccessTokenRepositoryStub} = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub,'update')
        await sut.auth(makeFakeAuthentication())
        expect(updateSpy).toHaveBeenCalledWith('any_id','any_token')
    })



})