import {Middlewares} from "../protocols/middlewares";
import {HttpRequest, HttpResponse} from "../protocols/http";
import {forbidden} from "../helpers/http/http-helper";
import {AccessDeniedError} from "../errors/access-denied-error";
import {LoadAccountByToken} from "../../domain/usecases/load-account-by-token";

export class AuthMiddleware implements Middlewares {

   constructor(private readonly loadAccountByToken: LoadAccountByToken) {
       this.loadAccountByToken = loadAccountByToken
   }
   async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
       const accessToken = httpRequest.headers?.['x-access-token']
       if(accessToken){
           await this.loadAccountByToken.load(accessToken)
       }
       const error = forbidden(new AccessDeniedError())
       return error
   }
}