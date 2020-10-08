import {Controller} from "../protocols/controller";
import {HttpRequest, HttpResponse} from "../protocols/http";
import {badRequest, serverError} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";

export class LogInController implements Controller {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
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
        }catch (error){
            return serverError(error)
        }
    }
}

