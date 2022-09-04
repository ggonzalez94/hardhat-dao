import { ethers, network } from "hardhat";
import { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, developmentChains, VOTING_DELAY, proposalsFile } from "../helper-hardhat-config"
import { moveBlocksForward } from "../utils/move-blocks"
import * as fs from "fs";

// Generally a proposal will be created with the help of an interface such as Tally or Defender
// But for demo purposes we are creating it programatically
export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");
    //encode the function to call in order to pass it as a proposal to the governor
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
    console.log(`Proposal Description: ${proposalDescription}`)
    const proposalTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );
    const proposeReceipt = await proposalTx.wait(1);
    const proposalId = proposeReceipt.events[0].args.proposalId;
    console.log(`Proposed with proposal ID:\n  ${proposalId}`);

    //Store the proposalId in a json file so that the next script can read it
    storeProposalId(proposalId);

    //If we are on a local blockchain move time forward so that we can go ahead and vote
    if (developmentChains.includes(network.name)) {
        await moveBlocksForward(VOTING_DELAY + 1);
    }
}

function storeProposalId(proposalId: any) {
    const chainId = network.config.chainId!.toString();
    let proposals:any;

    if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    } else {
        proposals = { };
        proposals[chainId] = [];
    }   
    proposals[chainId].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1)
    });


