import {RequiredFieldValidation} from "./required-field-validation";
import {MissingParamError} from "../../errors/errors";

describe('Required field validation',() => {
    test('should return a MissingParamError if validation fails',() => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({
            name: 'any_name'
        })
        expect(error).toEqual(new MissingParamError('field'))
    })
    test('should not return if validation succeeds',() => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({
            field:'any_field'
        })
        expect(error).toBeFalsy()
    })
})