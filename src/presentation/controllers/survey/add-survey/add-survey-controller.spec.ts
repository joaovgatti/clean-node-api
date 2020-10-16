import {HttpRequest} from "../../../protocols/http";
import {AddSurveyController} from "./add-survey-controller";
import {Validation} from "../../../protocols/validation";

describe('AddSurvey controller',() => {


    const makeFakeRequest = (): HttpRequest => {
         return ({
             body:{
                 question:'any_question',
                 answers: [{
                     image: 'any_image',
                     answer:'any_answer'
                 }]
             }
         })
    }

    const makeValidationStub = (): Validation => {
        class MakeValidationStub implements Validation{
            validate(input: any): Error{
                return null
            }
        }
        return new MakeValidationStub()
    }

    interface SutTypes {
        sut: AddSurveyController
        validationStub: Validation
    }

    const makeSut = (): SutTypes => {
        const validationStub = makeValidationStub()
        const sut = new AddSurveyController(validationStub)
        return {
            sut,
            validationStub
        }
    }

    test('should call Validation with correct values',async () => {
        const {sut,validationStub} = makeSut()
        const validateSpy = jest.spyOn(validationStub,'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
