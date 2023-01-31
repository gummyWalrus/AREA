import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Document, Types } from 'mongoose';
import { Service } from "src/service/schemas/service.schema";

/**
 * @category Action
 * @type ActionDocument
 * @description Action Model
 * @property {string} name - name of the action
 * @property {string} description - description of the action
 * @property {Service} service - service id
 * @property {any} dataScheme - data scheme of the action
 */
export type ActionDocument = Action & Document

@Schema()
export class Action extends Document {
    @Prop( { required: true } )
    name: string;

    @Prop( { required: true } )
    description: string;

    @Prop( { required: true, type: Types.ObjectId, ref: "Service" } )
    @Type(() => Service)
    service: Service;

    @Prop( { required: true, type: Object } )
    dataScheme: any;
}

export const ActionSchema = SchemaFactory.createForClass(Action);