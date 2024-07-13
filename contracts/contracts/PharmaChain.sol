// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract PharmaChain {
    // will check from this agr user ha then authenticate. if not then create a new account wali screen
    // mapping(address => bool) users;

    // main/master manufacturer accounts
    // sub accounts for manufacturers

    enum Role {
        Manufacturer,
        Distributor,
        Provider
    }

    struct User {
        address account;
        Role role;
        bool isSubAccount;
        address masterAccount; // For sub-accounts
    }

    struct Batch {
        uint256 batchId;
        address manufacturer;
        string details;
        bool qualityApproved;
        address distributor;
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;

    uint256 public nextBatchId;

    event UserRegistered(
        address indexed user,
        Role role,
        bool isSubAccount,
        address masterAccount
    );
    event BatchCreated(
        uint256 indexed batchId,
        address indexed manufacturer,
        string details
    );
    event QualityApproved(uint256 indexed batchId, address indexed approver);
    event BatchAssignedToDistributor(
        uint256 indexed batchId,
        address indexed distributor
    );

    modifier onlyManufacturer() {
        require(
            users[msg.sender].role == Role.Manufacturer,
            "Only manufacturers can perform this action"
        );
        _;
    }

    modifier onlyDistributor() {
        require(
            users[msg.sender].role == Role.Distributor,
            "Only distributors can perform this action"
        );
        _;
    }

    function registerUser(
        address _user,
        Role _role,
        bool _isSubAccount,
        address _masterAccount
    ) external {
        require(_user != address(0), "Invalid address");
        if (_isSubAccount) {
            require(
                users[_masterAccount].role == Role.Manufacturer,
                "Master account must be a manufacturer"
            );
        }

        users[_user] = User({
            account: _user,
            role: _role,
            isSubAccount: _isSubAccount,
            masterAccount: _masterAccount
        });

        emit UserRegistered(_user, _role, _isSubAccount, _masterAccount);
    }

    function createBatch(string memory _details) external onlyManufacturer {
        uint256 batchId = nextBatchId++;

        batches[batchId] = Batch({
            batchId: batchId,
            manufacturer: msg.sender,
            details: _details,
            qualityApproved: false,
            distributor: address(0)
        });

        emit BatchCreated(batchId, msg.sender, _details);
    }

    function approveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender ||
                users[msg.sender].masterAccount == batch.manufacturer,
            "Only the manufacturer or sub-accounts can approve quality"
        );

        batch.qualityApproved = true;

        emit QualityApproved(_batchId, msg.sender);
    }

    function assignToDistributor(
        uint256 _batchId,
        address _distributor
    ) external onlyManufacturer {
        require(
            users[_distributor].role == Role.Distributor,
            "Invalid distributor"
        );

        Batch storage batch = batches[_batchId];
        require(batch.qualityApproved, "Batch must be quality approved");

        batch.distributor = _distributor;

        emit BatchAssignedToDistributor(_batchId, _distributor);
    }

    // Add additional functions as necessary for handling providers and consumers
}
