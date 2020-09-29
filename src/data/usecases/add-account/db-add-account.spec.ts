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
            const fakeAccount = {
                name:'valid_name',
                email:'valid_email',
                password:'hashed_password',
                id:'valid_id'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new AddAccountRepositoryStub()
}


describe('DbAddAccount Usecase',() => {
    test('Should call Encrypter with correct password',async() =>{
        const {sut,encrypterStub} = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub,'encrypt')
        const accountData = {
            name:'valid_name',
            email:'valid_mail',
            password:'valid_password'
        }
      await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
    })
    test('should throw if Encrypter throws',async () => {
        const {sut,encrypterStub} = makeSut()
        jest.spyOn(encrypterStub,'encrypt').
            mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))
        const accoundData = {
            name:'valid_name',
            email:'valid_mail',
            password: 'valid_password'
        }
        const promise = sut.add(accoundData)
        await expect(promise).rejects.toThrow()
    })
    test('should call AddAccountRepository with correct values',async () =>{
        const {sut,addAccountRepositoryStub } = makeSut()
        const addSPy = jest.spyOn(addAccountRepositoryStub,'add')
        const accountData = {
            name: 'valid_name',
            email: 'valid_mail',
            password: 'hashed_password'
        }
        await sut.add(accountData)
        expect(addSPy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_mail',
            password: 'hashed_password'
        })
    })
})


