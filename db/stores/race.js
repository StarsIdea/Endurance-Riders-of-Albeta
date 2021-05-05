const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const raceSchema = require('../schemas/race');

class RaceStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(raceSchema);
        const dbPath = `${process.cwd()}/race.db`;
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

    update(id, data) {
        return this.db.update({ _id: id}, {$set: data});
    }

    delete(id) {
        return this.db.remove({'_id': id});
    }

    findRaceByEvent(event_id) {
        return this.db.find({ event_id: event_id});
    }

    read(_id) {
        return this.db.findOne({_id}).exec()
    }

    readAll() {
        return this.db.find()
    }

}

module.exports = new RaceStore();