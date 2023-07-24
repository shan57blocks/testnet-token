const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { executablePath } = require('puppeteer')
const { JsonRpcProvider } = require('@ethersproject/providers')
const { ethers, Wallet } = require('ethers')
const delay = require('delay')

puppeteer.use(StealthPlugin())

const getMaticFaucets = async () => {
  let failTimes = 0
  for (let i = 0; i < 10000; i++) {
    if (i !== 0) {
      const tenMinutes = 10 * 60 * 1000
      const delayTime = tenMinutes * (failTimes + 1)
      console.log(`Delay time: ${10 * (failTimes + 1)} minutes`)
      await delay(delayTime)
    }
    try {
      console.log('Start', i)
      const provider = new JsonRpcProvider(
        'https://polygon-mumbai.g.alchemy.com/v2/y0BCzLqxtgsrbWoe2pF_1nvzaYQCylhE',
        {
          name: 'Mumbai',
          chainId: 80001,
        },
      )
      const wallet = ethers.Wallet.createRandom()
      const { address } = wallet
      const signer = new Wallet(wallet.privateKey, provider)

      const browser = await puppeteer.launch({
        headless: false,
        executablePath: executablePath(),
      })
      const page = await browser.newPage()
      console.log(`address: ${address}`, i)

      try {
        await page.setUserAgent(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        )
        await page.goto('https://faucet.polygon.technology/', {
          waitUntil: 'networkidle0',
        })
        const addressInputSelector =
          '#app > div > div > div.index > div > div > div > div > div:nth-child(6) > div > div.d-flex.flex-column > div > input[type=text]'
        await page.waitForSelector(addressInputSelector)
        await page.type(addressInputSelector, address)

        await delay(5000)

        const submitButtonSelector =
          '#app > div > div > div.index > div > div > div > div > div:nth-child(7) > div > div > button'
        await page.click(submitButtonSelector)

        await delay(5000)

        const promptConfirmBtnSelector =
          '#app > div > div > div.index > div > div > div.section.position-absolute > div.modal.show > div > div > div:nth-child(2) > div.ps-t-12 > div > button'
        await page.click(promptConfirmBtnSelector)

        for (let k = 0; k < 30; k++) {
          await delay(2000)
          const balance = await provider.getBalance(address)
          console.log(
            `Checking token balance ${k}: ${ethers.utils.formatUnits(
              balance,
              18,
            )}`,
          )
          if (balance.gt(0)) {
            console.log('Sending token', i)
            const tx = {
              to: '0x60758B3A6933192D0Ac28Fc1f675364bb4dFAb1d',
              value: ethers.utils.parseEther('0.199'),
            }
            await signer.sendTransaction(tx)
            console.log('Sent token', i)
            failTimes = 0
            break
          }
          if (k === 29) {
            failTimes += 1
          }
        }
      } catch (error) {
        console.log(`Failed to get faucet for: ${error}`, i)
      } finally {
        console.log(`Mint end`, i)
        await page.deleteCookie()
        await page.close()
      }
      await browser.close()
    } catch (error) {
      console.log(error)
    }
  }
}

getMaticFaucets()
