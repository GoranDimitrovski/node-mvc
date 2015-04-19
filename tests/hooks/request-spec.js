var di = require('../../framework/di');
describe('hooks/request', function () {
    var reqInstance,
        RequestHooks,
        loadedNames = [],
        Type = di.load('typejs'),
        _data,
        logger = {
            info: function () {

            },
            error: function () {

            },
            log: function () {

            },
            warn: function () {

            }
        };

    beforeEach(function () {
        RequestHooks = di.mock('hooks/request', {
            typejs: Type,
            core: di.load('core'),
            error: di.load('error'),
            "interface/requestHooks": di.load('interface/requestHooks'),
            "core/component": {
                get: function (name) {
                    if (name === 'core/logger') {
                        return logger;
                    }
                    loadedNames.push(name);
                }
            }
        });

        _data = null;
        loadedNames = [];


    });

    it('should be function', function () {
        expect(Type.isFunction(RequestHooks)).toBe(true);
    });


    it('set', function () {
        reqInstance = new RequestHooks;
        var regex = /^\/home/;
        var callback = function () {
        };
        reqInstance.set(regex, callback);
        expect(reqInstance.hooks.length).toBe(1);

        var message = tryCatch(function () {
            reqInstance.set(1, 2);
        });

        expect(message.indexOf('RequestHooks.has regex must be regex type') > -1).toBe(true);

        message = tryCatch(function () {
            reqInstance.set(regex, 2);
        });

        expect(message.indexOf('RequestHooks.add hook already exists') > -1).toBe(true);


        message = tryCatch(function () {
            reqInstance.set(/abc/, 2);
        });
        expect(message.indexOf('RequestHooks.add hook value must be function type') > -1).toBe(true);

    });


    it('has', function () {
        reqInstance = new RequestHooks;
        var regex = /^\/home/;
        var callback = function () {
        };
        reqInstance.set(regex, callback);
        expect(reqInstance.hooks.length).toBe(1);
        expect(reqInstance.has(regex)).toBe(true);
        expect(reqInstance.has(/abc/)).toBe(false);

        var message = tryCatch(function () {
            reqInstance.has(1);
        });
        expect(message.indexOf('RequestHooks.has regex must be regex type') > -1).toBe(true);


    });


    it('get', function () {
        reqInstance = new RequestHooks;
        var regex = /^\/home/;
        var callback = function () {
        };
        reqInstance.set(regex, callback);
        var hook = reqInstance.get('/home');
        expect(hook.key).toBe(regex);
        expect(hook.func).toBe(callback);


        var message = tryCatch(function () {
            reqInstance.get(regex);
        });
        expect(message.indexOf('RequestHooks.get value must be string type') > -1).toBe(true);
    });


    it('process', function (done) {
        reqInstance = new RequestHooks;
        var api = {
            parsedUrl: {
                pathname: '/home'
            }
        };
        var regex = /^\/home/;

        var callback = function () {
            return 'HOOK';
        };
        reqInstance.set(regex, callback);
        reqInstance.process(api).then(function (data) {
            expect(data).toBe('HOOK');
            done();
        }).catch(function (error) {
            fail(error);
            done();
        });
    });

    it('process 2', function (done) {
        reqInstance = new RequestHooks;
        var api = {
            parsedUrl: {
                pathname: '/test'
            }
        };
        var regex = /^\/home/;

        var callback = function () {
            return 'HOOK';
        };
        reqInstance.set(regex, callback);
        reqInstance.process(api).then(function (data) {
            expect(data).toBe(false);
            done();
        }).catch(function (error) {
            fail(error);
            done();
        });
    });



    it('process error', function (done) {
        reqInstance = new RequestHooks;
        var api = {
            parsedUrl: {
                pathname: 1
            }
        };
        var regex = /^\/home/;

        var callback = function () {
            return 'HOOK';
        };
        reqInstance.set(regex, callback);
        reqInstance.process(api).then(null, function (data) {
            expect(data.indexOf('Hook error') > -1).toBe(true);
            done();
        }).catch(function (error) {
            fail(error);
            done();
        });
    });


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
