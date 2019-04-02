const { execSync } = require('child_process')
const fs = require('fs')
const { Command, flags } = require('@oclif/command')
const chalk = require('chalk')
const logUpdate = require('log-update')
const padding = (str, length) => str.padStart(str.length + Math.ceil((length - str.length) * 0.5)).padEnd(length)

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

    let expected = []
    let received = []
    for (const test of tests) {
      console.log()
      logUpdate(`${chalk.black.bgWhite.bold(' RUNS ')} ${test}.in`)

      try {
        expected = await fs.readFileSync(`${test}.out`).toString().trim().split('\n').map(line => line.trim())
        received = await execSync(`cat ${test}.in | python3 ${task}.py`).toString().trim().split('\n').map(line => line.trim())
      } catch (e) {
        logUpdate(`${chalk.white.bgRed.bold(' FAIL ')} ${test}.in`)
        console.error(chalk.red(e))
        console.log()
        continue
      }

      if (expected.toString() === received.toString()) {
        logUpdate(`${chalk.black.bgGreenBright.bold(' PASS ')} test: ${test}.in`)
        console.log()
        continue
      }

      logUpdate(`${chalk.white.bgRed.bold(' FAIL ')} ${test}.in`)

      const { columns } = process.stdout
      const lineCount = Math.max(expected.length, received.length)
      const lineCountWidth = lineCount.toString().length + ((columns - 1) % 2) + 1
      const outputWidth = (columns - lineCountWidth - 7) / 2

      console.log(chalk.black(`─${'─'.repeat(lineCountWidth)}─┬─${'─'.repeat(outputWidth)}─┬─${'─'.repeat(outputWidth)}`))
      console.log(chalk.black(` ${' '.repeat(lineCountWidth)} │ ${chalk.white.bold(padding('Expected', outputWidth))} │ ${chalk.white.bold(padding('Received', outputWidth))}`))
      console.log(chalk.black(`─${'─'.repeat(lineCountWidth)}─┼─${'─'.repeat(outputWidth)}─┼─${'─'.repeat(outputWidth)}`))

      for (let i = 0; i < lineCount; i++) {
        let isFirst = true
        const isCorrect = expected.length > i && received.length > i && expected[i] === received[i]
        const expectedLine = expected.length > i ? expected[i].split(new RegExp(`(.{${outputWidth}})`)).filter(Boolean) : []
        const receivedLine = received.length > i ? received[i].split(new RegExp(`(.{${outputWidth}})`)).filter(Boolean) : []
        const length = Math.max(expectedLine.length, receivedLine.length)
        for (let j = 0; j < length; j++) {
          const _expected = expectedLine.length > j ? expectedLine[j] : ''
          const _received = receivedLine.length > j ? receivedLine[j] : ''
          if (isCorrect) {
            console.log(` ${chalk.black((isFirst ? i + 1 : '').toString().padStart(lineCountWidth))} ${chalk.black('│')} ${_expected.padEnd(outputWidth)} ${chalk.black('│')} ${_received.padEnd(outputWidth)}`)
          } else {
            console.log(` ${chalk.black((isFirst ? i + 1 : '').toString().padStart(lineCountWidth))} ${chalk.black('│')} ${chalk.green(_expected.padEnd(outputWidth))} ${chalk.black('│')} ${chalk.red(_received.padEnd(outputWidth))}`)
          }
          isFirst = false
        }
      }
      console.log(chalk.black(`─${'─'.repeat(lineCountWidth)}─┴─${'─'.repeat(outputWidth)}─┴─${'─'.repeat(outputWidth)}`))
      console.log()
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
