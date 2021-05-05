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
        const dbPath = `${process.cwd()}/db/event.db`;
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