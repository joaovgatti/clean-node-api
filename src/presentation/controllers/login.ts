import {Controller} from "../protocols/controller";
import {HttpRequest, HttpResponse} from "../protocols/http";
import {badRequest} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";

export class LogInController implements Controller {
    async handle(httpRequest:HttpRequest): Promise<HttpResponse> {
        if(!httpRequest.body.email){
            return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        }if(!httpRequest.body.password){
            return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
        }
    }
}