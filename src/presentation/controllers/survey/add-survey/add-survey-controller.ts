import {Controller} from "../../../protocols/controller";
import {HttpRequest, HttpResponse} from "../../../protocols/http";
import {Validation} from "../../../protocols/validation";
import {badRequest} from "../../../helpers/http/http-helper";

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation) {
        this.validation = validation
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

        const error = this.validation.validate(httpRequest.body)
        if(error){
            return  badRequest(error)
        }
        return null
    }
}