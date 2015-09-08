
exports.forLib = function (LIB) {
    var ccjson = this;

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var routesByNamespace = {};

            var Entity = function (instanceConfig) {
                var self = this;
                var config = {};
                LIB._.merge(config, defaultConfig);
                LIB._.merge(config, instanceConfig);
                config = ccjson.attachDetachedFunctions(config);

                if (config.namespace) {
                    // Keep record of the route by namespace so we can fetch it later.
                    if (!routesByNamespace[config.namespace]) {
                        routesByNamespace[config.namespace] = [];
                    }
                    routesByNamespace[config.namespace].push(self);

                    self.match = config.match;
                    self.app = config.impl;

                } else
                if (
                    config.routes &&
                    config.routes.namespace
                ) {
                    // Enable fetching of routes for given namespace.
                    self.AspectInstance = function (aspectConfig) {
    
                        return LIB.Promise.resolve({
                            routes: function () {
                                return LIB.Promise.resolve(
                                    ccjson.makeDetachedFunction(
                                        function () {
                                            if (!routesByNamespace[config.routes.namespace]) {
                                                throw new Error("No routes found for namsepace '" + config.routes.namespace + "'");
                                            }
                                            return routesByNamespace[config.routes.namespace];
                                        }
                                    )
                                );
                            }
                        });
                    }
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
