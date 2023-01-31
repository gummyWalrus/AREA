import * as Chance from 'chance';
import { User } from 'src/user/interfaces/user.interface';
const chance = new Chance();

export const generateUserInput = function() {
  return {
    userInput :
    {
      firstname: chance.first(),
      lastname: chance.last(),
      email: chance.email(),
      password: chance.string({ length: 8 }),
    }
  };
};