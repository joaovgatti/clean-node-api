import {LogErrorRepository} from "../../../../data/protocols/log-error-repository";
import {promises} from "dns";
import {MongoHelper} from "../helpers/mongo-helper";

export class LogMongoRepository implements LogErrorRepository{
    async logError(stack: string): Promise<void>{
        const errorCollections = await MongoHelper.getCollection('errors')
        await errorCollections.insertOne({
            stack,
            date:new Date()
        })
    }
}