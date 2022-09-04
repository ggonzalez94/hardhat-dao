import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { developmentChains, networkConfig, MIN_DELAY } from '../helper-hardhat-config';
import { ethers, network } from 'hardhat';
import verify from '../utils/verify';

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Box...");
    const args: any [] = [];
    const box = await deploy("Box", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1
    });
    const timeLock = await ethers.getContract("TimeLock");
    const boxContract = await ethers.getContract("Box");
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
    await transferOwnerTx.wait(1);
    log("YOU DONE IT!!");

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying Box contract...");
        await verify(box.address, "Box", args)
    }
};
export default deployBox;