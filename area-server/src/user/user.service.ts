import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AreaService } from 'src/area/area.service';

const bcrypt = require('bcryptjs');

/**
 * Service for user
 * @category User
 * @class UserService
 * @description User service handles all the users of the application, it can create, update, delete, find and find one user
 */
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @Inject(forwardRef(() => AreaService)) private areaService: AreaService) {}

    /**
     * @description get all the users
     * @returns {Promise<User[]>} the list of all the users
     */
    async all() : Promise<User[]> {
        return this.userModel.find();
    }

    /**
     * @description create a new user
     * @param {CreateUserDto} createUserDto - the user to create
     * @returns {Promise<User>} the created user
     */
    async create(createUserDto : CreateUserDto): Promise<User> {
        createUserDto.password = bcrypt.hashSync(createUserDto.password);
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    /**
     * @description update a user
     * @param {string} id - the id of the user to update
     * @param {UpdateUserDto} updateUserDto - the user to update
     * @returns {Promise<User>} the updated user
     */
    async update(id : string, updateUserDto : UpdateUserDto): Promise<User> {
        if (updateUserDto.password)
            updateUserDto.password = bcrypt.hashSync(updateUserDto.password);
        return await this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
    }

    /**
     * @description delete a user
     * @param {string} id - the id of the user to delete
     * @returns {Promise<User>} the deleted user
     */
    async delete(id : string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        for (const area of user.areas)
            this.areaService.delete(area.toString())
        return user.delete();
    }

    /**
     * @description find a user by its id
     * @param {string} id - the id of the user to find
     * @returns {Promise<User>} the found user
     */
    async findOne(id : string): Promise<User> {
        return await this.userModel.findById(id).populate('areas').exec();
    }

    /**
     * @description find a user by its email
     * @param {string} email - the email of the user to find
     * @returns {Promise<User>} the found user
     */
    async findByEmail(email : string): Promise<User[]> {
        return await this.userModel.find({"email": email}).exec();
    }

    /**
     * @description add an area to a user
     * @param {string} id - the id of the user
     * @param {string} area_id - the id of the area
     * @returns {Promise<User>} the updated user
     */
    async addArea(id : string, area_id : string): Promise<User> {
        return this.userModel.findByIdAndUpdate(
            id,
            { $addToSet: { areas: area_id } },
            { new: true }
        ).exec();
    }

    /**
     * @description remove an area from a user
     * @param {string} id - the id of the user
     * @param {string} area_id - the id of the area
     * @returns {Promise<User>} the updated user
     */
    async removeArea(id : string, area_id : string): Promise<User> {
        return this.userModel.findByIdAndUpdate(
            id,
            { $pull: { areas: area_id } },
            { new: true }
        ).exec();
    }

    /**
     * @description find a user by its google email
     * @param {string} email - the email of the user to find
     * @returns {Promise<User>} the found user
     */
    async findByGoogleEmail(email: string): Promise<User[]> {
        return this.userModel.find({"google.email": email}).exec();
    }

    /**
     * @description find a user by its GitHub username
     * @param {string} username - the username of the user to find
     * @returns {Promise<User>} the found user
     */
    async findByGithubUsername(username: string): Promise<User[]> {
        return this.userModel.find({"github.username": username}).exec();
    }

    /**
     * @description find a user by its Discord username
     * @param {string} username - the username of the user to find
     * @returns {Promise<User>} the found user
     */
    async findByDiscordUsername(username: string): Promise<User[]> {
        return this.userModel.find({"discord.username": username}).exec()
    }
}
