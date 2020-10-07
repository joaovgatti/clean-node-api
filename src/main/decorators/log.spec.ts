import {LogControllerDecorator} from "./log";
import {Controller} from "../../presentation/protocols/controller";
import {HttpRequest, HttpResponse} from "../../presentation/protocols/http";
import {AccountModel} from "../../domain/models/account";
import {ok} from "../../presentation/helpers/http-helper";


interface SutTypes{
    sut:LogControllerDecorator
    controllerStub: Controller
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


const makeSut = (): any => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return {
        sut,
        controllerStub
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
})