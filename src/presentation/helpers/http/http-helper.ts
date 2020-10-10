import {HttpResponse} from "../../protocols/http";
import {ServerError} from "../../errors/server-error";
import {UnauthorizedError} from "../../errors/unauthorized-error";

export const badRequest = (error:Error):HttpResponse => {
    return {
        statusCode:400,
        body:error
    }
}

export const serverError = (erro: Error) : HttpResponse => ({
        statusCode:500,
        body: new ServerError(erro.stack)

})

export const unauthorized = (): HttpResponse => ({
    statusCode:401,
    body: new UnauthorizedError()
})


export const ok = (data:any) : HttpResponse =>{
    return{
        statusCode:200,
        body: data
    }
}