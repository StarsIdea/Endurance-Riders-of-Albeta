const eventSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      date: {
        type: 'string'
      },
      races: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            distance: {
                type: 'number'
            },
            startTime: {
                type: 'string'
            },
            startNumber: {
                type: 'number',
                default: 0
            },
            riderNumber: {
                type: 'number',
                default: 0
            },
            holdTime: {
                type: 'number'
            },
            riders: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        riderName: {
                            type: 'string'
                        },
                        riderID: {
                            type: 'number'
                        },
                        horseName: {
                            type: 'string'
                        },
                        horseID: {
                            type: 'number'
                        },
                        amountPaid: {
                            type: 'number'
                        },
                        paymentMethod: {
                            type: 'string'
                        },
                        paymentNote: {
                            type: 'string'
                        },
                        category: {
                            type: 'string'
                        },
                        riderNumber: {
                            type: 'number'
                        },
                        pullCode: {
                            type: 'string'
                        },
                        finishTime: {
                            type: 'string'
                        },
                        recoveryScore: {
                            type: 'number'
                        },
                        hydrationScore: {
                            type: 'number'
                        },
                        lesionsScore: {
                            type: 'number'
                        },
                        soundnessScore: {
                            type: 'number'
                        },
                        qualityMovementScore: {
                            type: 'number'
                        },
                        weight: {
                            type: 'number'
                        },
                        rideTime: {
                            type: 'string'
                        },
                        placing: {
                            type: 'number'
                        },
                        bcScore: {
                            type: 'number'
                        },
                        ridePoints: {
                            type: 'number'
                        },
                        bcPoints: {
                            type: 'number'
                        },
                        bcPlacing: {
                            type: 'number'
                        },
                        vetScore: {
                            type: 'number'
                        },
                    }
                }
            }
          }
        }
      }
    }
  };
  
  module.exports = eventSchema;