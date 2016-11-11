const expect = require("chai").expect;
const renv = require("../lib/renv");

const TESTFILE = "./test/test_env.json";

describe("renv", () => {

  describe("From a local JSON file", () => {

    it("should load the common _ set", () => {
      renv.getEnv(TESTFILE, [], (err, env) => {
        expect(env.COMMONVAR1).to.equal("abc123");
      });
    });

  });

});