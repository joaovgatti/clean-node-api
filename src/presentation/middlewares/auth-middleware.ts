import {Middlewares} from "../protocols/middlewares";
import {HttpRequest, HttpResponse} from "../protocols/http";
import {forbidden, ok, serverError} from "../helpers/http/http-helper";
import {AccessDeniedError} from "../errors/access-denied-error";
import {LoadAccountByToken} from "../../domain/usecases/load-account-by-token";

export class AuthMiddleware implements Middlewares {

   constructor(private readonly loadAccountByToken: LoadAccountByToken,
               private readonly role?: string) {}

   async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
       try {
           const accessToken = httpRequest.headers?.['x-access-token']
           if (accessToken) {
               const account = await this.loadAccountByToken.load(accessToken,this.role)
               if (account) {
                   return ok({accountId: account.id})
               }
           }
           return forbidden(new AccessDeniedError())
       }
       catch (error){
           return serverError(error)
       }
   }
}


