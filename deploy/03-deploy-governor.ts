import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { developmentChains, networkConfig, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } from '../helper-hardhat-config';
import { ethers, network } from 'hardhat';
import verify from '../utils/verify';

const governorDeploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Governor....");
    const governanceToken = await ethers.getContract("GovernanceToken");
    const timeLock = await ethers.getContract("TimeLock");

    const args = [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE];
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governorContract.address, "GovernorContract", args);
    }
};
export default governorDeploy;