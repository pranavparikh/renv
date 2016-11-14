const expect = require("chai").expect;
const git = require("../lib/gitutil");

describe("gitutil", () => {
  
  it("should return the canonical git URL for renv within the renv project", () => {
    expect(git.canonicalURL).to.equal("git@github.com:TestArmada/renv.git");
  });

});