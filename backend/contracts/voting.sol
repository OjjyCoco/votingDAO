// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A simple voting contract
/// @author Mathieu Tudela & Nathan Heckmann
/// @notice You can use this contract to vote for proposals
/// @dev use a stucture for the state and a structure mapping for voters  
contract Voting is Ownable {

    /// the id of the winning proposal
    uint128 public winningProposalID;
    uint128 private currentwinningProposalMaxVotes;
    

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint128 votedProposalId; //optimistion, 39 digits semblent suffisant
    }

    struct Proposal {
        string description;
        uint128 voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    //represents the current status of the vote
    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

    /// @notice impossible to do this action because of current status
    /// @param activeStatus the current Status
    error IncorrectActiveStatusForThisAction(WorkflowStatus activeStatus);  //ok
    /// @notice the voter has already voted
    /// @param voter the address of the voter
    error HasAlreadyVoted(address voter); //ok
    /// @notice the voter is already registered
    /// @param voter the address of the voter
    error VoterIsAlreadyRegistered(address voter); //ok
    /// @notice cant do this action because not a voter
    /// @param userAddress the address of the user
    error NotRegistered(address userAddress); //ok
    /// @notice the proposalId dont exist
    error votedProposalIdDontExist(); //ok
    /// @notice proposal cant be null
    error ProposalIsNull(); //ok

    /// @notice casted when a voter is registered
    event VoterRegistered(address voterAddress); 
    /// @notice casted when the work flow changes
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    /// @notice casted when a proposal is registered
    event ProposalRegistered(uint proposalId);
    /// @notice casted when a voter has voted
    event Voted (address voter, uint proposalId);

    /// @notice create an instance of voting, the owner is the sender
    constructor() Ownable(msg.sender) {    }
    
    /// @notice check if the user is a voter
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, NotRegistered(msg.sender));
        _;
    }

    /// @notice check if current status match with target status
    /// @param _targetStatus the target statut 
    modifier checkStatus(WorkflowStatus _targetStatus) {
        require(workflowStatus == _targetStatus, IncorrectActiveStatusForThisAction(workflowStatus));
        _;
    }

    /// @notice get the props of a determinated voter
    /// @param _addr the voter address
    /// @return Voter structure of the voter [bool isRegistered, bool hasVoted, uint votedProposalId]
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /// @notice get the proposal detail from one id
    /// @param _id the voter address
    /// @return Proposal structure of the proposal [string description, uint voteCount]
    function getOneProposal(uint128 _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /// @notice add one voter, only avaible for owner
    /// @param _addr the voter address to add
    function addVoter(address _addr) external onlyOwner checkStatus((WorkflowStatus.RegisteringVoters)) {
        require(voters[_addr].isRegistered != true, VoterIsAlreadyRegistered(_addr));

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 
    /// @notice delete one voter, only avaible for owner
    /// @param _addr the voter address to delete
    function deleteVoter(address _addr) external onlyOwner checkStatus(WorkflowStatus.RegisteringVoters) {
        require(voters[_addr].isRegistered == true, NotRegistered(_addr));
        voters[_addr].isRegistered = false;
        emit VoterRegistered(_addr);
    }


    /// @notice add one proposal, only avaible for voters
    /// @param _desc the string description of the proposal to add
    function addProposal(string calldata _desc) external onlyVoters checkStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), ProposalIsNull()); 
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        // proposalsArray.push(Proposal(_desc,0));
        emit ProposalRegistered(proposalsArray.length-1);
    }

    /// @notice vote for one proposal, only avaible for voters
    /// @param _id the id the proposal to add vote
    function setVote( uint128 _id) external onlyVoters checkStatus(WorkflowStatus.VotingSessionStarted) {
        require(voters[msg.sender].hasVoted != true, HasAlreadyVoted(msg.sender));
        require(_id < proposalsArray.length, votedProposalIdDontExist()); 

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;

        proposalsArray[_id].voteCount++;
        if (proposalsArray[_id].voteCount > currentwinningProposalMaxVotes)
        {
            winningProposalID = _id;
            currentwinningProposalMaxVotes = proposalsArray[_id].voteCount;
        }

        emit Voted(msg.sender, _id);
    }

    /// @notice start the Proposals Registrations, only avaible for owner
    function startProposalsRegistering() external onlyOwner checkStatus(WorkflowStatus.RegisteringVoters) {
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

   /// @notice end the Proposals Registrations, only avaible for owner
    function endProposalsRegistering() external onlyOwner checkStatus(WorkflowStatus.ProposalsRegistrationStarted) {
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice start the the vote session, only avaible for owner
    function startVotingSession() external onlyOwner checkStatus(WorkflowStatus.ProposalsRegistrationEnded) {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice end the the vote session, only avaible for owner
    function endVotingSession() external onlyOwner checkStatus(WorkflowStatus.VotingSessionStarted) {
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice tally the vote session, only avaible for owner
   function tallyVotes() external onlyOwner checkStatus(WorkflowStatus.VotingSessionEnded) {
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}