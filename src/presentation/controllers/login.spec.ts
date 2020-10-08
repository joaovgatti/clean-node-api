import {LogInController} from "./login";
import {badRequest} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";
import {SignUpController} from "./signup";


interface SutTypes{
    sut: LogInController
}

const  makeSut = (): SutTypes => {
    const sut = new LogInController()
    return {
        sut
    }
}




describe('Login Controller', () => {
    test('should return 400 if no email is provided',async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                password:'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))

    });
    test('should return 400 if no password if provided',async() => {
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                email:'any_email@mail.com'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
});