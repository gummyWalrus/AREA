import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceService } from 'src/service/service.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action, ActionDocument } from './schemas/action.schema';

/**
 * Service for actions
 * @category Action
 * @class ActionService
 * @description here it will be possible to create, update, delete and get actions
 */
@Injectable()
export class ActionService {
    constructor(@InjectModel(Action.name) private actionModel : Model<ActionDocument>,
    @Inject(forwardRef(() => ServiceService)) private serviceService: ServiceService) {}


    async create(createActionDto: CreateActionDto): Promise<Action> {
        const newAction = await new this.actionModel(createActionDto).save();
        this.serviceService.addAction(newAction.service.toString(), newAction._id);
        return newAction;
    }

    async update(id: string, updateActionDto: UpdateActionDto): Promise<Action> {
        return await this.actionModel.findByIdAndUpdate(id, updateActionDto).exec();
    }

    async delete(id: string): Promise<Action> {
        const action = await this.actionModel.findByIdAndDelete(id).exec();
        this.serviceService.removeAction(action.service.toString(), action._id);
        return action;
    }

    async deleteAll() {
        const actions = await this.findAll();
        for (const action of actions) {
            this.delete(action._id);
        }
        return {"msg": "all actions deleted"}
    }

    async findOne(id: string): Promise<Action> {
        return await this.actionModel.findById(id).populate('service').exec();
    }

    async findAll(): Promise<Action[]> {
        return await this.actionModel.find().populate('service').exec();
    }
}