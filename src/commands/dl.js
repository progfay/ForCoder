const fetch = require('node-fetch')
const Bluebird = require('bluebird')
fetch.Promise = Bluebird
const chalk = require('chalk')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const { Command, flags } = require('@oclif/command')

class DlCommand extends Command {
  async run () {
    const { args } = this.parse(DlCommand)

    const { contest } = args
    if (!contest) {
      console.log(chalk.red('Error: Required contest name'))
      console.log('USAGE: coder dl [CONTEST]')
      return
    }

    fetch(`https://atcoder.jp/contests/${contest}/tasks?lang=ja`)
      .then(response => response.text())
      .then(html => new JSDOM(html).window.document.body)
      .then(body => body.querySelectorAll('table.table tbody tr td.text-center.no-break a'))
      .then(Array.from)
      .then(elements => elements.filter(element => element.innerHTML !== '提出'))
      .then(elements => elements.map(({ innerHTML, href }) => ({ href, task: innerHTML })))
      .then(problems => Promise.all(problems.map(problem => this.downloadProblem(contest, problem))))
  }

  downloadProblem (contest, problem) {
    return new Promise(
      (resolve, reject) => {
        this.mkdir(`${contest}/.test/${problem.task}`)
          .then(async _ => fetch(`https://atcoder.jp${problem.href}`))
          .then(response => response.text())
          .then(html => new JSDOM(html).window.document.body)
          .then(body => body.querySelectorAll('div#task-statement span.lang>span.lang-ja div.part>section>pre'))
          .then(Array.from)
          .then(elements => elements.filter(element => !element.innerHTML.includes('<var>')))
          .then(elements => elements.map(element => element.innerHTML))
          .then(examples => Promise.all(examples.map((example, index) => (
            this.writeFile(`${contest}/.test/${problem.task}/${Math.floor(index * 0.5) + 1}.${index % 2 === 0 ? 'in' : 'out'}`, example)
          ))))
          .then(() => console.log(`✅ Download Complete: https://atcoder.jp${problem.href}`))
          .then(resolve)
          .catch(reject)
      }
    )
  }

  mkdir (path) {
    return new Promise(
      async (resolve, reject) => {
        if (await fs.existsSync(path)) return resolve()
        fs.mkdir(path, { recursive: true }, resolve)
      }
    )
  }

  writeFile (path, data) {
    return new Promise(
      (resolve, reject) => {
        fs.writeFile(path, data, {}, () => resolve(data))
      }
    )
  }
}

DlCommand.description = 'download test files from AtCoder Contest'

DlCommand.flags = {
  help: flags.help({
    char: 'h',
    description: 'show help of `coder dl`'
  })
}

DlCommand.args = [{ name: 'contest' }]

module.exports = DlCommand
