import {EmailValidator} from "../presentation/protocols/email-validator";

export class EmailValidatorAdpter implements EmailValidator{
    isValid(email: string): boolean {
        return false
    }
}