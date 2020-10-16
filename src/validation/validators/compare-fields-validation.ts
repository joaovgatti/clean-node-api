import {Validation} from "../../presentation/protocols/validation";
import {InvalidParamError} from "../../presentation/errors/invalid-param-error";

export class CompareFieldsValidation implements Validation{
    private readonly fieldName: string
    private readonly fieldToCompare: string

    constructor(fieldName: string, fieldToCompare: string) {
        this.fieldName = fieldName
        this.fieldToCompare = fieldToCompare
    }

    validate(input: any): Error {
        if(input[this.fieldName] != input[this.fieldToCompare]){
            return new InvalidParamError(this.fieldToCompare)
        }
    }
}