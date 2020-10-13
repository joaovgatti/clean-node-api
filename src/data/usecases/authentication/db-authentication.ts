import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {HashComparer} from "../../protocols/cripto/hash-comparer";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    constructor(loadAccoutByEmailRepository: LoadAccountByEmailRepository,hashComparer: HashComparer) {
        this.loadAccountByEmailRepository = loadAccoutByEmailRepository
        this.hashComparer = hashComparer

    }
    async auth(authentication: AuthenticationModel): Promise<string>{
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if(account){
            await this.hashComparer.compare(authentication.password,account.password)
        }
        return null
    }
}