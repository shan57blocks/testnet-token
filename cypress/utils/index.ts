import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { ethers } from 'ethers'

export const THREE_SECONDS = 3 * 1000
export const FIVE_SECONDS = 5 * 1000
export const TEN_SECONDS = 10 * 1000
export const TWENTY_SECONDS = 20 * 1000
export const ONE_MINUTE = 60 * 1000
export const TWO_MINUTES = 120 * 1000
export const INVOICE_AMOUNT = 100
export const INVOICE_FACTORED_AMOUNT = 80
export const INVOICE_FEES = 8

const chain = { name: 'Mumbai', chainId: 80001 }
const infuraKey = Cypress.env('E2E_TEST_INFURA_GOERLI')
export const provider = new JsonRpcProvider(infuraKey, chain)

export const privateKeyForTx = Cypress.env('E2E_TEST_PRIVATE_KEY')
export const addressForTx = new Wallet(privateKeyForTx).address
export const signerForTx = new Wallet(privateKeyForTx, provider)

const wallet = ethers.Wallet.createRandom()
export const addressForApprove = wallet.address
export const signerForApprove = new Wallet(wallet.privateKey, provider)

export const toNumber = (text: string) => {
  return Number(text.replace('$', '').replace(',', '').replace('%', ''))
}
