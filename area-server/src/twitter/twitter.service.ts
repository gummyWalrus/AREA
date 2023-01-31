import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateTwitterDto } from "./dto/create-twitter.dto";
import { Area } from 'src/area/schemas/area.schema';
import { Client } from 'twitter-api-sdk';
import { MyTwitterOauthStrategy } from 'src/auth/twitter/mytwitter-oauth.strategy';
import { UserService } from "src/user/user.service";

require('dotenv').config();
const axios = require('axios');

/**
 * Service for twitter
 * @category Twitter
 * @class TwitterService
 * @description the Service for twitter with all the actions and reactions of the twitter service
 */
@Injectable()
export class TwitterService {
    constructor(
        @Inject(forwardRef(() => MyTwitterOauthStrategy)) private readonly twitter : MyTwitterOauthStrategy,
        @Inject(forwardRef(() => UserService)) private readonly user : UserService) {}

    private config = {
        method: "",
        url: 'https://api.twitter.com/2/tweets',
        headers: {
            'Authorization': 'OAuth oauth_consumer_key="30KPngBp7nZkK3fXsdZcroGEw",' +
                '             oauth_token="1573419467941503000-d6hJgmVIjea4pKXDwfXcOzlZpr3Nmt",' +
                '             oauth_signature_method="HMAC-SHA1",' +
                '             oauth_timestamp="1665334080",' +
                '             oauth_nonce="vqOZfFq91As",' +           // oauth nonce was the problem lol
                '             oauth_version="1.0",' +
                '             oauth_signature="9polVgNA%2Fimxv9xrS%2F%2BhUVqKNjw%3D"',
            'Content-Type': 'application/json',
            'Cookie': 'guest_id=v1%3A166400950912792038'
        },
        data : ""
    };

    /**
     * @description creates a tweet
     * @param {Area} area - the area that contains the tweet to create
     * @returns {Promise<any>} - the result of the tweet creation
     */
    async tweet(area: Area) {
        return this.user.findOne(area.owner.toString()).then(async (user) => {
            console.log('twitter refresh token = ', user.twitter.token);
            if (this.twitter.authClient.isAccessTokenExpired()) {
                console.log('access token expired, refreshing...');
                this.twitter.authClient.token = {...this.twitter.authClient.token, refresh_token: user.twitter.token};
                this.twitter.authClient.refreshAccessToken()
                .then((token) => {
                    this.twitter.authClient.token = {...this.twitter.authClient.token, refresh_token: token.token.refresh_token}
                    this.user.update(area.owner.toString(), {twitter: {token : token.token.refresh_token}})
                    let client = new Client(this.twitter.authClient);
                    return client.tweets.createTweet({
                        text: new Date().toISOString() + ' : ' + area.reaction.data.message
                    }).then((res) => {
                        return res;
                    }).catch(console.error);
                }).catch(console.error);
            } else {
                console.log('access token up to date, let us go !');
                let client = new Client(this.twitter.authClient);
                return client.tweets.createTweet({
                    text: new Date().toISOString() + ' : ' + area.reaction.data.message
                }).then((res) => {
                    console.log('twitter response', res);
                    return res;
                }).catch(console.error);
            }
        });
    }

    /**
     * @function react
     * @description react to the action, each service will have its own react function that will be called when the action is triggered by the user, it will found the reaction name in the area and call the corresponding function
     * @param area
     */
    async react(area: Area) {
        console.log('in react twitter')
        if (area.reaction.id.name === "Twitter Tweet") {
            return this.tweet(area)
        } else return null;
    }


    async create(createTwitterDto: CreateTwitterDto) {
        this.config.method = "POST";
        this.config.data = JSON.stringify({"text": createTwitterDto.message});
        const res: Response = await axios(this.config);
        return {message: "well played", status: res.status};
    }

    async remove(id: string) {
        this.config.method = "DELETE";
        this.config.url = this.config.url + "/" + id;
        console.log("url: ", this.config.url);
        const res = axios(this.config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
        return res;
    }
}
