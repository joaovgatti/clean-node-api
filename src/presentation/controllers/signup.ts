import {HttpRequest,HttpResponse} from "../../protocols/http";
import {MissingParamError} from "../errors";

export class SignUpController{
    handle(httpRequest: HttpRequest): HttpResponse{
        if(!httpRequest.body.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('Missing param: Name')
            }
        }
        if(!httpRequest.body.email){
            return {
                statusCode:400,
                body: new MissingParamError('Missing param: email')
            }
        }
    }
}