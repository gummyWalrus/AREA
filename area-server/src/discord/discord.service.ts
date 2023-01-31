import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { DiscordStrategy } from 'src/auth/discord/discord-strategy';
import { ConfigService } from '@nestjs/config';
import { Area } from 'src/area/schemas/area.schema';

const GUILD_TEXT = 0;
const GUILD_CATEGORY = 4;

@Injectable()
export class DiscordService {
    constructor(
        private http : HttpService,
        private discordStrategy : DiscordStrategy,
        private config : ConfigService
        ) {}

    async getChannels(user_id : string) {
        var result = [];
        let accessToken = await this.discordStrategy.refreshAccessToken(user_id);
        return this.http.axiosRef.get('https://discord.com/api/users/@me/guilds',
        { headers: { 'Authorization': 'Bearer ' + accessToken} })
        .then(async (res) => {
            const guilds = res.data;
            var botGuilds = [];
            for (const guild of guilds) {
                const members = await this.http.axiosRef.get(`https://discord.com/api/guilds/${guild.id}/members?limit=1000`,
                { headers: { 'Authorization': 'Bot ' + this.config.get('DISCORD_BOT_TOKEN')} }).then(res => {return res}).catch((err) => {
                    if (err.response.status === 401) {
                        return {data: []};
                    } else return {data: []};
                });
                for (const member of members.data) {
                    if (member.user.bot && member.user.id === this.config.get('DISCORD_BOT_ID')) {
                        botGuilds.push(guild)
                        break;
                    }
                }
            }
            for (const guild of botGuilds) {
                let categories = [];
                let infantChannels = [];
                const channels = await this.http.axiosRef.get(`https://discord.com/api/guilds/${guild.id}/channels`,
                { headers: { 'Authorization': 'Bot ' + this.config.get('DISCORD_BOT_TOKEN') } });
                for (const channel of channels.data) {
                    if (channel.type === GUILD_TEXT && channel.parent_id === channel.guild_id)
                        result.push({name : `${guild.name}#${channel.name}`, value: channel.id})
                    else if (channel.type === GUILD_CATEGORY)
                        categories.push(channel);
                    else if (channel.parent_id !== channel.guild_id)
                        infantChannels.push(channel);
                }
                for (const channel of infantChannels) {
                    for (const category of categories) {
                        if (category.id === channel.parent_id && channel.type === GUILD_TEXT) {
                            result.push({name : `${guild.name}#${category.name}/${channel.name}`, value: channel.id})
                            break;
                        }
                    }
                }
            }
            console.log("table channels ", result)
            return result;
        }).catch(console.error);
    }

    async sendChannelMsg(area: Area, accessToken : string) {
        this.http.axiosRef.post(`https://discord.com/api/channels/${area.reaction.data.channel}/messages`,
        {content: area.reaction.data.message},
        {headers: {Authorization: "Bot " + this.config.get('DISCORD_BOT_TOKEN')}}).catch(console.error)
    }

    async react(area : Area) {
        let accessToken = await this.discordStrategy.refreshAccessToken(area.owner.toString());
        if (area.reaction.id.name === "Discord ChannelMsg")
            this.sendChannelMsg(area, accessToken).catch(console.error);
    }
}
