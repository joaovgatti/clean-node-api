import {LogControllerDecorator} from "./log";
import {Controller} from "../../presentation/protocols/controller";
import {HttpRequest, HttpResponse} from "../../presentation/protocols/http";

describe('LogControllerDecorator',() => {
    test('should call SignUpController handler',async () => {
        class ControllerStub implements Controller{
            async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
                const httpResponse: HttpResponse = {
                    statusCode:200,
                    body:{
                        name:'joao',
                        email:"any@mail.com",
                        password:'123',
                        passwordConfirmation:'123'
                    }
                }
                return httpResponse
            }
        }
        const controllerStub = new ControllerStub()
        const controllerSpy  = jest.spyOn(controllerStub,'handle')
        const sut = new LogControllerDecorator(controllerStub)
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
})