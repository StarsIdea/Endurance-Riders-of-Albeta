const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const tempHorseSchema = require('../schemas/tempHorse');

class TempHorseStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(tempHorseSchema);
        const dbPath = `${process.cwd()}/db/tempHorse.db`;
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
            return this.db.insert(data, { upsert: true });
        }
    }

    exist(data) {
        return this.db.findOne(data).exec();
    }
    
    find(search_value) {
        return this.db.find({ $or: [{name : new RegExp(search_value, 'g')}, {id : new RegExp(search_value, 'g')}]});
    }

    findByName(name) {
        return this.db.findOne({ name: name}).exec();
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

module.exports = new TempHorseStore();