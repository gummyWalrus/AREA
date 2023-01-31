import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area, AreaDocument } from './schemas/area.schema';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UserService } from 'src/user/user.service';
import { ReactionService } from 'src/reaction/reaction.service';
import { ActionService } from 'src/action/action.service';
import { Action } from 'src/action/schemas/action.schema';
import { GithubService } from 'src/github/github.service';

/**
 * AreaService is the service that handles all the logic for the Area (create/update/delete/...)
 * @category Area Service
 * @class AreaService
 */

@Injectable()
export class AreaService {
    constructor(
        @InjectModel(Area.name) private areaModel : Model<AreaDocument>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        private readonly actionService: ActionService,
        private readonly reactionService: ReactionService,
        @Inject(forwardRef(() => GithubService)) private githubService: GithubService) {}

    /**
     * @description Create a new Area
     * @param uid - the uid of the user that created the area
     * @param createAreaDto - The area object to create the area
     * @returns {Promise<Area>}
     */
    async create(uid : string, createAreaDto: CreateAreaDto): Promise<Area> {
        const newArea = await new this.areaModel({...createAreaDto, "owner": uid}).save();
        this.userService.addArea(uid, newArea._id);
        this.actionService.findOne(createAreaDto.action.id).then((action : Action) => {
            if (action.service.name === "Github") {
                this.githubService.addWebhook(newArea);
            }
        })
        return newArea;
    }

    /**
     * @description Update an area
     * @param id - the id of the area to update
     * @param updateAreaDto
     * @returns {Promise<Area>}
     */
    async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
        return await this.areaModel.findByIdAndUpdate(id, updateAreaDto).exec();
    }

    /**
     * @description Delete an area
     * @param id - the id of the area to delete
     * @returns {Promise<Area>}
     */
    async delete(id: string): Promise<Area> {
        const area = await this.areaModel.findByIdAndDelete(id).exec();
        this.userService.removeArea(area.owner.toString(), area._id);
        return area;
    }

    /**
     * @description Find an area by its id
     * @param id - the id of the area to find
     * @returns {Promise<Area>}
     */
    async findOne(id: string): Promise<Area> {
        return await this.areaModel.findById(id).populate('action.id').populate('reaction.id').exec();
    }

    /**
     * @description Find all areas
     * @returns {Promise<Area[]>}
     */
    async findAll(): Promise<Area[]> {
        return await this.areaModel.find().populate('action.id').populate('reaction.id').exec();
    }
}
