import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Area } from 'src/area/schemas/area.schema';
import { Type } from 'class-transformer';


export type UserDocument = User & Document

@Schema()
export class User extends Document {
    @Prop( { required: true, unique: true} )
    email: string;

    @Prop( { required: true } )
    firstname: string;

    @Prop( { required: true } )
    lastname: string;

    @Prop( )
    password: string;

    @Prop( raw ({ 
        token: { type : String },
        username: { type : String }
    }) )
    github: any;

    @Prop( raw ({
        token: { type : String },
        username: { type : String },
        email : { type : String }
    }))
    google : any;

    @Prop( raw ({
        token: { type : String },
        username: { type : String },
    }))
    twitter : any;

    @Prop( raw ({
        token: { type : String },
        username: { type : String },
    }))
    reddit : any;

    @Prop( raw ({
        token: { type : String },
        username: { type : String },
        id: { type : String }
    }))
    discord : any;

    @Prop( { type: [ { type: Types.ObjectId, ref: Area.name} ] } )
    @Type(() => Area)
    areas: Area[];
}

export const UserSchema = SchemaFactory.createForClass(User);