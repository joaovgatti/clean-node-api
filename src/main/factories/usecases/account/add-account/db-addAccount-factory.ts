import {AccountMongoRepository} from "../../../../../infra/db/mongodb/account/account-mongo-repository";
import {BcryptAdapter} from "../../../../../infra/criptography/bcrypt/bcrypt-adapter";
import {DbAddAccount} from "../../../../../data/usecases/add-account/db-add-account";
import {AddAccount} from "../../../../../domain/usecases/add-account";

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12
    const accountMongoRepository = new AccountMongoRepository()
    const bcrypterAdapter = new BcryptAdapter(salt)
    return new DbAddAccount(bcrypterAdapter, accountMongoRepository,accountMongoRepository)
}