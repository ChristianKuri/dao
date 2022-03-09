import { ethers, network } from 'hardhat'
import {
  DEVELOPMENT_CHAINS,
  PROPOSALS_FILE,
  PROPOSAL_DESCRIPTION,
  PROPOSAL_METHOD,
  PROPOSAL_VALUE,
  VOTING_DELAY,
} from '../hardhat-config-helper'
import { moveBlocks } from '../utils/move-blocks'
import * as fs from 'fs'

export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string,
) {
  const governorContract = await ethers.getContract('GovernorContract')
  const boxContract = await ethers.getContract('Box')
  const encodedFunctionCall = boxContract.interface.encodeFunctionData(
    functionToCall,
    args,
  )

  console.log(
    `Proposing ${functionToCall} on ${boxContract.address} with args: ${args}`,
  )
  console.log(`Proposal description: \n ${proposalDescription}`)

  const proposeTx = await governorContract.propose(
    [boxContract.address],
    [0],
    [encodedFunctionCall],
    proposalDescription,
  )

  if (DEVELOPMENT_CHAINS.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1)
  }

  const proposeReceipt = await proposeTx.wait(1)

  const proposalId = proposeReceipt.events[0].args.proposalId
  let proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, 'utf8'))
  proposals[network.config.chainId!.toString()].push(proposalId.toString())
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals))
}

propose([PROPOSAL_VALUE], PROPOSAL_METHOD, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
