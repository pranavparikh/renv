module.exports = {
  // Return undefined if a canonical git URL can't be determined.
  // Return the canonical git URL if this is a git project and git is installed.
  // Always return canonical git URL in git@ (ssh) style format
  // Note: This method should always be safe to call even if git isn't installed.
  get canonicalURL() {
    var result;
    try {
      result = require("child_process").execSync("git config --get remote.origin.url").toString().trim();
    } catch (childProcessException) {
      // result will be undefined.
    }

    // convert: https://githubhost/orgname/reponame.git
    // into: git@githubhost:orgname/reponame.git

    // if we don't have an ssh-style URL, convert it
    if (result.indexOf("git") !== 0) {
      const suffix = result.split("://")[1]; 
      const host = suffix.split("/")[0];
      const path = suffix.substring(suffix.indexOf("/") + 1);
      const orgname = path.split("/")[0];
      const repoSuffix = path.split("/")[1];
      result = `git@${host}:${orgname}/${repoSuffix}`;
    }

    return result;
  } 
};
