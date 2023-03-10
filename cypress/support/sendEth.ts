import { signerForTx } from './../utils/index'
import { ethers } from 'ethers'

export const sendEth = async (receiverAddress: string) => {
  const tx = {
    to: receiverAddress,
    value: ethers.utils.parseEther('0.001'),
  }
  await signerForTx.sendTransaction(tx)
}
