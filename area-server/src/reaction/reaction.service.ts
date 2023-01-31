import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceService } from 'src/service/service.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction, ReactionDocument } from './schemas/reaction.schema';

/**
 * Service for reactions
 * @category Reaction
 * @class ReactionService
 * @description here it will be possible to create, update, delete and get reactions
 */
@Injectable()
export class ReactionService {
    constructor(@InjectModel(Reaction.name) private reactionModel : Model<ReactionDocument>,
    @Inject(forwardRef(() => ServiceService)) private serviceService: ServiceService) {}

    /**
     * @description create a reaction
     * @param {CreateReactionDto} createReactionDto - reaction object to create
     * @memberof ReactionService
     * @returns {Promise<Reaction>} - the created reaction
     */
    async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
        const newReaction = await new this.reactionModel(createReactionDto).save();
        this.serviceService.addReaction(newReaction.service.toString(), newReaction._id);
        return newReaction;
    }

    /**
     * @description update a reaction
     * @param id
     * @param updateReactionDto
     * @returns {Promise<Reaction>} - the updated reaction
     */
    async update(id: string, updateReactionDto: UpdateReactionDto): Promise<Reaction> {
        return await this.reactionModel.findByIdAndUpdate(id, updateReactionDto).exec();
    }

    /**
     * @description delete a reaction
     * @param id
     * @returns {Promise<Reaction>} - the deleted reaction
     */
    async delete(id: string): Promise<Reaction> {
        const reaction = await this.reactionModel.findByIdAndDelete(id).exec();
        this.serviceService.removeReaction(reaction.service.toString(), reaction._id);
        return reaction;
    }

    /**
     * @description find a reaction
     * @param id
     * @returns {Promise<Reaction>} - the reaction
     */
    async findOne(id: string): Promise<Reaction> {
        return await this.reactionModel.findById(id).populate('service').exec();
    }


    /**
     * @description find all reactions
     * @returns {Promise<Reaction[]>} - the reactions
     */
    async findAll(): Promise<Reaction[]> {
        return await this.reactionModel.find().populate('service').exec();
    }

    /**
     * @description delete all reactions
     * @returns {Promise<{msg: string}>} - a message
     */
    async deleteAll() {
        const reactions = await this.findAll();
        for (const reaction of reactions) {
            this.delete(reaction._id);
        }
        return {"msg" : "All reactions deleted"}
    }
}
