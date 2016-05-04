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

          _.forEach(environmentNames, function (environmentName) {
            var name = environmentName;
            var stage = null;
            if (name.split(".").length > 1) {
              //dealing with reserved `stage` keyword
              name = environmentName.split(".")[0];
              stage = environmentName.split(".")[1];
            }

            if (!environments.hasOwnProperty(name)) {
              throw new Error("The environment name " + name + " was not found");
            }

            if (!environments[name] || typeof environments[name] !== "object") {
              throw new Error("The environment " + name + " is null, undefined, or not an object");
            }

            var temp = environments[name];

            if (stage && temp.stage && temp.stage[stage]) {
              // if `stage` is defined, otherwise we omit it
              // delete reserved keyword `stage`
              temp = _.omit(_.extend({}, temp, temp.stage[stage]), "stage");
            }

            env = _.extend({}, env, temp);
          });

          callback(null, env);

        } catch (e) {
          return callback(new Error("Could not parse body"));
        }
      }
    });
  }
};
