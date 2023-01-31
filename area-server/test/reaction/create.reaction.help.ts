import * as Chance from 'chance';
const chance = new Chance();
const axios = require('axios')

export const generateReactionInput = function() {
  return {
    reactionInput: {
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