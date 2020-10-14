import {DbAddAccount} from "./db-add-account";
import {Hasher} from "../../protocols/cripto/hasher";
import {rejects} from "assert";
import {AddAccountModel} from "../../../domain/usecases/add-account";
import {AccountModel} from "../../../domain/models/account";
import {AddAccountRepository} from "../../protocols/db/account/add-account-repository";

interface SutTypes{
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(hasherStub,addAccountRepositoryStub)
    return {
        sut,
        hasherStub,
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


