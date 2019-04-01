const { Command } = require('@oclif/command')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const open = require('open')

class OpenCommand extends Command {
  async run () {
    const { args } = this.parse(OpenCommand)
    const { task } = args
    const filePath = path.resolve(`.page/${task}.html`)
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`Task ${task} is not found.`))
    } else {
      open(`file://${filePath}`)
    }
  }
}

OpenCommand.description = `Open downloaded web page of tasks`

OpenCommand.args = [{ name: 'task' }]

module.exports = OpenCommand
