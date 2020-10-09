import {CompareFieldsValidation} from "./compare-fields-validation";
import {InvalidParamError} from "../../errors/invalid-param-error";

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field','fieldToCompare')
}

describe('Compare Field Validation',() => {
    test('should return an invalidParamError if validation fails',() => {
        const sut = makeSut()
        const error = sut.validate({
            field:'field',
            fieldToCompare:'invalid'
        })
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })
    test('should not return if validation succeeds',() => {
        const sut = makeSut()
        const error = sut.validate({
            field:'field',
            fieldToCompare:'field'
        })
        expect(error).toBeFalsy()
    })
})
