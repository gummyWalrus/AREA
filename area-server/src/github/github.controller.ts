import { Body, Controller, Get, Post, Delete, Patch, Request } from '@nestjs/common';
import { GithubService } from './github.service';
import {
    IDeleteRepo,
    IDeleteRepoOrg,
    INewRepo,
    INewRepoOrg,
    IRepo,
    IUpdateRepo,
    IUpdateRepoOrg
} from './interface/repos.interface'

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

    @Get()
    getHello(): string {
      return this.githubService.getHello();
    }

    @Get('orgs')
    async listOrgs(): Promise<any> {
        return this.githubService.listOrgs();
    }

    @Get('repos')
    async listAllRepo(): Promise<IRepo[]> {
        return this.githubService.listAllRepo();
    }

    @Post('repos')
    async createRepo(@Body() body: INewRepo): Promise<any> {
        return this.githubService.createRepo(body);
    }

    @Patch('repos')
    async updateRepo(@Body() body: IUpdateRepo): Promise<any> {
        return this.githubService.updateRepo(body);
    }

    @Delete('repos')
    async deleteRepo(@Body() body: IDeleteRepo): Promise<any> {
        return this.githubService.deleteRepo(body);
    }

    @Post('org/repos')
    async createRepoFromOrg(@Body() body: INewRepoOrg): Promise<any> {
        return this.githubService.createRepoFromOrg(body);
    }

    @Patch('org/repos')
    async updateRepoFromOrg(@Body() body: IUpdateRepoOrg): Promise<any> {
        return this.githubService.updateRepoFromOrg(body);
    }

    @Delete('org/repos')
    async deleteRepoFromOrg(@Body() body: IDeleteRepoOrg): Promise<any> {
        return this.githubService.deleteRepoFromOrg(body);
    }

    @Post("webhook")
    async webhook(@Request() req) {
      return this.githubService.webhook(req);
    }
}
