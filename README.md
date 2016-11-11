# renv

Mix environment variables into the current `bash` context from a remote location without `source` or creating a subshell.

# Quick Start:

First, store a JSON file with named environments you want to use somewhere on a web server:

```json
{
  "local": {
    "SOMEVAR1": "123_local",
    "SOMEVAR2": "lighthearted local banana",
    "SOMEVAR3": "hello world"
  },
  "production": {
    "SOMEVAR1": "123_prod",
    "SOMEVAR2": "serious production banana",
    "SOMEVAR3": "hello serious production world"
  }
}
```

For this example, we'll assume the above JSON file has been uploaded to `https://example.com/env.json`.

Next, install `renv` and import your environment using `eval`:

```shell
> npm install testarmada-renv

...

> eval $(./node_modules/.bin/renv https://example.com/env.json local)

Setting environment local from https://example.com/env.json
Setting SOMEVAR1
Setting SOMEVAR2
Setting SOMEVAR3
Done

> echo $SOMEVAR2

lighthearted local banana

```

# Common Inherited Variables

If you want multiple named environments to inherit from a single common environment, add a named environment called `_` to your JSON file:

```json
{
  "_": {
    "COMMONVAR": "inherited by all other named environments"
  },
  "local": {
    "SOMEVAR1": "123_local",
    "SOMEVAR2": "lighthearted local banana",
    "SOMEVAR3": "hello world"
  },
  "production": {
    "SOMEVAR1": "123_prod",
    "SOMEVAR2": "serious production banana",
    "SOMEVAR3": "hello serious production world"
  }
}
```

In the above example, using `local` or `production` will inherit `COMMONVAR` from the `_` environment. Variables that appear both in named environments and the common environments will have their values overridden by the value in the named environment.

# Programmatic Usage

`renv` can also be used programmatically. If you want to fetch an environment in JS code, simply include `renv` as a module and call `getEnv()`, like this:

```javascript
var renv = require("../lib/renv");
renv.getEnv("https://example.com/env.json", ["myteam", "ci", "master"], function (err, env) {

  if (err) {
    console.error("error!", err);
  } else {
    console.log("got environment:", env);
  }

});
```

# Defining Sub-environments

`renv` supports the notion of sub-environments. This is useful if you want to define environments that define just a few variables but otherwise inherit from a larger bundle of variables.

For example:

```json
{
  "_": {
    "COMMONVAR": "inherited by all other named environments"
  },
  "project1": {
    "THRESHOLD": "0.25",
    "stage": {
      "pr": {
        "TEST_FILTER": "smoke",
        "DASHBOARD_TOKEN": "294875"
      },
      "master": {
        "TEST_FILTER": "regression",
        "DASHBOARD_TOKEN": "586721"
      },
      "deploy": {
        "TEST_FILTER": "live",
        "DASHBOARD_TOKEN": "196132"
      }
    }
  },
  "project2": {
    "THRESHOLD": "0.75",
    "stage": {
      "pr": {
        "TEST_FILTER": "smoke",
        "DASHBOARD_TOKEN": "28931"
      },
      "master": {
        "TEST_FILTER": "regression",
        "DASHBOARD_TOKEN": "139611"        
      },
      "deploy": {
        "TEST_FILTER": "live",
        "DASHBOARD_TOKEN": "689471"
      }
    }
  }
}
```

Using a JSON environment file with the above structure allows you to have:

  * globally-common settings (i.e.: `COMMONVAR`),
  * settings common to projects (i.e.: `THRESHOLD`),
  * and sub-settings to vary (i.e. `TEST_FILTER` and `DASHBOARD_TOKEN`).

`renv` supports sub-environments with a dot notation:

```shell
> eval $(./node_modules/.bin/renv https://example.com/env.json project2.master)
```

The above snippet will yield a set with `COMMONVAR` (from `_`), `THRESHOLD` (from `project2`), as well as `TEST_FILTER` and `DASHBOARD_TOKEN` (from `project2.stage.pr`). 

# Managing Sub-Environments for Multiple Projects  (Git Support)

If you're using `renv` to centrally manage configuration for many different projects, you may be interested in using `renv`'s built in support for detecting canonical git URLs, so that you don't have to invent names for project environments.

For example, if you have the following JSON environment file:

```json
{
  "_": {
    "COMMONVAR": "inherited by all other named environments"
  },
  "git@github.com:MyOrg/myproject.git": {
    "THRESHOLD": "0.75",
    "stage": {
      "pr": {
        "TEST_FILTER": "smoke",
        "DASHBOARD_TOKEN": "28931"
      },
      "master": {
        "TEST_FILTER": "regression",
        "DASHBOARD_TOKEN": "139611"        
      }
    }
  }
}
```

... and you want to spare your CI scripts of having to guess which project environment name to source from, you can call `renv` with a **leading dot syntax**:

```shell
> eval $(./node_modules/.bin/renv https://example.com/env.json .master)
```
 
The above snippet will inherit the common environment (`_`), followed by the project environment (`git@github.com:MyOrg/myproject.git`), followed by the sub-environment (`master`).

# :warning: Security Warning

Note: Remote variable values should only be sourced from machines within a secure and trusted environment. Using public or untrusted sources of environments is **not recommended**. `renv` does not lint or check your values for safety.

## Licenses

All code not otherwise specified is Copyright Wal-Mart Stores, Inc.
Released under the [MIT](./LICENSE) License.
