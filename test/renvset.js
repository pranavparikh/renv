const expect = require("chai").expect;
const RenvSet = require("../lib/renvset");

const PREFIX = "prefix";

describe("RenvSet", () => {

  it("should throw an error if a name with multiple dots is given", () => {
    const badFn = () => new RenvSet(PREFIX, "name.name.name");
    expect(badFn).to.throw(Error);
  });

  it("should throw an error if a prefix only has whitespace or is empty", () => {
    const badFnWhitespace = () => new RenvSet(" ", ".name");
    const badFnEmpty = () => new RenvSet("", ".name");
    expect(badFnWhitespace).to.throw(Error);
    expect(badFnEmpty).to.throw(Error);
  });

  describe("With a supplied prefix", () => {

    it("should set a supplied prefix if name has a leading dot, and to set a undotted name", () => {
      const rs = new RenvSet(PREFIX, ".name");
      expect(rs.prefix).to.equal(PREFIX);
      expect(rs.name).to.equal("name");
    });

    it("should preserve a different prefix if name is in ppppp.nnnnn form", () => {
      const rs = new RenvSet(PREFIX, "otherprefix.name");
      expect(rs.prefix).to.equal("otherprefix");
      expect(rs.name).to.equal("name");
    });

    it("should set a supplied prefix if the set name is a dot", () => {
      const rs = new RenvSet(PREFIX, ".");
      expect(rs.prefix).to.equal(PREFIX);
      expect(rs.name).to.equal(".");
    });

    it("should NOT set a supplied prefix if dot notation isn't used", () => {
      const rs = new RenvSet(PREFIX, "name");
      expect(rs.prefix).to.equal(null);
      expect(rs.name).to.equal("name");
    });

  });

  describe("Without a supplied prefix", () => {

    it("should throw an error if a leading dot is used without a supplied prefix", () => {
      const badFn = () => new RenvSet(null, ".name");  
      expect(badFn).to.throw(Error);
    });

    it("should set a prefix if name is in ppppp.nnnnn form", () => {
      const rs = new RenvSet(PREFIX, "otherprefix.name");
      expect(rs.prefix).to.equal("otherprefix");
      expect(rs.name).to.equal("name");
    });

    it("should set NO prefix if no prefix is given in the name itself", () => {
      const rs = new RenvSet(null, "name");
      expect(rs.prefix).to.equal(null);
      expect(rs.name).to.equal("name");
    });

    it("should throw an error if no prefix is given in the name itself and the set name is a dot", () => {
      const badFn = () => new RenvSet(null, ".");
      expect(badFn).to.throw(Error);
    });

  });

});