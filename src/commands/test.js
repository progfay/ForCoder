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

    console.log((await this.readdir(`.test/${task}`)).filter(file => file.match(/^\d+\.((in)|(out))$/)))
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
