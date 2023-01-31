import {forwardRef, HttpCode, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Area} from "../area/schemas/area.schema";
import {google} from "googleapis";
import * as fs from "fs";

/**
 * Service for youtube
 * @category Youtube
 * @class YoutubeService
 * @description the Service for youtube with all the actions and reactions of the youtube service
 */
@Injectable()
export class YoutubeService {
    constructor(
        private Config: ConfigService,
        @Inject(forwardRef(() => UserService)) private user: UserService
    ) {}

    private oAuth2Client = new google.auth.OAuth2(this.Config.get('OAUTH_GOOGLE_ID'),
        this.Config.get('OAUTH_GOOGLE_SECRET'),
        this.Config.get('OAUTH_GOOGLE_REDIRECT_URI'));

    parameters(area: Area) {
        return {
            part: 'snippet,status',
            resource: this.video(area),
            media: this.media(),
        }
    }

    private array_video = [
        "BestCryEver.mp4",
        "GOT'EEEEMM!!!!!.mp4",
        "video.mp4",
        "Yeahboy.mp4",
        "GalaxyBrain.mp4",
        "Weliketoparty.mp4",
        "Alotofdamage.mp4",
        "AAAAUUUGHHHH.mp4",
        "AREYOUGONNAFINISHTHATCROISSANT.mp4",
        "Duckspinningtotokyodrift.mp4",
        "funkytownlowquality.mp4",
        "LilGlobglogabgalab.mp4",
        "MiiChannel.mp4",
        "PÚAPIPI.mp4"
    ]

    media() {
        return {
            mimeType: 'video/*',
            body: fs.createReadStream("video/" + this.array_video[Math.floor(Math.random()*this.array_video.length)])
        }
    };

    video(area: Area) {
        return {
            snippet: {
                title: area.reaction.data.title,
                description: area.reaction.data.description,
            },
            status: {
                privacyStatus: area.reaction.data.privacyStatus
            }
        }
    }

    /**
     * @function react
     * @description react to the action, each service will have its own react function that will be called when the action is triggered by the user, it will found the reaction name in the area and call the corresponding function
     * @param area
     */
    async react(area: Area) {
        console.log('in react youtube');
        if (area.reaction.id.name === "Youtube Upload Video") {
            return this.upload(area);
        } else return null;
    }

    /**
     * @description upload a video to youtube
     * @param {Area} area- the area that contains the data of the reaction
     */
    @HttpCode(HttpStatus.CREATED)
    async upload(area: Area) {
        const user = await this.user.findOne(area.owner.toString());

        this.oAuth2Client.setCredentials({refresh_token: user.google.token});

        const youtube = google.youtube({version: 'v3', auth: this.oAuth2Client});

        youtube.videos.insert({
            //@ts-ignore
            part: 'snippet,status',
            resource: this.video(area),
            media: this.media(),
        }, (err: any, data: any) => {
            if (err) return console.log("The API returned an error: ", err);
            console.log("The video was uploaded. data: ", data);
        });
    }
}
