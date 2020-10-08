import {HttpRequest,HttpResponse} from "../protocols/http";
import {MissingParamError} from "../errors/errors";
import {badRequest, ok, serverError} from "../helpers/http-helper";
import {Controller} from "../protocols/controller";
import {EmailValidator} from "../protocols/email-validator";
import {InvalidParamError} from "../errors/invalid-param-error";
import {AddAccount} from "../../domain/usecases/add-account";
import {Validation} from "../helpers/validators/validation";

export class SignUpController implements Controller{
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount
    private validation: Validation
    constructor(emailValidator : EmailValidator, addAccount: AddAccount,validation: Validation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
        this.validation = validation
    }
     async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
         try{
             const error = this.validation.validate(httpRequest.body)
             if(error){
                 return badRequest(error)
             }
             const requireFields = ['name','email','password','passwordConfirmation']
             for(const field of requireFields){
                 if(!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
             }
             const {name,email,password,passwordConfirmation} = httpRequest.body
             if(password != passwordConfirmation){
                 return badRequest(new InvalidParamError('passwordConfirmation'))
             }
             const isValid = this.emailValidator.isValid(email)
             if(!isValid){
                 return badRequest(new InvalidParamError('email'))
            }
             const account = await this.addAccount.add({
                 name,
                 email,
                 password,
             })
             return ok(account)
         }catch(error){
             return serverError(error)
         }
     }
}
