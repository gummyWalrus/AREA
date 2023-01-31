import {forwardRef, HttpCode, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Area} from "../area/schemas/area.schema";
import {HttpService} from "@nestjs/axios";
import axios from "axios";


/**
 * Service for telegram
 * @category Telegram
 * @class TelegramService
 * @description the Service for telegram with all the actions and reactions of the telegram service
 */
@Injectable()
export class TelegramService {
    constructor(
        private Config: ConfigService,
        private http: HttpService,
        @Inject(forwardRef(() => UserService)) private user: UserService
    ) {}

    /**
     * @description private member used to store the all reactions names and the corresponding function to call
     * @example
     * reactions = [
     *    {
     *    name: 'send SMS',
     *    func: 'sendSMS'
     *    },
     *    {
     *    name: 'Send Animation',
     *    func: 'sendAnimation'
     *    },
     *  ]
     *  @type {Array<{name: string, func: string}>}
     *  @memberof TelegramService
     *  @readonly
     */
    private reactions = [
        {
            name: 'Send SMS',
            func: 'sendSMS',
        },
        {
            name: 'Send Animation',
            func: 'sendAnimation',
        },
        {
            name: 'Send Photo',
            func: 'sendPhoto',
        },
        {
            name: 'Send Document',
            func: 'sendDocument',
        },
        {
            name: 'Send Video',
            func: 'sendVideo',
        },
        {
            name: 'Set Chat Photo',
            func: 'setChatPhoto',
        },
        {
            name: 'Set Chat Title',
            func: 'setChatTitle',
        },
        {
            name: 'Set Chat Description',
            func: 'setChatDescription',
        },
        {
            name: 'Set Chat Sticker Set',
            func: 'setChatStickerSet',
        }
    ]

    /**
     * @function react
     * @description react to the action, each service will have its own react function that will be called when the action is triggered by the user, it will found the reaction name in the area and call the corresponding function
     * @param area
     */
    async react(area: Area) {
        console.log('in react telegram');
        for (const reaction of this.reactions) {
            if (reaction.name === area.reaction.id.name) {
                return this[reaction.func](area);
            }
        }
        return null;
    }

    /**
     * @description send a message to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async sendSMS(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/sendMessage?chat_id=' + area.reaction.data.groupeId + "&text=" + area.reaction.data.message).catch(err => console.log(err));
    }

    /**
     * @description send an animation to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async sendAnimation(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/sendAnimation?chat_id=' + area.reaction.data.groupeId + "&animation=" + area.reaction.data.animation).catch(err => console.log(err));
    }

    /**
     * @description send a photo to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async sendPhoto(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/sendPhoto?chat_id=' + area.reaction.data.groupeId + "&photo=" + area.reaction.data.photo).catch(err => console.log(err));
    }

    /**
     * @description send a document to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async sendDocument(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/sendDocument?chat_id=' + area.reaction.data.groupeId + "&document=" + area.reaction.data.document).catch(err => console.log(err));
    }

    /**
     * @description send a video to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async sendVideo(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/sendVideo?chat_id=' + area.reaction.data.groupeId + "&video=" + area.reaction.data.video).catch(err => console.log(err));
    }

    /**
     * @description set the chat photo to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async setChatPhoto(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/setChatPhoto?chat_id=' + area.reaction.data.groupeId + "&photo=" + area.reaction.data.photo).catch(err => console.log(err));
    }

    /**
     * @description set the chat title to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async setChatTitle(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/setChatTitle?chat_id=' + area.reaction.data.groupeId + "&title=" + area.reaction.data.title).catch(err => console.log(err));
    }

    /**
     * @description set the chat description to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async setChatDescription(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/setChatDescription?chat_id=' + area.reaction.data.groupeId + "&description=" + area.reaction.data.description).catch(err => console.log(err));
    }

    /**
     * @description set the chat sticker set to the user using the telegram bot
     * @param {Area} area - the area that triggered the action
     * @returns {Promise<void>}
     */
    @HttpCode(HttpStatus.OK)
    async setChatStickerSet(area: Area) {
        return axios.post('https://api.telegram.org/bot' + this.Config.get('TELEGRAM_BOT_TOKEN')
            + '/setChatStickerSet?chat_id=' + area.reaction.data.groupeId + "&sticker_set_name=" + area.reaction.data.stickerSetName).catch(err => console.log(err));
    }
}
