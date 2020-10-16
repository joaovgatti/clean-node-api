import {DbAddAccount} from "./db-add-account";
import {Hasher} from "../../protocols/cripto/hasher";
import {rejects} from "assert";
import {AddAccountModel} from "../../../domain/usecases/add-account";
import {AccountModel} from "../../../domain/models/account";
import {AddAccountRepository} from "../../protocols/db/account/add-account-repository";
import {LoadAccountByEmailRepository} from "../../protocols/db/account/load-account-by-email-repository";

interface SutTypes{
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub,addAccountRepositoryStub,loadAccountByEmailRepositoryStub)
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub
    }
}

const makeFakeAccount = (): AccountModel => ({
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'valid_password',
    id:'valid_id'
})

const makeFakeAccountData =  (): AddAccountModel => ({
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'hashed_password'

})
const makeHasher = (): Hasher => {
    class HasherStub implements Hasher{
        async hash(value: string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository{
        async add(accountData: AddAccountModel): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepository implements LoadAccountByEmailRepository{
        async loadByEmail(email: string): Promise<AccountModel>{
            return new Promise(resolve => resolve(null))
        }
    }
    return new LoadAccountByEmailRepository()
}


describe('DbAddAccount Usecase',() => {
    test('Should call Hasher with correct password',async() =>{
        const {sut,hasherStub} = makeSut()
        const hashSpy = jest.spyOn(hasherStub,'hash')
        await sut.add(makeFakeAccount())
        expect(hashSpy).toHaveBeenCalledWith('valid_password')
    })
    test('should throw if Hasher throws',async () => {
        const {sut,hasherStub} = makeSut()
        jest.spyOn(hasherStub,'hash').
            mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccount())
        await expect(promise).rejects.toThrow()
    })
    test('should call AddAccountRepository with correct values',async () =>{
        const {sut,addAccountRepositoryStub } = makeSut()
        const addSPy = jest.spyOn(addAccountRepositoryStub,'add')
        await sut.add(makeFakeAccountData())
        expect(addSPy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password'
        })
    })
    test('should throw if AddAccountRepository throws',async () => {
        const {sut,addAccountRepositoryStub} = makeSut()
        jest.spyOn(addAccountRepositoryStub,'add').
        mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const promise = sut.add(makeFakeAccount())
        await expect(promise).rejects.toThrow()
    })
    test('should return an account on success',async() => {
        const {sut} = makeSut()
        const account = await sut.add(makeFakeAccount())
        await expect(account).toEqual(makeFakeAccount())
    })


    test('should call loadAccountByEmailRepository with correct values',async () => {
        const {sut,loadAccountByEmailRepositoryStub} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail')
        await sut.add(makeFakeAccountData())
        expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })
    test('should return null if loadAccountByEmailRepository not returns null',async () => {
        const {sut, loadAccountByEmailRepositoryStub} = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub,'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
        const nullAccount = await sut.add(makeFakeAccountData())
        expect(nullAccount).toBe(null)
    })

})


