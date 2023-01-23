// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {
    IERC20 public associatedToken;
    uint price;
    address owner;

    constructor(IERC20 _token, uint _price) {
        associatedToken = _token;
        price = _price;
        owner = msg.sender;
    }

    modifier OnlyOwner() {
        require(msg.sender == owner, "You're not the owner of this contract");
        _;
    }

    function sell() external OnlyOwner {
        uint allowance = associatedToken.allowance(msg.sender, address(this));
        require(
            allowance > 0,
            "you must allow this contract access to at least one token"
        );

        bool sent = associatedToken.transferFrom(
            msg.sender,
            address(this),
            allowance
        );
        require(sent, "failed to send token");
    }

    function withdrawTokens() external OnlyOwner {
        uint balance = associatedToken.balanceOf(address(this));
        associatedToken.transfer(msg.sender, balance);
    }

    function withdrawFunds() external OnlyOwner {
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent);
    }

    function getPrice(uint numOfTokens) public view returns (uint) {
        return numOfTokens * price;
    }

    function buy(uint numOfTokens) external payable {
        require(numOfTokens <= getTokenBalance(), "not enough tokens");
        uint priceForTokens = getPrice(numOfTokens);
        require(msg.value == priceForTokens, "invalid value sent");
        associatedToken.transfer(msg.sender, numOfTokens);
    }

    function getTokenBalance() public view returns (uint) {
        return associatedToken.balanceOf(address(this));
    }
}
