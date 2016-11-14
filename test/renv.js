const expect = require("chai").expect;
const renv = require("../lib/renv");

const TESTFILE = "./test/test_env.json";

describe("renv", () => {

  describe("From a local JSON file", () => {

    describe("Basic API", () => {

      it("should get the common _ environment", () => {
        renv.getEnv(TESTFILE, [], (err, env) => {
          expect(env.COMMONVAR1).to.equal("abc123");
        });
      });

      it("should get a environment with no stage", () => {
        renv.getEnv(TESTFILE, ["project1"], (err, env) => {
          expect(env.COMMONVAR1).to.equal("abc123");
          expect(env.PROJECTVAR1).to.equal("abc123");
          expect(Object.keys(env).length).to.equal(2);
        });
      });

      it("should get a sub-environment", () => {
        renv.getEnv(TESTFILE, ["project1.pr"], (err, env) => {
          expect(env.COMMONVAR1).to.equal("abc123");
          expect(env.PROJECTVAR1).to.equal("abc123");
          expect(env.PROJECTVAR2).to.equal("def456");
          expect(Object.keys(env).length).to.equal(3);
        });
      });

      it("should merge two sub-environments in order", () => {
        renv.getEnv(TESTFILE, ["project1.pr","project1.master"], (err, env) => {
          expect(env.COMMONVAR1).to.equal("abc123");
          expect(env.PROJECTVAR1).to.equal("abc123");
          expect(env.PROJECTVAR2).to.equal("ghi789");
          expect(env.PROJECTVAR3).to.equal("jkl012");
          expect(Object.keys(env).length).to.equal(4);
        });
      });

    });

    describe("parse() API", () => {
      it("should produce the same results as the Basic API", () => {
        renv.getEnv(TESTFILE, renv.parse("project1.pr,project1.master"), (err, env) => {
          expect(env.COMMONVAR1).to.equal("abc123");
          expect(env.PROJECTVAR1).to.equal("abc123");
          expect(env.PROJECTVAR2).to.equal("ghi789");
          expect(env.PROJECTVAR3).to.equal("jkl012");
          expect(Object.keys(env).length).to.equal(4);
        });
      });

      it("should detect the git project", () => {
        renv.getEnv(TESTFILE, renv.parse(".master"), (err, env) => {
          expect(env.COMMONVAR1).to.equal("abc123");
          expect(env.PROJECTVAR1).to.equal("xyz999");
          expect(env.PROJECTVAR2).to.equal("yyy999");
          expect(env.PROJECTVAR3).to.equal("zzz111");
          expect(Object.keys(env).length).to.equal(4);
        });
      });

    });

  });

});