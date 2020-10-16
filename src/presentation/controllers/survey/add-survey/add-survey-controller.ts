import {Controller} from "../../../protocols/controller";
import {HttpRequest, HttpResponse} from "../../../protocols/http";
import {Validation} from "../../../protocols/validation";
import {badRequest, noContent, serverError} from "../../../helpers/http/http-helper";
import {AddSurvey} from "../../../../domain/usecases/add-survey";
import {ServerError} from "../../../errors/server-error";

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation,
                private readonly addSurvey: AddSurvey) {
        this.validation = validation
        this.addSurvey = addSurvey
    }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if(error){
                return  badRequest(error)
            }
            const {question,answers} = httpRequest.body
            await this.addSurvey.add({
                question,
                answers
            })
            return noContent()
        }catch (e){
            return serverError(e)
        }
    }
}