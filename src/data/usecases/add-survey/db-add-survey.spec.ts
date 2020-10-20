import {AddSurvey, AddSurveyModel} from "../../../domain/usecases/add-survey";
import {DbAddSurvey} from "./db-add-survey";
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

     interface SutTypes{
        sut: DbAddSurvey
        addSurveyRepositoryStub:  AddSurveyRepository
     }

     const makeSut = (): SutTypes => {
         const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
         const sut = new DbAddSurvey(addSurveyRepositoryStub)
         return {
             sut,
             addSurveyRepositoryStub
         }
    }

    test('Should call AddSurveyRepository with correct values',async () => {
        const {sut,addSurveyRepositoryStub} = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub,'add')
        await sut.add(makeFakeSurveyData())
        expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
    })

    /*test('should throw if AddSurveyRepository throws',async () => {
        const {sut,addSurveyRepositoryStub} = makeSut()
        jest.spyOn(addSurveyRepositoryStub,'add').mockReturnValueOnce(
            new Promise(((resolve, reject) => reject(new Error())))
        )
        const promise = await sut.add(makeFakeSurveyData())
        await expect(promise).rejects.toThrow(new Error())
    })*/
})