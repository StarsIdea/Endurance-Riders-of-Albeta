const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const tempRiderSchema = require('../schemas/tempRider');

class TempRiderStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(tempRiderSchema);
        const dbPath = `${process.cwd()}/db/tempRider.db`;
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

    exist(data) {
        return this.db.findOne(data).exec();
    }

    // find(search_value) {
    //     return this.db.find({ name : new RegExp(search_value, 'g')});
    // }

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

module.exports = new TempRiderStore();