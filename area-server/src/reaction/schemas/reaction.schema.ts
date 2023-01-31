import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Document, Types } from 'mongoose';
import { Service } from "src/service/schemas/service.schema";


export type ReactionDocument = Reaction & Document

@Schema()
export class Reaction extends Document {
    @Prop( { required: true } )
    name: string;

    @Prop( { required: true } )
    description: string;

    @Prop( { required: true, type: Types.ObjectId, ref: 'Service' } )
    @Type(() => Service)
    service: Service;

    @Prop( { type: Object } )
    dataScheme: any;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);