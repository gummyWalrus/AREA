import * as Chance from 'chance';
import { Service } from 'src/service/interfaces/service.interface';
const chance = new Chance();

export const generateServiceInput = function() {
  return {
    serviceInput :
    {
        name: chance.string({ length: 8 }),
        logo: chance.string({ length: 8 }),
    }
  };
};