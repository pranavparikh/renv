var request = require("request");
var _ = require("lodash");

module.exports = {
  getEnv: function (environmentLocation, environmentNames, callback) {
    request(environmentLocation, function (error, response, body) {
      if (error) {
        return callback(error);
      } else {
      
        try {
          var environments = JSON.parse(body);
          if (!environments) {
            throw new Error("Body is empty or null");
          }

          if (Object.keys(environments).length === 0) {
            throw new Error("No environments defined");
          }

          if (!environmentNames) {
            environmentNames = [Object.keys(environments)[0]];
          }
          
          var commonEnv = environments._;

          var env = _.extend({}, commonEnv);

          _.forEach(environmentNames, function(environmentName){
            if (!environments.hasOwnProperty(environmentName)) {
              throw new Error("The environment name " + environmentName + " was not found");
            }

            if (!environments[environmentName] || typeof environments[environmentName] !== "object") {
              throw new Error("The environment " + environmentName + " is null, undefined, or not an object");
            }

            env = _.extend({}, env, environments[environmentName]);
          });

          callback(null, env);

        } catch (e) {
          return callback(new Error("Could not parse body"));
        }
      }
    });
  }
};