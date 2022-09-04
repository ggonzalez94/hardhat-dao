import { exec } from "child_process";
import { ethers, network } from "hardhat";
import { developmentChains, FUNC, MIN_DELAY, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } from "../helper-hardhat-config";
import { moveBlocksForward } from "../utils/move-blocks";
import { moveTimeForward } from "../utils/move-time";

export async function queueAndExecute(args: any[], functionToCall: string, proposalDescription: string) {

    const box = await ethers.getContract("Box");
    const governor = await ethers.getContract("GovernorContract");
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposalDescription));

    const queueTx = await governor.queue(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await queueTx.wait(1);

    //If we are on a local blockchain move time forward so that we can go ahead and execute
    // Min delay is in seconds so we have to move the evm time forward, not the blocks
    if(developmentChains.includes(network.name)) {
        await moveTimeForward( MIN_DELAY + 1);
        await moveBlocksForward(1);
    }

    console.log("Executing....");
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    );
    await executeTx.wait(1);

    const newValue = await box.retrieve();
    console.log(`New value is ${newValue.toString()}!`);

}


queueAndExecute([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1)
    });