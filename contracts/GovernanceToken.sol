// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000;

    constructor() ERC20("GovernanceToken", "GT")  ERC20Permit("MyToken"){
        _mint(msg.sender, s_maxSupply);
    }

    //overrides required by solidity
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }

}

//Issue with just using a regular ERC20. People could
//just jump in buy lots of token before a hot proposal
//and afterwards dump them