import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Action } from "src/action/schemas/action.schema";
import { Reaction } from "src/reaction/schemas/reaction.schema";
import { User } from "src/user/schemas/user.schema";
import { Type } from "class-transformer";


export type AreaDocument = Area & Document

@Schema()
export class Area extends Document {
    @Prop( { required: true } )
    name: string;

    @Prop( { required: true } )
    description: string;

    @Prop( { required: true, type: Types.ObjectId, ref: 'User' } )
    @Type(() => User)
    owner : User;

    @Prop( raw({
        id: { type: Types.ObjectId, ref: Action.name },
        data : { type: Object }
    }) )
    action: any;


    @Prop( raw({
        id: { type: Types.ObjectId, ref: Reaction.name },
        data : { type: Object }
    }) )
    reaction: any;
}

export const AreaSchema = SchemaFactory.createForClass(Area);