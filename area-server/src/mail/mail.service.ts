import {HttpCode, HttpStatus, Injectable, Inject, forwardRef} from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import {ConfigService} from "@nestjs/config";
const nodemailer = require('nodemailer');
const MailComposer = require('nodemailer/lib/mail-composer');
import {google} from 'googleapis';
import {GetAccessTokenResponse} from "google-auth-library/build/src/auth/oauth2client";
import { Area } from 'src/area/schemas/area.schema';
import { UserService } from 'src/user/user.service';

/**
 * Service for mail
 * @category Mail
 * @class MailService
 * @description the Service for mail with all the actions and reactions of the mail service
 */
@Injectable()
export class MailService {
    constructor(
        private Config: ConfigService,
        @Inject(forwardRef(() => UserService)) private user: UserService
    ) {}

    /**
     * @description encode the mail in base64
     * @param message
     */
    async encodeMessage (message) {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    /**
     * @function react
     * @description react to the action, each service will have its own react function that will be called when the action is triggered by the user, it will found the reaction name in the area and call the corresponding function
     * @param area
     */
    async react(area: Area) {
        console.log('in react gmail');
        if (area.reaction.id.name === "Gmail Mail") {
            return this.create(area);
        } else return null;
    }

    remove(id: number) {
        return `This action removes a #${id} mail`;
    }

    /**
     * @description create a mail
     * @param {Area} area - the area that contains the data of the mail
     */
    @HttpCode(HttpStatus.CREATED)
    async create(area: Area) {
        const user = await this.user.findOne(area.owner.toString());
        const oAuth2Client = new google.auth.OAuth2(this.Config.get('OAUTH_GOOGLE_ID'),
                                                    this.Config.get('OAUTH_GOOGLE_SECRET'),
                                                    this.Config.get('OAUTH_GOOGLE_REDIRECT_URI'));
    
        oAuth2Client.setCredentials({refresh_token: user.google.token});
    
        const accessToken: GetAccessTokenResponse = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: user.google.email,
                clientId: this.Config.get('OAUTH_GOOGLE_ID'),
                clientSecret: this.Config.get('OAUTH_GOOGLE_SECRET'),
                refreshToken: user.google.token,
                accessToken: accessToken.token
            }
        });
        const mailOptions = {
            from: 'Halouf Mail 📧 <' + user.google.email + '>',
            to: area.reaction.data.email.toString(),
            subject: area.reaction.data.objet,
            text: area.reaction.data.message,
            html: '<p>' + area.reaction.data.message + '</p>'
        };
    
        return await transport.sendMail(mailOptions);
    }
}
