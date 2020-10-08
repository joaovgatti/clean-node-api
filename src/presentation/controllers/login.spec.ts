import {LogInController} from "./login";
import {badRequest} from "../helpers/http-helper";
import {MissingParamError} from "../errors/errors";

describe('Login Controller', () => {
    test('should return 400 if no email is provided',async () => {
        const sut = new LogInController()
        const httpRequest = {
            body:{
                password:'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))

    });
});