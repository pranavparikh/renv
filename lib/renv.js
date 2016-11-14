const request = require("request");
const _ = require("lodash");
const RenvSet = require("../lib/renvset");
const fs = require("fs");

const fetchEnv = (environmentLocation, callback) => {
  // Detect an URL. If not an URL, assume we've been given a file path
  if (environmentLocation.indexOf("http:") === 0 || environmentLocation.indexOf("https:") === 0) {
    request(environmentLocation, (error, response, body) => {
      if (error) {
        return callback(error);
      } else {
        return callback(null, body);
      }
    });
  } else {
    try {
      return callback(null, fs.readFileSync(environmentLocation).toString());
    } catch (e) {
      return callback(e);
    }
  }
};

module.exports = {
  getEnv: (environmentLocation, renvSets, callback) => {

    // Preserve handy string API
    renvSets = renvSets.map((maybeRenvSet) => {
      if (_.isString(maybeRenvSet)) {
        return new RenvSet(null, maybeRenvSet);
      } else {
        return maybeRenvSet;
      }
    });

    fetchEnv(environmentLocation, (error, body) => {
      if (error) {
        return callback(error);
      } else {

        try {
          const environments = JSON.parse(body);
          if (!environments) {
            throw new Error("Body is empty or null");
          }

          if (Object.keys(environments).length === 0) {
            throw new Error("No environments defined");
          }

          if (!renvSets) {
            renvSets = [Object.keys(environments)[0]];
          }

          const commonEnv = environments._;

          var env = _.extend({}, commonEnv);

          _.forEach(renvSets, (renvSet) => {
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
              env = _.extend({}, env, temp);

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
