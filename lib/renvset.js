function RenvSet (prefix, name) {
  // If prefix is set:
  //   - if `name` has a leading dot, `prefix` is used, and the leading dot is removed.
  //   - if `name` is in the form prefix.name, then the prefix in `name` is used.
  //   - if `name` itself omits a prefix and has no dots, then `prefix` is NOT used.
  // If prefix is not set:
  //   - if `name` itself omits a prefix but *includes* a leading dot ("."), throw an exception.
  //   - if `name` is in the form prefix.name, then the prefix in `name` is used.
  //   - if `name` itself omits a prefix and has no dots, then no prefix is set.

  if (typeof prefix === "string" && prefix.trim() === "") {
    throw new Error("A renv prefix can't be empty or just whitespace.");
  }

  if (name.split(".").length > 2) {
    throw new Error("The name of a renv set can't have multiple dots.");
  }

  this.prefix = null;

  if (prefix) {
    if (name[0] === ".") {
      this.name = name.substr(1);
      this.prefix = prefix;
    } else if (name.indexOf(".") > 0) {
      this.prefix = name.split(".")[0];
      this.name = name.split(".")[1];
    } else {
      this.name = name;
    }
  } else {
    if (name[0] === ".") {
      throw new Error("A set name with a leading dot ('.') was used. Is this a valid git project? Is git installed?"); 
    } else if (name.indexOf(".") > 0) {
      this.prefix = name.split(".")[0];
      this.name = name.split(".")[1];
    } else {
      this.name = name;
    }
  }
};

RenvSet.getSets = (prefix, argString) => {
  const allSets = argString.split(",");

  return allSets.map((setName) => {
    return setName.trim();
  }).map((setName) => {
    return new RenvSet(prefix, setName);
  });
};

module.exports = RenvSet; 