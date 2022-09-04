import { network } from "hardhat";

export async function moveTimeForward(amount: number) {
    console.log(`Moving time forward by ${amount} seconds`);
    await network.provider.send("evm_increaseTime", [amount]);
}