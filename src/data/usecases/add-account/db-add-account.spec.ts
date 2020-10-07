import {DbAddAccount} from "./db-add-account";
import {Encrypter} from "../../protocols/encrypter";
import {rejects} from "assert";
import {AddAccountModel} from "../../../domain/usecases/add-account";
import {AccountModel} from "../../../domain/models/account";
import {AddAccountRepository} from "../../protocols/add-account-repository";

interface SutTypes{
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub,addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
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
    email:'valid_email',
    password:'hashed_password'

})
const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter{
        async encrypt(value: string): Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository{
        async add(accountData: AddAccountModel): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount()))
        }
    }
    return new AddAccountRepositoryStub()
}


describe('DbAddAccount Usecase',() => {
    test('Should call Encrypter with correct password',async() =>{
        const {sut,encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub,'encrypt')
        await sut.add(makeFakeAccount())
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
    test('should throw if Encrypter throws',async () => {
        const {sut,encrypterStub} = makeSut()
        jest.spyOn(encrypterStub,'encrypt').
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
            email: 'valid_email',
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

})


