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
forcoder/1.0.2 darwin-x64 node-v11.10.0
$ coder --help [COMMAND]
USAGE
  $ coder COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`coder dl [CONTEST]`](#coder-dl-contest)
* [`coder help [COMMAND]`](#coder-help-command)
* [`coder login`](#coder-login)
* [`coder open [TASK]`](#coder-open-task)
* [`coder test [TASK]`](#coder-test-task)

## `coder dl [CONTEST]`

download test files from AtCoder Contest

```
USAGE
  $ coder dl [CONTEST]

OPTIONS
  -h, --help  show help of `coder dl`
```

_See code: [src/commands/dl.js](https://github.com/progfay/forcoder/blob/v1.0.2/src/commands/dl.js)_

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

## `coder login`

Describe the command here

```
USAGE
  $ coder login

OPTIONS
  -n, --name=name  name to print
```

_See code: [src/commands/login.js](https://github.com/progfay/forcoder/blob/v1.0.2/src/commands/login.js)_

## `coder open [TASK]`

Open downloaded web page of tasks

```
USAGE
  $ coder open [TASK]
```

_See code: [src/commands/open.js](https://github.com/progfay/forcoder/blob/v1.0.2/src/commands/open.js)_

## `coder test [TASK]`

check the task submission is pass the tests

```
USAGE
  $ coder test [TASK]

OPTIONS
  -h, --help  show help of `coder test`
```

_See code: [src/commands/test.js](https://github.com/progfay/forcoder/blob/v1.0.2/src/commands/test.js)_
<!-- commandsstop -->
