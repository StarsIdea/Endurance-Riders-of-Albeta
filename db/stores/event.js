const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const eventSchema = require('../schemas/event');

class EventStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(eventSchema);
        const dbPath = `${process.cwd()}/event.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }

    validate(data) {
        return this.schemaValidator(data);
    }

    create(data) {
        const isValid = this.validate(data);
        if (isValid) {
            return this.db.insert(data);
        }
    }

    addRace(event_id, data) {
        return this.db.update({ '_id': event_id}, { $addToSet: {race: data}});
    };

    updateRace(event_id, id, data){
        return this.db.update({ _id: event_id}, {$set: {'race.1': data}});
    }

    deleteRace(event_id, race_id, data) {
        return this.db.update({ _id: event_id}, {$pull: {race: {'_id': race_id}}});
    }

    delete(id) {
        return this.db.remove({'_id': id});
    }

    read(_id) {
        return this.db.findOne({_id}).exec()
    }

    readAll() {
        return this.db.find()
    }

}

module.exports = new EventStore();