import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { developmentChains, networkConfig, MIN_DELAY } from '../helper-hardhat-config';
import { network } from 'hardhat';
import verify from '../utils/verify';

const deployTimeLock: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying TimeLock...");
    const args: any [] = [MIN_DELAY, [], []];
    const timeLockContract = await deploy("TimeLock", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying TimeLock contract...");
        await verify(timeLockContract.address, "TimeLock", args)
    }
};
export default deployTimeLock;