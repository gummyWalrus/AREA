import { Injectable } from '@nestjs/common';
import { ServiceService } from './service/service.service';

@Injectable()
export class AppService {
  constructor(private readonly service: ServiceService) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async getAboutJson(host : string): Promise<object> {
    let json = {
      client: {
        host: host.substring(7)
      },
      server: {
        current_time: new Date().getTime(),
        services: []
      }
    }
    return await this.service.findAll().then((services) => {
      for (const service of services) {
        let jsonService = {
          name: service.name,
          actions: [],
          reactions: []
        };
        for (const action of service.actions) {
          jsonService.actions.push({
            name: action.name,
            description: action.description
          });
        }
        for (const reaction of service.reactions) {
          jsonService.reactions.push({
            name: reaction.name,
            description: reaction.description
          });
        }
        json.server.services.push(jsonService);
      }
      return json;
    })
  }
}
