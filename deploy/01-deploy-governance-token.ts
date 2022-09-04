import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import verify from "../utils/verify"
import { ethers } from 'hardhat';

const deployGovernanceToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying Governance Token...");

    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1
    });
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying Governance Token Contract....")
        await verify(governanceToken.address, "GovernanceToken", [])
    }
    log(`Need to delegate the tokens to youself in order to vote. Delegating to ${deployer} `);
    await delegate(governanceToken.address, deployer);
    log("Delegated!");
};

// By default, token balance does not account for voting power. 
// This makes transfers cheaper. 
// The downside is that it requires users to delegate to themselves in order to activate checkpoints and have their voting power tracked.
// https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes
const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`);
}
export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governor"];