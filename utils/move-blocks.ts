import { network } from "hardhat";

export async function moveBlocksForward(amount: number) {
    console.log(`Moving ${amount} blocks forward...`);
    for (let index = 0; index < amount; index++) {
        await network.provider.request(
            {
                method: "evm_mine",
                params: []
            }
        );
    }
}