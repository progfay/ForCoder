const { execSync } = require('child_process')
const fs = require('fs')
const { Command, flags } = require('@oclif/command')
const chalk = require('chalk')

class TestCommand extends Command {
  async run () {
    const { args } = this.parse(TestCommand)

    const { task } = args
    if (!task) {
      console.log(chalk.red('Error: Required task name'))
      console.log('USAGE: coder test [TASK]')
      return
    }

    const files = await this.readdir(`.test/${task}`)
    const tests = await files
      .map(file => file.match(/^(.+)\.in$/))
      .filter(Boolean)
      .map(match => match[1])
      .filter(file => files.includes(`${file}.out`))
      .map(file => `.test/${task}/${file}`)

    console.log(tests)

    for (const test of tests) {
      console.log(execSync(`cat ${test}.in | python3 ${task}.py`).toString())
    }
  }

  readdir (path) {
    return new Promise(
      (resolve, reject) => {
        fs.readdir(path, (error, files) => {
          if (error) return reject(error)
          return resolve(files.filter(file => fs.statSync(`${path}/${file}`).isFile()))
        })
      }
    )
  }
}

TestCommand.description = 'check the task submission is pass the tests'

TestCommand.flags = {
  help: flags.help({
    char: 'h',
    description: 'show help of `coder test`'
  })
}

TestCommand.args = [{ name: 'task' }]

module.exports = TestCommand
