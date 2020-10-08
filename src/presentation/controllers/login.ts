import {Controller} from "../protocols/controller";
import {HttpRequest, HttpResponse} from "../protocols/http";
import {badRequest, serverError} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";
import {Authentication} from "../../domain/usecases/authentication";

export class LogInController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication
    constructor(emailValidator: EmailValidator,authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }
    async handle(httpRequest:HttpRequest): Promise<HttpResponse> {
        try {
            const {email, password} = httpRequest.body
            if (!email) {
                return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
            }
            if (!password) {
                return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
            }
            const isValidEmail = this.emailValidator.isValid(email)
            if (!isValidEmail) {
                return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
            }
            await this.authentication.auth(email,password)

        }catch (error){
            return serverError(error)
        }
    }
}

