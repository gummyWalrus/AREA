import {forwardRef, HttpCode, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Area} from "../area/schemas/area.schema";
import {google} from "googleapis";

/**
 * Service for telegram
 * @category Telegram
 * @class TelegramService
 * @description the Service for telegram with all the actions and reactions of the telegram service
 */
@Injectable()
export class CalendarService {
    constructor(
        private Config: ConfigService,
        @Inject(forwardRef(() => UserService)) private user: UserService
    ) {}

    /**
     * @function react
     * @description react to the action, each service will have its own react function that will be called when the action is triggered by the user, it will found the reaction name in the area and call the corresponding function
     * @param area - the area object to react
     */
    async react(area: Area) {
        if (area.reaction.id.name === "Calendar Event") {
            return this.create(area);
        } else return null;
    }

    /**
     * @description it will create a new calendar event
     * @function create
     * @param area - the area object to react
     */
    @HttpCode(HttpStatus.CREATED)
    async create(area: Area) {
        const user = await this.user.findOne(area.owner.toString());

        const oAuth2Client = new google.auth.OAuth2(this.Config.get('OAUTH_GOOGLE_ID'),
            this.Config.get('OAUTH_GOOGLE_SECRET'),
            this.Config.get('OAUTH_GOOGLE_REDIRECT_URI'));

        oAuth2Client.setCredentials({refresh_token: user.google.token});

        const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

        const startDate = new Date(area.reaction.data.startDate);
        const endDate = new Date(area.reaction.data.endDate);

        const event = {
            summary: area.reaction.data.summary,
            location: area.reaction.data.location,
            description: area.reaction.data.description,
            start: {
                dateTime: startDate,
                timeZone: 'Europe/Paris',
            },
            end: {
                dateTime: endDate,
                timeZone: 'Europe/Paris',
            },
            colorId: 1
        }

        calendar.freebusy.query(
            {
                // @ts-ignore
                resource: {
                    timeMin: startDate,
                    timeMax: endDate,
                    timeZone: 'Europe/Paris',
                    items: [{ id: "primary" }]
                }
            },
            (err: Error, res) => {
                if (err) return console.error("Free Busy Query Error: ", err);

                const eventArr = res.data.calendars.primary.busy;

                if (eventArr.length === 0) {
                    return calendar.events.insert(
                    // @ts-ignore
                        { calendarId: "primary", resource: event },
                        err => {
                            if (err) return console.error("Error Creating Calender Event:", err);
                            return console.log("Calendar event successfully created.");
                        }
                    );
                }
            }
        );
    }
}
