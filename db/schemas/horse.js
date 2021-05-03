const horseSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      id: {
        type: 'number',
        default: 0
      }
    },
  };
  
  module.exports = horseSchema;