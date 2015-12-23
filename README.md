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

# :warning: Security Warning

Note: Remote variable values should only be sourced from machines within a secure and trusted environment. Using public or untrusted sources of environments is **not recommended**. `renv` does not lint or check your values for safety.

## Licenses

All code not otherwise specified is Copyright Wal-Mart Stores, Inc.
Released under the [MIT](./LICENSE) License.
