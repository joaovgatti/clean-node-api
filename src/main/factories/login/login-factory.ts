import {Controller} from "../../../presentation/protocols/controller";
import {LoginController} from "../../../presentation/controllers/login/login-controller";
import {LogControllerDecorator} from "../../decorators/log-controller-decorator";
import {LogMongoRepository} from "../../../infra/db/mongodb/log/log-mongo-repository";
import {DbAuthentication} from "../../../data/usecases/authentication/db-authentication";
import {makeLoginValidation} from "./login-validation-factory";
import {AccountMongoRepository} from "../../../infra/db/mongodb/account/account-mongo-repository";
import {BcryptAdapter} from "../../../infra/criptography/bcrypt/bcrypt-adapter";
import {JwtAdapter} from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
    const salt = 12
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const bcrypterAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAuthentication = new DbAuthentication(accountMongoRepository,bcrypterAdapter,jwtAdapter,accountMongoRepository)
    const loginController = new LoginController(makeLoginValidation(),dbAuthentication)
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(loginController,logMongoRepository)
}