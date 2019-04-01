const fetch = require('node-fetch')
const chalk = require('chalk')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { Command, flags } = require('@oclif/command')

const PYTHON_TEMPLATE_FILE = `
def solve():
  N = int(input())
  N, M, O = map(int, input().split())
  one_line_arr = [int(i) for i in input().split()]
  multi_line_arr = [int(input()) for i in range(N)]
  return 'ans'

print(solve())
`.trim()

class DlCommand extends Command {
  async run () {
    const { args } = this.parse(DlCommand)

    const { contest } = args
    if (!contest) {
      console.log(chalk.red('Error: Required contest name'))
      console.log('USAGE: coder dl [CONTEST]')
      return
    }

    if (!fs.existsSync(path.resolve(os.homedir(), '.coderinfo.json'))) {
      console.log(chalk.red('Please login before download Contest data.\nPlease run `coder login` to login AtCoder.'))
      process.exit(1)
    }
    this.REVEL_SESSION = JSON.parse(fs.readFileSync(path.resolve(os.homedir(), '.coderinfo.json')).toString()).REVEL_SESSION
    if (!this.REVEL_SESSION) {
      console.log(chalk.red('Please login before download Contest data.\nPlease run `coder login` to login AtCoder.'))
      process.exit(1)
    }

    this.mkdir(`${contest}/.page`)

    fetch(`https://atcoder.jp/contests/${contest}/tasks?lang=ja`, { headers: { cookie: `REVEL_SESSION=${this.REVEL_SESSION}` } })
      .then(async response => {
        if (!response.ok) {
          const html = await response.text()
          const message = new JSDOM(html).window.document.body.querySelector('div.alert-danger').textContent.replace('×', '').trim()
          console.error(chalk.red(message))
          process.exit(1)
        }
        return response
      })
      .then(response => response.text())
      .then(html => new JSDOM(html).window.document.body)
      .then(body => body.querySelectorAll('table.table tbody tr td.text-center.no-break a'))
      .then(Array.from)
      .then(elements => elements.filter(element => element.innerHTML !== '提出'))
      .then(elements => elements.map(({ innerHTML, href }) => ({ href, task: innerHTML })))
      .then(problems => Promise.all([
        ...problems.map(problem => this.generateTemplate(contest, problem)),
        ...problems.map(problem => this.downloadProblem(contest, problem))
      ]))
  }

  generateTemplate (contest, problem) {
    return new Promise(
      (resolve, reject) => {
        this.writeFile(`${contest}/${problem.task}.py`, PYTHON_TEMPLATE_FILE)
          .then(resolve)
          .catch(reject)
      }
    )
  }

  downloadProblem (contest, problem) {
    return new Promise(
      (resolve, reject) => {
        this.mkdir(`${contest}/.test/${problem.task}`)
          .then(async _ => fetch(`https://atcoder.jp${problem.href}`, { headers: { cookie: `REVEL_SESSION=${this.REVEL_SESSION}` } }))
          .then(response => response.text())
          .then(html => new JSDOM(html).window.document.body.querySelector('div#task-statement span.lang>span.lang-ja').innerHTML)
          .then(html => this.writeFile(`${contest}/.page/${problem.task}.html`, html))
          .then(html => new JSDOM(html).window.document.body)
          .then(body => body.querySelectorAll('div.part>section>pre'))
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
