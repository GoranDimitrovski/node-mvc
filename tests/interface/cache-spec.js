var di = require('../../');
describe('interface/cache', function () {
    var Interface, loadedNames = [], Type = di.load('typejs');
    beforeEach(function () {
        Interface = di.mock('interface/cache', {
            typejs: Type,
            core: di.load('core'),
            error: di.load('error'),
            "core/component": {
                get: function (name) {
                    loadedNames.push(name);
                }
            }
        });
        loadedNames = [];
    });


    it('should be inherited', function () {
        var config = {};
        var Cache = Interface.inherit({}, {
            set: n,
            get: n,
            remove: n
        });
        var message = tryCatch(function () {
            return new Cache(config);
        });
        expect(message instanceof Cache).toBe(true);
        expect(message.ttl).toBe(1000 * 60 * 60);

        expect(message.config).toBe(config);
        expect(Type.isObject(message.cache)).toBe(true);
        expect(loadedNames.length).toBe(2);

        expect(loadedNames.shift()).toBe('core/logger');
        expect(loadedNames.shift()).toBe('core/logger');
    });


    createMethodTest('set', {});
    createMethodTest('get', {
        set: n
    });
    createMethodTest('remove', {
        set: n,
        get: n
    });


    function createMethodTest(method, extend, callback) {
        it('should have ' + method + ' method', function () {

            var Cache = Interface.inherit({}, extend);

            var message = tryCatch(function () {
                return new Cache();
            });
            if (typeof callback === 'function') {
                callback(message);
            }
            expect(message.data.method).toBe(method);
            expect(message.customMessage).toBe('CacheInterface: missing method in cache object');
        });
    }

    function tryCatch(callback) {
        try {
            return callback();
        } catch (e) {
            return e;
        }
    }

    function n() {
    }
});
