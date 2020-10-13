import {Authentication, AuthenticationModel} from "../../../domain/usecases/authentication";
import {LoadAccountByEmailRepository} from "../../protocols/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    constructor(loadAccoutByEmailRepository: LoadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccoutByEmailRepository

    }
    async auth(authentication: AuthenticationModel): Promise<string>{
        await this.loadAccountByEmailRepository.load(authentication.email)
        return null
    }
}