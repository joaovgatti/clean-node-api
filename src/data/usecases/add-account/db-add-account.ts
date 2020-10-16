import {Hasher} from "../../protocols/cripto/hasher";
import {AccountModel} from "../../../domain/models/account";
import {AddAccount, AddAccountModel} from "../../../domain/usecases/add-account";
import {AddAccountRepository} from "../../protocols/db/account/add-account-repository";
import {LoadAccountByEmailRepository} from "../../protocols/db/account/load-account-by-email-repository";

export class DbAddAccount implements AddAccount{
    private readonly hasher: Hasher
    private readonly addAccountRepository: AddAccountRepository
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

    constructor(hasher: Hasher,addAccountRepository: AddAccountRepository,loadAccountByEmailRepository: LoadAccountByEmailRepository) {
        this.hasher = hasher
        this.addAccountRepository = addAccountRepository
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async add(accountData: AddAccountModel): Promise<AccountModel>{
        const account1 = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
        if(account1){
            return null
        }
        const hashedPassword = await this.hasher.hash(accountData.password)
        const account =  await this.addAccountRepository.add(Object.assign({},accountData,{
            password:hashedPassword
        }))
        return new Promise(resolve => resolve(account))
    }


}