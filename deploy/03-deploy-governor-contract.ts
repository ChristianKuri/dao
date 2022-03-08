import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  VOTING_QUORUM_FRACTION,
} from '../hardhat-config-helper'

const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get('GovernanceToken')
  const timeLock = await get('TimeLock')

  log('Deploying Governor Contract ...')

  const governorContract = await deploy('GovernorContract', {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      VOTING_QUORUM_FRACTION,
    ],
    log: true,
  })
}

export default deployGovernorContract
