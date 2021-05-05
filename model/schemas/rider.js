const riderSchema = {
    type: 'object',
    properties: {
      rider_name: {
          type: 'string'
      },
      rider_id: {
          type: 'string'
      },
      horse_name: {
          type: 'string'
      },
      horse_id: {
          type: 'string'
      },
      amount_paid: {
          type: 'string'
      },
      payment_method: {
          type: 'string'
      },
      payment_note: {
          type: 'string'
      },
      category: {
          type: 'string'
      },
      rider_number: {
          type: 'string',
          default: '0'
      },
      pull_code: {
          type: 'string'
      },
      finish_time: {
          type: 'string'
      },
      recovery_score: {
          type: 'string'
      },
      hydration_score: {
          type: 'string'
      },
      lesions_score: {
          type: 'string'
      },
      soundness_score: {
          type: 'string'
      },
      quality_of_movement_score: {
          type: 'string'
      },
      weight: {
          type: 'string'
      },
      rideTime: {
          type: 'string'
      },
      placing: {
          type: 'string'
      },
      bcScore: {
          type: 'string'
      },
      ridePoints: {
          type: 'string'
      },
      bcPoints: {
          type: 'string'
      },
      bcPlacing: {
          type: 'string'
      },
      vetScore: {
          type: 'string'
      },
      race_id: {
          type: 'string'
      }
    }
  };
  
  module.exports = riderSchema;