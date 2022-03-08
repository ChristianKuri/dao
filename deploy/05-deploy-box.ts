import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log('Deploying Box...')

  const box = await deploy('Box', {
    from: deployer,
    args: [],
    log: true,
  })

  const timeLockContract = await ethers.getContract('TimeLock')
  const boxContract = await ethers.getContractAt('Box', box.address)

  const transferOwnerTx = await boxContract.transferOwnership(
    timeLockContract.address,
  )
  await transferOwnerTx.wait(1)
  log(
    `Box owner transferred to ${timeLockContract.address} (TimeLock contract address)`,
  )
}

export default deployBox
