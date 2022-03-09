import {
  DEVELOPMENT_CHAINS,
  PROPOSALS_FILE,
  VOTING_PERIOD,
} from '../hardhat-config-helper'
import * as fs from 'fs'
import { ethers, network } from 'hardhat'
import { moveBlocks } from '../utils/move-blocks'

async function vote(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, 'utf8'))
  const proposalId = proposals[network.config.chainId!][proposalIndex]

  // 0 = Against, 1 = For, 2 = Abstain
  const voteWay = 1
  const governorContract = await ethers.getContract('GovernorContract')
  const voteTx = await governorContract.castVoteWithReason(
    proposalId,
    voteWay,
    'Vote reason',
  )

  await voteTx.wait(1)

  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1)
  }

  console.log(`Voted on proposal ${proposalId} with way ${voteWay}`)
}

const index = 0

vote(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
