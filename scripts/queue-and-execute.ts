import { ethers, network } from 'hardhat'
import {
  DEVELOPMENT_CHAINS,
  MIN_DELAY,
  PROPOSAL_DESCRIPTION,
  PROPOSAL_METHOD,
  PROPOSAL_VALUE,
} from '../hardhat-config-helper'
import { moveBlocks } from '../utils/move-blocks'
import { moveTime } from '../utils/move-time'

export async function queueAndExecute() {
  const boxContract = await ethers.getContract('Box')
  const encodedFunctionCall = boxContract.interface.encodeFunctionData(
    PROPOSAL_METHOD,
    [PROPOSAL_VALUE],
  )
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION),
  )

  const governorContract = await ethers.getContract('GovernorContract')

  console.log('Queueing proposal...')
  const queueTx = await governorContract.queue(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash,
  )
  await queueTx.wait(1)

  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)
  }

  console.log('Executing proposal...')
  const executeTx = await governorContract.execute(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    descriptionHash,
  )
  await executeTx.wait(1)

  const boxNewValue = await boxContract.retrieve()
  console.log(`Box value: ${boxNewValue}`)
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
