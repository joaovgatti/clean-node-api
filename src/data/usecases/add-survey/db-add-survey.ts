import {AddSurvey, AddSurveyModel} from "../../../domain/usecases/add-survey";
import {AddSurveyRepository} from "../../../infra/db/mongodb/survey/add-survey-repository";

export class DbAddSurvey implements AddSurvey{
    constructor(private readonly addSurveyRepository: AddSurveyRepository) {
        this.addSurveyRepository = addSurveyRepository
    }
    async add(data: AddSurveyModel): Promise<void>{
        await this.addSurveyRepository.add(data)
        return new Promise(resolve => resolve(null))
    }
}