const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const riderSchema = require('../schemas/rider');
const raceSchema = require('../schemas/race');

class RiderStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(riderSchema);
        const dbPath = `${process.cwd()}/rider.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });

        this.racedb = Datastore.create({
            filename: `${process.cwd()}/db/race.db`,
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

    findRiderByRace(race_id, search_value = '') {
        return this.db.find({ race_id: race_id, rider_name: new RegExp(search_value, 'g')});
    }

    findRidersByRaces(raceIds) {
        return this.db.find({ race_id : {$in : raceIds }});
    }

    findRiderByEvent(event_id) {
        return this.db.find({ race_id: race_id});
    }

    getMaxRiderNumber(race_id){
        return this.db.find({race_id: race_id}).sort({rider_number: -1}).limit(1);
    }

    update(id, data) {
        return this.db.update({ _id: id}, {$set: data});
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

module.exports = new RiderStore();