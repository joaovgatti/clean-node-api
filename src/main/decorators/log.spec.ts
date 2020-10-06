import {LogControllerDecorator} from "./log";
import {Controller} from "../../presentation/protocols/controller";
import {HttpRequest, HttpResponse} from "../../presentation/protocols/http";


interface SutTypes{
    sut:LogControllerDecorator
    controllerStub: Controller
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: 'joao',
                }
            }
            return new Promise(resolve => resolve(httpResponse))
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


describe('LogControllerDecorator',() => {
    test('should call SignUpController handler',async () => {
        const {sut,controllerStub} = makeSut()
        const controllerSpy  = jest.spyOn(controllerStub,'handle')
        const httpRequest = {
            statusCode:200,
            body:{
                name: 'joao',
                email: 'joao@mail.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        await sut.handle(httpRequest)
    })

    test('should return the same result of the controller',async () => {
        const {sut,controllerStub} = makeSut()
        const httpRequest = {
            statusCode:200,
            body:{
                name: 'joao',
                email: 'joao@mail.com',
                password: '123',
                passwordConfirmation: '123'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'joao',
            }
        })
     })
})