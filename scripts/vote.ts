import * as fs from "fs"
import { network, ethers } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocksForward } from "../utils/move-blocks"

async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  // Get the last proposal for the network
  const proposalId = proposals[network.config.chainId!].at(-1);
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1;
  const reason = "I like this change!";

  await vote(proposalId, voteWay, reason);
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId: string, voteWay: number, reason: string) {
  console.log(`Voting for proposal ${proposalId}`);
  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  console.log(voteTxReceipt.events[0].args.reason);

  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);

  //If on a local chain move time forward so we can queue and execute
  if (developmentChains.includes(network.name)) {
    await moveBlocksForward(VOTING_PERIOD + 1);
    const proposalState = await governor.state(proposalId);
    console.log(`Current Proposal State: ${proposalState}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })