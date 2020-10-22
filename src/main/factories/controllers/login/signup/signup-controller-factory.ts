import {SignUpController} from "../../../../../presentation/controllers/login/signup/signup-controller";
import {Controller} from "../../../../../presentation/protocols/controller";
import {makeSignUpValidation} from "./signup-validation-factory";
import {makeDbAuthentication} from "../../../usecases/account/authentication/db-authentication-factory";
import {makeDbAddAccount} from "../../../usecases/account/add-account/db-addAccount-factory";
import {makeLogControllerDecorator} from "../../../decorators/log-controller-decorator-factory";


export const makeSignUpController = (): Controller => {
    const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(signUpController)
}
