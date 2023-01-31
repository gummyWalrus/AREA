import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Type } from 'class-transformer';
import { Action } from 'src/action/schemas/action.schema';
import { Reaction } from 'src/reaction/schemas/reaction.schema';

export type ServiceDocument = Service & Document

@Schema()
export class Service extends Document {
    @Prop( { required: true } )
    name: string;

    @Prop( { required: true } )
    logo: string;

    @Prop( { type: [ { type : Types.ObjectId, ref: 'Action' } ]} )
    @Type(() => Action)
    actions: Action[];


    @Prop( { type: [ { type : Types.ObjectId, ref: 'Reaction' } ]} )
    @Type(() => Reaction)
    reactions: Reaction[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);