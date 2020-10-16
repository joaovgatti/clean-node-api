import {AccountMongoRepository} from "../../../../infra/db/mongodb/account/account-mongo-repository";
import {BcryptAdapter} from "../../../../infra/criptography/bcrypt/bcrypt-adapter";
import {DbAuthentication} from "../../../../data/usecases/authentication/db-authentication";
import {Controller} from "../../../../presentation/protocols/controller";
import env from "../../../config/env";
import {JwtAdapter} from "../../../../infra/criptography/jwt-adapter/jwt-adapter";
import {Authentication} from "../../../../domain/usecases/authentication";


export const makeDbAuthentication = (): Authentication => {
    const salt = 12
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const bcrypterAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAuthentication(accountMongoRepository,bcrypterAdapter,jwtAdapter,accountMongoRepository)

}