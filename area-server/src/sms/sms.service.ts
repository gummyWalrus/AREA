import { Injectable } from '@nestjs/common';
import { TwilioService } from "nestjs-twilio";
import {Area} from "../area/schemas/area.schema";

/**
 * Service for sms
 * @category SMS
 * @class SmsService
 * @description the Service for sms with all the actions and reactions of the sms service
 */
@Injectable()
export class SmsService {
    constructor(private readonly twilioService: TwilioService) {}

    /**
     * @function react
     * @description react to the action, each service will have its own react function that will be called when the action is triggered by the user, it will found the reaction name in the area and call the corresponding function
     * @param area
     */
    async react(area: Area) {
        console.log('in react sms');
        if (area.reaction.id.name === "Send SMS") {
            return this.sendSMS(area);
        } else return null;
    }

    /**
     * @description send a sms to the twilio API
     * @param area - the area that contains the data of the sms
     * return {Promise} - the promise of the twilio API
     */
    async sendSMS(area: Area) {
        return await this.twilioService.client.messages.create({
            body: area.reaction.data.message,
            from: "+18482259501",
            to: area.reaction.data.to
        }).then(message => {
            console.log("SUCCESSSSS: ", message);
            return message;
        }).catch(console.error);
    }

    /**
     * @description check if the sms route works
     * @return {Yes SMS route it's working}
     */
    check() {
        return `Yes SMS route it's working`;
    }
}
