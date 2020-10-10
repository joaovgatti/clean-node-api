import {LogControllerDecorator} from "./log";
import {Controller} from "../../presentation/protocols/controller";
import {HttpRequest, HttpResponse} from "../../presentation/protocols/http";
import {AccountModel} from "../../domain/models/account";
import {ok, serverError} from "../../presentation/helpers/http/http-helper";
import {LogErrorRepository} from "../../data/protocols/log-error-repository";


interface SutTypes{
    sut:LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise(resolve => resolve(ok(makeFakeAccount())))
        }
    }
    const controllerStub = new ControllerStub()
    return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError(stack: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}



const makeSut = (): any => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub,logErrorRepositoryStub)
    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeFakeAccount = (): AccountModel => ({
    name:'valid_name',
    email:'valid_email@mail.com',
    password:'valid_password',
    id:'valid_id'
})


describe('LogControllerDecorator',() => {
    test('should call SignUpController handler',async () => {
        const {sut,controllerStub} = makeSut()
        const controllerSpy  = jest.spyOn(controllerStub,'handle')
        await sut.handle(makeFakeRequest())
    })

    test('should return the same result of the controller',async () => {
        const {sut,controllerStub} = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
       expect(httpResponse).toEqual(ok(makeFakeAccount()))
     })

    test('should call LogErrorRepository with correct error if controller retuns a server erros',async() => {
        const {sut,controllerStub, logErrorRepositoryStub} =  makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        const logSpy = jest.spyOn(logErrorRepositoryStub,'logError')
        jest.spyOn(controllerStub,'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        await sut.handle(makeFakeRequest())
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })







})