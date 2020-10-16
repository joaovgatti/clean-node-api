import {HttpRequest} from "../../../protocols/http";
import {AddSurveyController} from "./add-survey-controller";
import {Validation} from "../../../protocols/validation";
import {badRequest, noContent, serverError} from "../../../helpers/http/http-helper";
import {ServerError} from "../../../errors/server-error";
import {AddSurvey, AddSurveyModel} from "../../../../domain/usecases/add-survey";

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

    const makeAddSurveyStub = (): AddSurvey => {
        class AddSurveyStub implements AddSurvey{
            async add(data: AddSurveyModel): Promise<void>{
                return new Promise(resolve => resolve())
            }
        }
        return new AddSurveyStub()
    }

    interface SutTypes {
        sut: AddSurveyController
        validationStub: Validation
        addSurveyStub: AddSurvey
    }

    const makeSut = (): SutTypes => {
        const validationStub = makeValidationStub()
        const addSurveyStub = makeAddSurveyStub()
        const sut = new AddSurveyController(validationStub,addSurveyStub)
        return {
            sut,
            validationStub,
            addSurveyStub
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

    test('should call AddSurvey with correct values',async () => {
        const {sut,addSurveyStub} = makeSut()
        const addSpy = jest.spyOn(addSurveyStub,'add')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should returns 500 if AddSurvey throws',async () => {
        const {sut,addSurveyStub}  = makeSut()
        jest.spyOn(addSurveyStub,'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await  sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 204 on success',async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(noContent())
    })


})
