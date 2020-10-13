import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/db/load-account-by-email-repository";
import {HashComparer} from "../../protocols/cripto/hash-comparer";
import {TokenGenerator} from "../../protocols/cripto/token-generator";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly tokenGenerator: TokenGenerator

    constructor(loadAccoutByEmailRepository: LoadAccountByEmailRepository,hashComparer: HashComparer,tokenGenerator: TokenGenerator) {
        this.loadAccountByEmailRepository = loadAccoutByEmailRepository
        this.hashComparer = hashComparer
        this.tokenGenerator = tokenGenerator

    }
    async auth(authentication: AuthenticationModel): Promise<string>{
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if(account) {
            const isValid = await this.hashComparer.compare(authentication.password, account.password)
            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(account.id)
                return accessToken
            }
        }
        return null
    }
}