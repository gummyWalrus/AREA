import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import { Model } from 'mongoose';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ActionService } from 'src/action/action.service';
import { ReactionService } from 'src/reaction/reaction.service';
import { AuthService } from 'src/auth/auth.service';
import { DiscordService } from 'src/discord/discord.service';

const nologinServices = ['SMS', 'Telegram'];

function findAuthServicebyName (serv) {
    if ((serv.service.name === this.name && serv.loggedIn === true)
    ||nologinServices.find((service) => {
        return this.name === service;
    }, serv))
        return true;
    else return false;
}


function findServicebyName (serv) {
    if (serv.name === this.name)
        return true;
    else return false;
}

/**
 * Service service
 * @class ServiceService
 * @description the communication between the controller and the database
 */
@Injectable()
export class ServiceService {
    constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @Inject(forwardRef(() => ActionService)) private actionService: ActionService,
    @Inject(forwardRef(() => ReactionService)) private reactionService: ReactionService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => DiscordService)) private discord : DiscordService) {}

    /**
     * @description create a service in the database
     * @param {CreateServiceDto} createServiceDto - the service object to create
     * @return {Promise<Service>} the service created
     */
    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        return new this.serviceModel(createServiceDto).save();
    }

    /**
     * @description update a service in the database
     * @param {UpdateServiceDto} updateServiceDto - the service object to create
     * @return {Promise<Service>} the service created
     */
    async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
        return await this.serviceModel.findByIdAndUpdate(id, updateServiceDto).exec();
    }

    /**
     * @description delete a service in the database
     * @param {string} id - the id of the service to delete
     * @return {Promise<Service>} the service created
     */
    async delete(id: string): Promise<Service> {
        let service = await this.serviceModel.findById(id);
        for (const action of service.actions)
            this.actionService.delete(action.toString());
        for (const reaction of service.reactions)
            this.reactionService.delete(reaction.toString());
        return service.delete();
    }

    /**
     * @description delete all services in the database
     * @return {"msg" : "All services deleted"}
     */
    async deleteAll() {
        let services = await this.findAll();
        for (const service of services)
            await this.delete(service._id);
        return {"msg" : "all services deleted"};
    }

    /**
     * @description find a service in the database
     * @param id - the id of the service to find
     * @return {Promise<Service>} the service found
     */
    async findOneQuick(id: string): Promise<Service> {
        const service = await this.serviceModel.findById(id).populate('actions').populate('reactions').exec();
        return service;
    }

    /**
     * @description find a service in the database if the service is Discord it will set all the channel inside the reaction.dataScheme.channel.choices
     * @param id - the id of the service to find
     * @return {Promise<Service>} the service found
     */
    async findOne(id: string, user_id : string): Promise<Service> {
        const service = await this.serviceModel.findById(id).populate('actions').populate('reactions').exec();
        for (const reaction of service.reactions) {
            if (reaction.name === "Discord ChannelMsg") {
                reaction.dataScheme.channel.choices = await this.discord.getChannels(user_id);
            }
        }
        return service;
    }

    /**
     * @description find all services in the database
     * @return {Promise<Service[]>} the services found
     */
    async findAll(): Promise<Service[]> {
        return await this.serviceModel.find().populate('actions').populate('reactions').exec();
    }

    /**
     * @description update a service in the database
     * @param id - the id of the service to update
     * @param action_id - the id of the action to add
     */
    async addAction(id: string, action_id: string): Promise<Service> {
        return await this.serviceModel.findByIdAndUpdate(
            id,
            { $addToSet: { actions: action_id }},
            { new: true }
        ).exec();
    }

    /**
     * @description remove action from service in the database
     * @param id - the id of the service to update
     * @param action_id - the id of the action to remove
     */
    async removeAction(id: string, action_id: string): Promise<Service> {
        return await this.serviceModel.findByIdAndUpdate(
            id, 
            { $pull: {actions: action_id} }
        ).exec();
    }

    /**
     * @description add reaction to service in the database
     * @param id - the id of the service to update
     * @param reaction_id - the id of the reaction to add
     */
    async addReaction(id: string, reaction_id: string): Promise<Service> {
        return this.serviceModel.findByIdAndUpdate(
            id,
            { $addToSet: { reactions: reaction_id }},
            { new: true }
        ).exec();
    }

    /**
     * @description remove reaction from service in the database
     * @param id - the id of the service to update
     * @param reaction_id - the id of the reaction to remove
     */
    async removeReaction(id: string, reaction_id: string): Promise<Service> {
        return this.serviceModel.findByIdAndUpdate(
            id, 
            { $pull: {reactions: reaction_id} }
        ).exec();
    }

    /**
     * @description find the action of a service in the database
     * @param req - the request of the user
     */
    async findActionServices(req: any) : Promise<Service[]> {
        let services : Service[] = await this.findAll();
        const authedServices = await this.authService.loggedInServices(req.user);
        let actionsServices = [];
        for (let serv of services) {
            if (serv.actions.length > 0)
                actionsServices.push(serv);
        }
        for (let service of actionsServices) {
            const index = authedServices.findIndex(findAuthServicebyName, service)
            if (index < 0) {
                actionsServices.splice(actionsServices.findIndex(findServicebyName, service), 1);
            }
        }
        return actionsServices;
    }

    /**
     * @description find the reaction of a service in the database
     * @param req - the request of the user
     */
    async findReactionServices(req: any) : Promise<Service[]> {
        let services : Service[] = await this.findAll();
        const authedServices = await this.authService.loggedInServices(req.user);
        let reactionsServices = [];
        for (let serv of services) {
            if (serv.reactions.length > 0)
                reactionsServices.push(serv);
        }
        let resultServices = []
        for (let service of reactionsServices) {
            const index = authedServices.findIndex(findAuthServicebyName, service)
            if (index >= 0) {
                resultServices.push(service);
            }
        }
        return resultServices;
    }
}
