// SPDX-License-Identifier: GPL-3.0
//mouse ballot
//This project was designed to allow mouse to vote on where to steal food today
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MouseBallot is ERC20, Ownable, ERC20Burnable {
    
    event tokensMinted(address indexed owner, uint256 amount, string message);
    event kingCreatPropsal(address indexed owner, uint amount);
    event kingGiveTonken(address indexed owner,uint amount,address to);
    event mouseVote(address mouse,uint weight);
    event winProposalEnd(uint proposalNumber);

    // 提案的类型
    struct Proposal {
        uint number;   // 简称（最长32个字节）
        uint voteCount; // 得票数
    }

    address public kingOfMouse; //鼠王 主持投票

    Proposal[] public proposals;

    constructor() ERC20("MouseVote", "MV") {
        _mint(msg.sender, 100 * 10**decimals());
        kingOfMouse = msg.sender;
        emit tokensMinted(msg.sender, 1000 * 10**decimals(), "Initial supply of tokens minted.");
    }

    //鼠王创建投票队列
    function creatPropsal(uint[] memory _proposals)public onlyOwner{
        require(msg.sender == kingOfMouse,"only kingOfMouse can creat Proposals");
        for(uint i = 0;i < _proposals.length; i++){
            proposals.push(Proposal({
                number:_proposals[i],
                voteCount:0
            }));
        }
        emit kingCreatPropsal(msg.sender, _proposals.length);
    }

    //鼠王分配选票token
    function giveTokenToVote(uint amount,address to) public onlyOwner{
        _transfer(msg.sender, to, amount*10**decimals());
        emit kingGiveTonken(msg.sender, amount, to);
    }

    //投票
    function vote(uint _proposalNumber,uint _weight) public {
        _transfer(msg.sender, kingOfMouse, _weight*10**decimals());
        for(uint i = 0;i < proposals.length;i++ ){
            if(proposals[i].number == _proposalNumber){
                proposals[i].voteCount += _weight;
                break;
            }
        }
        emit mouseVote(msg.sender, _weight);
    }

    //计算最终胜利提案
    function winProposal() public onlyOwner returns(uint){
        uint winIndex = 0;
        for(uint i=0;i<proposals.length;i++){
            if(proposals[i].voteCount > proposals[winIndex].voteCount ){
                winIndex = i;
            }
        }
        emit winProposalEnd(proposals[winIndex].number);
        return proposals[winIndex].number;
    }
}