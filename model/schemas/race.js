const raceSchema = {
    type: 'object',
    properties: {
        distance: {
            type: 'string'
        },
        start_time: {
            type: 'string'
        },
        start_number: {
            type: 'string',
            default: '0'
        },
        // riderNumber: {
        //     type: 'string',
        //     default: '0'
        // },
        hold_time: {
            type: 'string'
        },
        event_id: {
            type: 'string'
        }
    }
}

module.exports = raceSchema;