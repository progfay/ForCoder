const {Command, flags} = require('@oclif/command')

class DlCommand extends Command {
  async run() {
    const {flags} = this.parse(DlCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/fms_eraser/Github/ForCoder/src/commands/dl.js`)
  }
}

DlCommand.description = `Describe the command here
...
Extra documentation goes here
`

DlCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = DlCommand
