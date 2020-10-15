import {HttpRequest,HttpResponse} from "../../protocols/http";
import {MissingParamError} from "../../errors/errors";
import {badRequest, forbidden, ok, serverError} from "../../helpers/http/http-helper";
import {Controller} from "../../protocols/controller";
import {EmailValidator} from "../../protocols/email-validator";
import {InvalidParamError} from "../../errors/invalid-param-error";
import {AddAccount} from "../../../domain/usecases/add-account";
import {Validation} from "../../protocols/validation";
import {Authentication} from "../../../domain/usecases/authentication";
import {EmailInUseError} from "../../errors/email-in-use-error";

export class SignUpController implements Controller{
    private readonly addAccount: AddAccount
    private validation: Validation
    constructor( addAccount: AddAccount,validation: Validation,readonly authentication: Authentication) {
        this.addAccount = addAccount
        this.validation = validation
        this.authentication = authentication
    }
     async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
         try{
             const error = this.validation.validate(httpRequest.body)
             if(error){
                 return badRequest(error)
             }
             const {name,email,password} = httpRequest.body
             const account = await this.addAccount.add({
                 name,
                 email,
                 password,
             })
             if(!account){
                 return forbidden(new EmailInUseError())
             }
             const accessToken = await this.authentication.auth({
                 email,
                 password
             })
             return ok({accessToken})
         }catch(error){
             return serverError(error)
         }
     }
}
