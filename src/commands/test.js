const {Command, flags} = require('@oclif/command')

class TestCommand extends Command {
  async run() {
    const {flags} = this.parse(TestCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/fms_eraser/Github/ForCoder/src/commands/test.js`)
  }
}

TestCommand.description = `Describe the command here
...
Extra documentation goes here
`

TestCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = TestCommand
