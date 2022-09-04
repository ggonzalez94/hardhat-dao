import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ZERO_ADDRESS } from '../helper-hardhat-config';
import { ethers } from 'hardhat';

const setupContracts: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("GovernorContract", deployer);

    // get roles constants
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
    const propeserRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();

    const proposalTx = await timeLock.grantRole(propeserRole, governor.address);
    await proposalTx.wait(1);
    const executorTx = await timeLock.grantRole(executorRole, ZERO_ADDRESS); //anyone can execute
    await executorTx.wait(1);
    // after this no one(not even the deployer can do anything without governance)
    const adminTx = await timeLock.revokeRole(adminRole, deployer); 
    await adminTx.wait(1);

};
export default setupContracts;