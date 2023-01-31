import { Body, forwardRef, Inject, Injectable, Request } from '@nestjs/common';
const { Octokit } = require('octokit');
import {
    IRepo,
    INewRepoOrg,
    INewRepo,
    IUpdateRepo,
    IDeleteRepo,
    IUpdateRepoOrg, IDeleteRepoOrg
} from './interface/repos.interface'
import { ActionService } from 'src/action/action.service';
import { ConfigService } from '@nestjs/config';
import { AreaService } from 'src/area/area.service';
import { UserService } from 'src/user/user.service';
import { AreaHandlerService } from 'src/area-handler/area-handler.service';

require('dotenv').config()

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

/**
 * Service for github
 * @category Github
 * @class GithubService
 * @description the Service for github with all the actions and reactions of the github service
 */
@Injectable()
export class GithubService {
    constructor (
        private config: ConfigService,
        @Inject(forwardRef(() => AreaService)) private areaService : AreaService,
        @Inject(forwardRef(() => UserService)) private userService : UserService,
        private handlerService : AreaHandlerService,
        private actionService : ActionService
    ) {}

    /**
     * @description make sure that the github route work fine
     * @return "Hello GitHub!"
     */
    getHello(): string {
      return 'Hello Github!';
    }

    /**
     * @description list all organisation
     * @return {Promise<any>} the list of all organisation
     */
    async listOrgs(): Promise<any> {
        try {
            const resp = await octokit.request('GET /user/orgs');
            return (resp);
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description list all repositories
     * @return {Promise<any>} the list of all repositories
     * @example
     * {
     * "id": 1296269,
     * "name": "HaloufRepository",
     * "full_name": "ciro-di-marzio",
     * "url" : "https://api.github.com/repos/ciro-di-marzio/HaloufRepository",
     * "description": "this is a description of the repository",
     * "created_at": "2011-01-26T19:01:12Z",
     * "updated_at": "2011-01-26T19:14:43Z",
     */
    async listAllRepo(): Promise<IRepo[]> {
        try {
            const resp = await octokit.request('GET /user/repos');
            const repos: IRepo[] = [];
            resp.data.forEach((repo: IRepo) => {
                repos.push({
                    id: repo.id,
                    name: repo.name,
                    full_name: repo.full_name,
                    url: repo.url,
                    description: repo.description,
                    created_at: repo.created_at,
                    updated_at: repo.updated_at,
                });
            });
            return repos;
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description create a repository
     * @param {INewRepo} body the body of the request
     * @return {Promise<any>} the status of the request
     */
    async createRepo(@Body() body: INewRepo): Promise<any> {
        try {
            const resp = await octokit.request('POST ' + '/user/repos', body);
            return (resp);
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description update a repository
     * @param {IUpdateRepo} body the body of the request
     * @return {Promise<any>} the status of the request
     */
    async updateRepo(@Body() body: IUpdateRepo): Promise<any> {
        try {
            const path = '/repos/' + body.owner + '/' + body.repo;
            const resp = await octokit.request('PATCH ' + path, body);
            return (resp);
        } catch (error) {
            return (error);
        }

    }

    /**
     * @description delete a repository
     * @param {IDeleteRepo} body the body of the request
     * @return {Promise<any>} the status of the request
     */
    async deleteRepo(@Body() body: IDeleteRepo): Promise<any> {
        try {
            const path = '/repos/' + body.owner + '/' + body.repo;
            const resp = await octokit.request('DELETE ' + path, body);
            return (resp);
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description create repository in an organisation
     * @param {INewRepoOrg} body the body of the request
     * @return {Promise<any>} the status of the request
     */
    async createRepoFromOrg(@Body() body: INewRepoOrg): Promise<any> {
        try {
            const path = '/orgs/' + body.org + '/repos';
            const resp = await octokit.request('POST ' + path, body);
            return (resp.status, resp.data);
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description update repository in an organisation
     * @param {IUpdateRepoOrg} body the body of the request
     * @return {Promise<any>} the status of the request
     */
    async updateRepoFromOrg(@Body() body: IUpdateRepoOrg): Promise<any> {
        try {
            const path = '/repos/' + body.org + '/' + body.repo;
            const resp = await octokit.request('PATCH ' + path, body);
            return (resp);
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description delete repository in an organisation
     * @param {IDeleteRepoOrg} body the body of the request
     * @return {Promise<any>} the status of the request
     */
    async deleteRepoFromOrg(@Body() body: IDeleteRepoOrg): Promise<any> {
        try {
            const path = '/repos/' + body.org + '/' + body.name;
            const resp = await octokit.request('DELETE ' + path);
            return (resp);
        } catch (error) {
            return (error);
        }
    }

    /**
     * @description webhook service function redirect, it will call the handleGithubAction member function from the handlerService to handle the action
     * @param req the HookDeck request
     * @return {Promise<any>} the status of the request
     */
    async webhook(@Request() req) {
        this.handlerService.handleGithubAction(req.body);
        return req.body;
    }

    /**
     * @description check the hook url
     * @param hooks
     * @param url
     */
    checkHooksUrl(hooks, url) : boolean {
        for (const hook of hooks) {
            if (hook.config.url === url)
                return false;
        }
        return true;
    }

    /**
     * @description get the Hood ID
     * @param hooks
     * @param url
     */
    getHookId(hooks, url) : number {
        for (const hook of hooks) {
            if (hook.config.url == url)
                return hook.id;
        }
        return -1;
    }

    /**
     * @description add webhook
     * @param area
     */
    async addWebhook(area : any) {
        const user = (await this.userService.findOne(area.owner));
        const action = area.action;
        const octokit_user = new Octokit({
            auth: user.github.token,
        })
        octokit_user.request(`GET /repos/${action.data.owner}/${action.data.repository}/hooks`).then(async (res) => {
            const hooks = res.data;
            if (res.statusCode === 404)
                return {"msg": "Repository not found", "statusCode": 404};
            else if (hooks.length === 0 || this.checkHooksUrl(hooks, this.config.get('GITHUB_WEBHOOK_URL'))) {
                switch ((await this.actionService.findOne(area.action.id)).name) {
                    case "Github Push":
                        this.createWebhook(area, octokit_user, "push");
                        break;
                    case "Github Star":
                        this.createWebhook(area, octokit_user, "star");
                        break;
                    case "Github Unstar":
                        this.createWebhook(area, octokit_user, "star");
                        break;
                    case "Github Fork":
                        this.createWebhook(area, octokit_user, "fork");
                        break;
                    case "Github CreateBranch":
                        this.createWebhook(area, octokit_user, "create");
                        break;
                    case "Github CreateTag":
                        this.createWebhook(area, octokit_user, "create");
                        break;
                    case "Github OpenIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github CloseIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github EditIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github DeleteIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github AssignIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github UnassignIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github PinIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github UnpinIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github LockIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github UnlockIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    case "Github ReopenIssue":
                        this.createWebhook(area, octokit_user, "issues");
                        break;
                    default:
                        break;
                }
            } else {
                switch ((await this.actionService.findOne(area.action.id)).name) {
                    case "Github Push":
                        this.putWebhook(area, octokit_user, "push", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github Star":
                        this.putWebhook(area, octokit_user, "star", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github Unstar":
                        this.putWebhook(area, octokit_user, "star", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github Fork":
                        this.putWebhook(area, octokit_user, "fork", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github CreateBranch":
                        this.putWebhook(area, octokit_user, "create", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github CreateTag":
                        this.putWebhook(area, octokit_user, "create", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github OpenIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github CloseIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github EditIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github DeleteIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github AssignIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github UnassignIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github PinIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github UnpinIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github LockIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github UnlockIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    case "Github ReopenIssue":
                        this.putWebhook(area, octokit_user, "issues", this.getHookId(hooks, this.config.get('GITHUB_WEBHOOK_URL')));
                        break;
                    default:
                        break;
                }
            }
        }).catch((err) => {
            console.log(err);
            return {"msg": "repository not found"}
        })
    }

    /**
     * Create a webhook
     * @param {any} area
     * @param {typeof Octokit} octokit_user
     * @param {string} event
     */
    async createWebhook(area : any, octokit_user : typeof Octokit, event : string) {
        let action = area.action;
        
        await octokit_user.request(`POST /repos/${action.data.owner}/${action.data.repository}/hooks`, {
            owner: action.data.owner,
            repo: action.data.repository,
            name: action.name,
            active: true,
            events: [
              event
            ],
            config: {
              url: this.config.get('GITHUB_WEBHOOK_URL'),
              content_type: 'json',
              insecure_ssl: '1'
            }
          })
    }

    /**
     * Update a webhook
     * @param area
     * @param octokit_user
     * @param event
     * @param hook_id
     */
    async putWebhook(area : any, octokit_user : typeof Octokit, event : string, hook_id : number) {
        let action = area.action;
        
        const gitres = await octokit_user.request(`PATCH /repos/${action.data.owner}/${action.data.repository}/hooks/${hook_id}`, {
            owner: action.data.owner,
            repo: action.data.repository,
            name: action.name,
            active: true,
            add_events: [
              event
            ],
            config: {
              url: this.config.get('GITHUB_WEBHOOK_URL'),
              content_type: 'json',
              insecure_ssl: '1'
            }
          })
    }

}
