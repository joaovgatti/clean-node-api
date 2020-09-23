import {HttpResponse} from "../protocols/http";
import {ServerError} from "../errors/server-error";
import {AccountModel} from "../../domain/models/account";

export const badRequest = (error:Error):HttpResponse => {
    return {
        statusCode:400,
        body:error
    }
}

export const serverError = () : HttpResponse =>{
    return{
        statusCode:500,
        body: new ServerError()
    }
}

export const ok = (data:any) : HttpResponse =>{
    return{
        statusCode:200,
        body: data
    }
}