var di = require('../../');
describe('core/logger', function () {
    var Mongo,
        config = {
            connection: 'mongodb://localhost/testdb',
            options: {

            }
        },
        mongoose = {
            connect: function() { return {
                connection: 'connect'
            }; },
            model: function() { return 'model'; },
            Schema: Schema
        };

    function Schema() {

        return {
            test: 'SCH'
        };
    }
    Schema.Types = {};


    beforeEach(function () {
        Mongo = di.mock('db/mongo',{
            typejs: di.load('typejs'),
            error: di.load('error'),
            core: di.load('core'),
            mongoose: mongoose,
            "core/component": {
                get: function (name) {
                    if (name === 'core/logger') {
                        return {
                            info: function () {
                                //console.log(arguments);
                            }
                        };
                    }
                }
            }
        })
    });

    it('construct', function () {
        var instance = new Mongo(config);
        expect(instance.config.connection).toBe(config.connection);
        expect(instance.config.options).toBe(config.options);
    });

    it('schema', function () {
        var instance = new Mongo(config);
        var ns = instance.schema({}, {});
        expect(ns.test).toBe('SCH');
    });

    it('model', function () {
        var instance = new Mongo(config);
        var ns = instance.model({}, {});
        expect(ns).toBe('model');
    });


    it('schema 2', function () {
        var instance = new Mongo(config);
        var ns = instance.schema({});
        expect(ns.test).toBe('SCH');
    });


    it('schema 2 error', function () {
        var instance = new Mongo(config);
        var message = tryCatch(function() {
            instance.schema({}, 1);
        });
        expect(message.indexOf('Schema options must be object') > -1).toBe(true);


        message = tryCatch(function() {
            instance.schema(1);
        });
        expect(message.indexOf('Schema definition must be object') > -1).toBe(true);
    });


    function tryCatch(callback) {
        try {
            return callback();
        } catch (e) {
            return e;
        }
    }
});
