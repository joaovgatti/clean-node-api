export class ServerError extends Error{
    constructor() {
        super("Internal server error");
        this.name = 'Server Error'



    }
}