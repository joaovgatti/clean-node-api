import {EmailValidatorAdpter} from "./email-validator";

describe('EmailValidator Adapter',() => {
    test("Should return false when the validator returns false",() => {
        const sut = new EmailValidatorAdpter()
        const isValid = sut.isValid('invalid_mail@gmail.com')
        expect(isValid).toBe(false)
    })
})

