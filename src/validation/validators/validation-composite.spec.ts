import {ValidationComposite} from "./validation-composite";
import {MissingParamError} from "../../presentation/errors/errors";
import {Validation} from "../../presentation/protocols/validation";


const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation{
        validate(input: any): Error {
            return null
        }
    }
    return new ValidationStub()
}

interface SutTypes{
    sut: ValidationComposite
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new ValidationComposite([validationStub])
    return {
        sut,
        validationStub
    }
}

describe('Validation Composite',() => {
    test('should return an error if any validation fails',() => {
       const {sut, validationStub} = makeSut()
       jest.spyOn(validationStub,'validate').mockReturnValueOnce(
           new MissingParamError('field')
       )
        const error = sut.validate({
            field:'any_value'
        })
        expect(error).toEqual(new MissingParamError('field'))
    })
    test('should not return if validation pass',() => {
        const {sut} = makeSut()
        const error = sut.validate({field:'any_value'})
        expect(error).toBeFalsy()
    })
})