import {forwardRef, Inject, Injectable} from '@nestjs/common';
import { Area } from 'src/area/schemas/area.schema';
import { AreaService } from 'src/area/area.service';
import { ActionService } from 'src/action/action.service';
import { TwitterService } from 'src/twitter/twitter.service';
import { ServiceService } from 'src/service/service.service';
import { MailService } from 'src/mail/mail.service';
import {CalendarService} from "../calendar/calendar.service";
import {YoutubeService} from "../youtube/youtube.service";
import {SmsService} from "../sms/sms.service";
import {TelegramService} from "../telegram/telegram.service";
import { DiscordService } from 'src/discord/discord.service';


/**
 * This service is used to handle the reaction of an area
 * It is called by the area service when an area is triggered
 * It will call the corresponding service to handle the reaction
 * @class AreaHandlerService
 */

@Injectable()
export class AreaHandlerService {
    /**
     * This function is used to handle the reaction of an area
     * @param areaService - The area service
     * @param actionService - The action service
     * @param serviceService - The service service
     * @param twitterService - The twitter service
     * @param gmailService - The gmail service
     * @param calendarService - The calendar service
     * @param youtubeService - The youtube service
     * @param smsService - The sms service
     * @param telegramService - The telegram service
     * @param discordService - the discord service
     */
    constructor (
        @Inject(forwardRef(() => AreaService)) private areaService : AreaService,
        private readonly actionService: ActionService,
        @Inject(forwardRef(() => ServiceService)) private readonly serviceService: ServiceService,
        private readonly twitterService: TwitterService,
        private readonly gmailService: MailService,
        private readonly calendarService: CalendarService,
        private readonly youtubeService: YoutubeService,
        private readonly smsService: SmsService,
        private readonly telegramService: TelegramService,
        private readonly discordService: DiscordService) {}

    /**
     * @description private member used to store the all names of the services and the corresponding function to call
     * @example
     * svcReactFunc = [
     *     {name: "Twitter", svcName: "twitterService"},
     *     {name: "Gmail", svcName: "gmailService"},
     *  ]
     *  @type {Array<{name: string, svcName: string}>}
     *  @memberof AreaHandlerService
     *  @readonly
     */

    private readonly svcReactFunc = [
        {
            name: "Twitter",
            svcName: "twitterService"
        },
        {
            name: "Gmail",
            svcName: "gmailService"
        },
        {
            name: "Reddit",
            svcName: "redditService"
        },
        {
            name: "Calendar",
            svcName: "calendarService"
        },
        {
            name: "Youtube",
            svcName: "youtubeService"
        },
        {
            name: "SMS",
            svcName: "smsService"
        },
        {
            name: "Telegram",
            svcName: "telegramService"
        },
        {
            name: "Discord",
            svcName: "discordService"
        }
    ]

    /**
     * actionsCallbacks is an array of object containing the name of the action and the function to call
     * @private
     * @memberof AreaHandlerService
     * @readonly
     * @type {Array<{name: string, func: }>}
     * @example
     */
    private readonly actionsCallbacks =
       [
        {
            name : "Github Push",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.pusher &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github Star",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.starred_at && body.action === 'created' &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github Unstar",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if ((body.starred_at === null || body.starred_at) && body.action === "deleted" &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github Fork",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.forkee &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github CreateBranch",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.ref_type === 'branch' &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github CreateTag",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.ref_type === 'tag' &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github OpenIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'opened' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github CloseIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'closed' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github EditIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'edited' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github DeleteIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'deleted' && (body.issue || body.issue === null) &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github AssignIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'assigned' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github UnassignIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'unassigned' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github PinIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'pinned' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github UnpinIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'unpinned' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github LockIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'locked' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github UnlockIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'unlocked' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        },
        {
            name: "Github ReopenIssue",
            func : this.reactToGithubActions,
            check: function (area, body) {
                if (body.action === 'reopened' && body.issue &&
                    `${area.action.data.owner}/${area.action.data.repository}` === body.repository.full_name) {
                    return true;
                }
                return false;
                // si besoin vérifier des parametres de l'action pour assurer
            }
        }
       ]

    /**
     * @function reactToGithubActions
     * @description function that will check the reaction service name of the area and then will call the corresponding function to react to the event
     * @param area - the area object
     * @param _this - the class instance
     * @type {function(area: Area, _this): void}
     * @return {Promise<any>} the response of the reaction
     */
    async reactToGithubActions(area, _this) {
        for (const service of _this.svcReactFunc) {
            if ((await _this.serviceService.findOneQuick(area.reaction.id.service)).name === service.name) {
                return _this[service.svcName].react(area);
            }
        }
    }

    /**
     * @function handleGithubAction
     * @description handles the GitHub action. It checks if the action of the area is inside the database (Area MongoDB model),
     *                If the action is valid, the function will call the reactToGithubActions function to react to the area action
     * @param body - the body of the request
     * @param _this - the class instance
     * @type {function(body): void}
     * @return {void}
     */
    handleGithubAction(body : object) {
        this.areaService.findAll().then(async (areas : Area[]) => {
            for (const area of areas) {
                console.log(area);
                for (const action of this.actionsCallbacks) {
                    if (area.action.id.name == action.name) {
                        if (action.check(area, body))
                            action.func(area, this);
                        else continue;
                    }
                }
            }
        })
    }

}
