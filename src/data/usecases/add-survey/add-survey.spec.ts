import {AddSurvey, AddSurveyModel} from "../../../domain/usecases/add-survey";
import {DbAddSurvey} from "./add-survey";
import {AddSurveyRepository} from "../../../infra/db/mongodb/survey/add-survey-repository";

describe('DbAddSurvey UseCase',() => {

    const makeFakeSurveyData = (): AddSurveyModel => ({
        question: 'any_question',
        answers:[{
            image:'any_image',
            answer:'any_answer'
        }]
    })

    const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
        class AddDSurveyRepository implements AddSurveyRepository{
            add(surveyData: AddSurveyModel): Promise<void> {
                return new Promise(resolve => resolve())
            }
        }
        return new AddDSurveyRepository()
    }

    test('Should call AddSurveyRepository with correct values',async () => {
        const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
        const addSpy = jest.spyOn(addSurveyRepositoryStub,'add')
        const sut = new DbAddSurvey(addSurveyRepositoryStub)
        await sut.add(makeFakeSurveyData())
        expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())

    })
})