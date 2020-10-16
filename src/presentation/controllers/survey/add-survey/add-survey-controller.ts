import {Controller} from "../../../protocols/controller";
import {HttpRequest, HttpResponse} from "../../../protocols/http";
import {Validation} from "../../../protocols/validation";

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation) {
        this.validation = validation
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
        this.validation.validate(httpRequest.body)
        return null
    }
}