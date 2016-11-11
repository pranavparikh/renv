var request = require("request");
var _ = require("lodash");
var RenvSet = require("../lib/renvset");

module.exports = {
  getEnv: function (environmentLocation, renvSets, callback) {
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

          if (!renvSets) {
            renvSets = [Object.keys(environments)[0]];
          }

          var commonEnv = environments._;

          var env = _.extend({}, commonEnv);

          _.forEach(renvSets, function (renvSet) {
            const prefix = renvSet.prefix; 
            const name = renvSet.name;
            var temp;
            var foundEnv;

            // if we were given a prefix, we must look for a set with a stage
            if (prefix) {
              foundEnv = environments[prefix]; 

              if (typeof foundEnv !== "object") {
                throw new Error("The environment " + prefix + " is not a valid object");
              }

              if (typeof foundEnv.stage !== "object") {
                throw new Error("The environment " + prefix + " does not have a stage for "
                  + "sub-environments. Cannot find sub-environment " + name);
              }

              const foundSubEnv = foundEnv.stage[name];

              if (typeof foundSubEnv !== "object") {
                throw new Error("The sub-environment " + name + " is not a valid object");
              }

              temp = _.omit(_.extend({}, foundEnv, foundSubEnv), "stage");
              env = _.extend({}, env, temp);

            } else {

              foundEnv = environments[name]; 

              if (typeof foundEnv !== "object") {
                throw new Error("The environment " + name + " is not a valid object");
              }

              temp = _.omit(_.extend({}, foundEnv), "stage");
              env = _.extend({}, env, foundEnv);

            }
          });

          callback(null, env);

        } catch (e) {
          return callback(new Error("Could not parse body " + e.toString()));
        }
      }
    });
  }
};
