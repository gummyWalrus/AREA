import { Inject, forwardRef, Injectable, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from "@nestjs/jwt";
import { Response } from 'express';
import { ServiceService } from 'src/service/service.service';
import { User } from 'src/user/schemas/user.schema';

const bcrypt = require('bcryptjs');

const googleServices = ['Gmail', 'Calendar', 'Youtube'];

const nologinServices = ['SMS', 'Telegram'];

/**
 * Service for authentication
 * @category Auth
 * @class AuthService
 * @description this service will be used to authenticate users
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => ServiceService)) private readonly serviceService: ServiceService) {}

  /**
   * @description this function will be used to validate a user and return its credentials
   * @param username - the username of the user
   * @param pass - the password of the user
   * @returns the user if the credentials are correct, null otherwise
   * @memberof AuthService
   * @async
   * @example await this.authService.validateUser('username', 'password');
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const users = await this.userService.findByEmail(username);
    console.table(users);
    if (users.length > 0) {
      let user = users[0];
      if (bcrypt.compareSync(pass, user.password))
          return user;
      else return 401;
    } else return 404;
  }

  /**
   * @description this function will be used to login a user
   * @param user
   */
  async login(user: User) {
    const payload = { email: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  isServiceLoggedIn(user, service) {
      if (
        user[service.name.toLowerCase()]
        && user[service.name.toLowerCase()] != undefined
        && user[service.name.toLowerCase()].token
        && user[service.name.toLowerCase()].token != undefined
        && user[service.name.toLowerCase()].token != "fetching"
      ) {
          return true;
      }
      else if
      (
        googleServices.includes(service.name)
        && user['google']
        && user['google'] != undefined
        && user['google'].token
        && user['google'].token !== undefined
        && user['google'].token !== "fetching"
      ) {
        return true;
      }
      else if (nologinServices.includes(service.name)) {
        return true;
      } else {
        return false;
      }
  }

  async loggedInServices(user) {
    var result = [];
    var services = await this.serviceService.findAll();
    return await this.userService.findOne(user.userId).then((user) => {
      for (const service of services) {
        if (this.isServiceLoggedIn(user, service)) {
          if (googleServices.includes(service.name)) {
            result.push(
              {
                service:
                {
                  name: service.name,
                  logo: service.logo,
                  urlName: 'google'
                },
                loggedIn: true,
                pseudo: user['google'].username
              }
            )
          } else if (!nologinServices.includes(service.name)) {
            result.push(
              {
                service:
                {
                  name: service.name,
                  logo: service.logo,
                  urlName: service.name.toLowerCase()
                },
                loggedIn: true,
                pseudo: user[service.name.toLowerCase()].username
              }
            )
          }
        } else {
          if (googleServices.includes(service.name)) {
            result.push(
              {
                service:
                {
                  name: service.name,
                  logo: service.logo,
                  urlName: 'google'
                },
                loggedIn: false,
                pseudo: undefined
              }
            )
          } else if (!nologinServices.includes(service.name)) {
            result.push(
              {
                service:
                {
                  name: service.name,
                  logo: service.logo,
                  urlName: service.name.toLowerCase()
                },
                loggedIn: false,
                pseudo: undefined
              }
            )
          }
        }
      }
      return result;
    })
  }
}