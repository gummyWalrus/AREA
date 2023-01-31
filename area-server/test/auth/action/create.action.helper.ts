import * as Chance from 'chance';
const chance = new Chance();
const axios = require('axios')

export const generateActionInput = function() {
  return {
    actionInput: {
        name: chance.word(),
        description: chance.sentence(),
        service: "harry potter",
        dataScheme: {
            type: 'object',
            properties: {
                test: {
                    type: 'string',
                    description: 'test'
                }
            }
        }
    }
  };
};