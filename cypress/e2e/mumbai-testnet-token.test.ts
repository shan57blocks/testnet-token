import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers, Wallet } from 'ethers'

describe('Mint mumbai test token', () => {
  beforeEach(() => cy.visit('/', { timeout: 120000 }))

  it('Mint mumbai testnet token', () => {
    const provider = new JsonRpcProvider(
      Cypress.env('E2E_TEST_INFURA_MUMBAI'),
      { name: 'Mumbai', chainId: 80001 },
    )
    const wallet = ethers.Wallet.createRandom()
    const address = wallet.address
    const signer = new Wallet(wallet.privateKey, provider)
    cy.get('input[type="text"]').type(address)
    cy.wait(2000)
    cy.get('button').contains('Submit').click()
    cy.wait(3000)
    cy.get('button').contains('Confirm').click()
    cy.wait(3 * 60 * 1000 + 5000)
    const tx = {
      to: '0x60758B3A6933192D0Ac28Fc1f675364bb4dFAb1d',
      value: ethers.utils.parseEther('0.199'),
    }
    setTimeout(() => {
      signer.sendTransaction(tx)
    }, 2 * 60 * 1000)
    // cy.wait(9 * 60 * 1000 + 5000)
  })
})
