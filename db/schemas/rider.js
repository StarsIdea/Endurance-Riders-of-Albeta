const riderSchema = {
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
  
  module.exports = riderSchema;