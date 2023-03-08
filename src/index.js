const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { executablePath } = require('puppeteer')
const { JsonRpcProvider } = require('@ethersproject/providers')
const { ethers, Wallet } = require('ethers')
const delay = require('delay')

puppeteer.use(StealthPlugin())

const getMaticFaucet = async (order) => {
  const i = order === undefined ? '' : order
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
    headless: true,
    executablePath: executablePath(),
  })
  const page = await browser.newPage()
  console.log(`address: ${address}`, i)
  try {
    await page.goto('https://faucet.polygon.technology/', {
      waitUntil: 'networkidle0',
    })
    const addressInputSelector =
      '#app > div > div > div.index > div > div > div:nth-child(1) > div > div > div > div:nth-child(6) > div > div.d-flex.flex-column > div > input[type=text]'
    await page.waitForSelector(addressInputSelector)
    await page.type(addressInputSelector, address)

    const submitButtonSelector =
      '#app > div > div > div.index > div > div > div:nth-child(1) > div > div > div > div:nth-child(7) > div > div > button'
    await page.click(submitButtonSelector)

    const promptSelector =
      '#app > div > div > div.index > div > div > div:nth-child(1) > div > div.section.position-absolute > div.modal.show > div > div'
    await page.waitForSelector(promptSelector)

    const promptConfirmBtnSelector =
      '#app > div > div > div.index > div > div > div:nth-child(1) > div > div.section.position-absolute > div.modal.show > div > div > div:nth-child(2) > div.ps-t-12 > div > button'
    await page.click(promptConfirmBtnSelector)

    for (let i = 0; i < 30; i++) {
      await delay(2000)
      const balance = await provider.getBalance(address)
      console.log(`Checking token balance ${i}: ${balance.toString()}`)
      if (balance.gt(0)) {
        break
      }
    }
    console.log('Sending token', i)
    const tx = {
      to: '0x60758B3A6933192D0Ac28Fc1f675364bb4dFAb1d',
      value: ethers.utils.parseEther('0.199'),
    }
    await signer.sendTransaction(tx)
    console.log('Sent token', i)
  } catch (error) {
    console.log(`Failed to get faucet for: ${error}`, i)
  } finally {
    console.log(`Mint end`, i)
    await page.deleteCookie()
    await page.close()
  }
  await browser.close()
}

const getMaticFaucets = async () => {
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
  for (let i = 0; i < 1; i++) {
    const oneMinute = 60 * 1000
    const randomDelay = Math.random() * 2 * oneMinute + 5 * oneMinute
    await delay(randomDelay)
    try {
      getMaticFaucet(i)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`)
}

// getMaticFaucet()
getMaticFaucets()
