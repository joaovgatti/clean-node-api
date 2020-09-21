import {HttpRequest,HttpResponse} from "../protocols/http";
import {MissingParamError} from "../errors/errors";
import {badRequest} from "../helpers/http-helper";

export class SignUpController{
    handle(httpRequest: HttpRequest): HttpResponse{
        const requireFields = ['name','email','password','passwordConfirmation']
        for(const field of requireFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }
    }
}