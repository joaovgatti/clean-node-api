import {HttpRequest} from "../../../protocols/http";
import {AddSurveyController} from "./add-survey-controller";
import {Validation} from "../../../protocols/validation";
import {badRequest} from "../../../helpers/http/http-helper";
import {ServerError} from "../../../errors/server-error";

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

    test('should returs 404 if validation fails',async () => {
        const {sut,validationStub}  = makeSut()
        jest.spyOn(validationStub,'validate').mockReturnValueOnce(
         new Error()
        )
        const httpResponse = await  sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new Error()))
    })

})
