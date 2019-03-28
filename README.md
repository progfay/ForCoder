forcoder
========

CLI for download and run test code of AtCoder Contest

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/forcoder.svg)](https://npmjs.org/package/forcoder)
[![Downloads/week](https://img.shields.io/npm/dw/forcoder.svg)](https://npmjs.org/package/forcoder)
[![License](https://img.shields.io/npm/l/forcoder.svg)](https://github.com/progfay/forcoder/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g forcoder
$ coder COMMAND
running command...
$ coder (-v|--version|version)
forcoder/0.0.0 darwin-x64 node-v11.10.0
$ coder --help [COMMAND]
USAGE
  $ coder COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`coder hello [FILE]`](#coder-hello-file)
* [`coder help [COMMAND]`](#coder-help-command)

## `coder hello [FILE]`

describe the command here

```
USAGE
  $ coder hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ coder hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/progfay/forcoder/blob/v0.0.0/src/commands/hello.ts)_

## `coder help [COMMAND]`

display help for coder

```
USAGE
  $ coder help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
