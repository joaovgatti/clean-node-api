import {Middlewares} from "../protocols/middlewares";
import {HttpRequest, HttpResponse} from "../protocols/http";
import {forbidden} from "../helpers/http/http-helper";
import {AccessDeniedError} from "../errors/access-denied-error";

export class AuthMiddleware implements Middlewares {
   async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
       const error = forbidden(new AccessDeniedError())
       return new Promise(resolve => resolve(error))
   }
}