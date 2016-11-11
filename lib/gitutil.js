module.exports = {
  // Return undefined if a canonical git URL can't be determined.
  // Return the canonical git URL if this is a git project and git is installed.
  // Note: This method should always be safe to call even if git isn't installed.
  get canonicalURL() {
    var result;
    try {
      result = require("child_process").execSync("git config --get remote.origin.url").toString().trim();
    } catch (childProcessException) {
      // result will be undefined.
    }
    return result;
  } 
};