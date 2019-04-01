const { Command, flags } = require('@oclif/command')
const readlineSync = require('readline-sync')
const puppeteer = require('puppeteer')
const chalk = require('chalk')
const logUpdate = require('log-update')
const fs = require('fs')
const path = require('path')
const os = require('os')

class LoginCommand extends Command {
  async run () {
    const [{ browser, page }, input] = await Promise.all([
      new Promise(
        async (resolve, reject) => {
          const browser = await puppeteer.launch()
          const page = await browser.newPage()
          await page.goto('https://atcoder.jp/login')
          resolve({ browser, page })
        }
      ),
      this.receiveInput()
    ])

    await page.type('input[id="username"]', input.username)
    await page.type('input[id="password"]', input.password)
    const buttonElement = await page.$('button[id=submit]')
    await buttonElement.click()
    await page.waitForNavigation({ timeout: 60000, waitUntil: 'load' })

    clearInterval(input.interval)

    const cookies = await page.cookies()
    const REVEL_SESSION = Array.from(cookies).find(cookie => cookie.name === 'REVEL_SESSION').value

    if (!REVEL_SESSION.includes('SessionKey%3A')) {
      const errorMessage = await page.evaluate(() => document.body.querySelector('div.alert-danger').innerText)
      logUpdate(chalk.red(errorMessage.replace('×', '').trim()))
      browser.close()
      return
    }

    fs.writeFileSync(path.resolve(os.homedir(), '.coderinfo.json'), JSON.stringify({ REVEL_SESSION }))

    logUpdate(chalk.green('Complete login successfully!'))
    browser.close()
  }

  receiveInput () {
    return new Promise(
      async (resolve, reject) => {
        const username = await readlineSync.question('username: ')
        const password = await readlineSync.question('password: ', { hideEchoBack: true })
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        let count = 0
        const interval = setInterval(() => {
          logUpdate(chalk.cyan(`${frames[count++ % frames.length]} Now logging in. Please wait....`))
        }, 80)
        resolve({ username, password, interval })
      }
    )
  }
}

LoginCommand.description = `Describe the command here`

LoginCommand.flags = {
  name: flags.string({ char: 'n', description: 'name to print' })
}

module.exports = LoginCommand
