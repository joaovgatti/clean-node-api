import {AddSurveyRepository} from "./add-survey-repository";
import {AddSurveyModel} from "../../../../domain/usecases/add-survey";
import {MongoHelper} from "../helpers/mongo-helper";

export class SurveyMongoRepository implements AddSurveyRepository{
   async add(surveyData: AddSurveyModel): Promise<any> {
       const surveyCollection = await MongoHelper.getCollection('surveys')
       await surveyCollection.insertOne(surveyData)
   }
}