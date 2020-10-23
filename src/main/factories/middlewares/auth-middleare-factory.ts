import {Middleware} from "../../../presentation/protocols/middlewares";
import {AuthMiddleware} from "../../../presentation/middlewares/auth-middleware";
import {makeDbLoadAccountByToken} from "../usecases/survey/load-account-by-token/db-load-account-by-token-factory";

export const makeAuthMiddleware = (role?: string): Middleware => {
    return new AuthMiddleware(makeDbLoadAccountByToken(),role)
}