// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract PharmaChain {
    address public owner;

    enum Role {
        Manufacturer,
        Distributor,
        Provider
    }
    enum DistributionType {
        InHouse,
        ThirdParty
    }

    struct User {
        address account;
        Role role;
        bool isSubAccount;
        address masterAccount; // For sub-accounts
        DistributionType distributionType; // Type of distribution
    }

    struct Batch {
        uint256 batchId;
        address manufacturer;
        string details;
        bool qualityApproved;
        address distributor;
        address provider;
        bytes32 rfidUIDHash;
        bool isRecalled;
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;

    uint256 public nextBatchId;

    event UserRegistered(
        address indexed user,
        Role role,
        bool isSubAccount,
        address masterAccount,
        DistributionType distributionType
    );
    event BatchCreated(
        uint256 indexed batchId,
        address indexed manufacturer,
        string details,
        bytes32 rfidUIDHash
    );
    event QualityApproved(uint256 indexed batchId, address indexed approver);
    event QualityDisapproved(
        uint256 indexed batchId,
        address indexed disapprover
    );
    event BatchRecalled(uint256 indexed batchId, address indexed initiator);
    event BatchAssignedToDistributor(
        uint256 indexed batchId,
        address indexed distributor
    );
    event BatchAssignedToProvider(
        uint256 indexed batchId,
        address indexed provider
    );
    event RFIDVerified(
        uint256 indexed batchId,
        address verifier,
        bool verified
    );
    event BatchOrdered(
        address indexed distributor,
        address indexed manufacturer,
        string details
    );
    event MedicineOrdered(
        address indexed provider,
        address indexed distributor,
        string details
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

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

    modifier onlyProvider() {
        require(
            users[msg.sender].role == Role.Provider,
            "Only providers can perform this action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser(
        address _user,
        Role _role,
        bool _isSubAccount,
        address _masterAccount,
        DistributionType _distributionType
    ) external onlyOwner {
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
            masterAccount: _masterAccount,
            distributionType: _distributionType
        });

        emit UserRegistered(
            _user,
            _role,
            _isSubAccount,
            _masterAccount,
            _distributionType
        );
    }

    function createBatch(
        string memory _details,
        bytes32 _rfidUIDHash
    ) external onlyManufacturer {
        uint256 batchId = nextBatchId++;

        batches[batchId] = Batch({
            batchId: batchId,
            manufacturer: msg.sender,
            details: _details,
            qualityApproved: false,
            distributor: address(0),
            provider: address(0),
            rfidUIDHash: _rfidUIDHash,
            isRecalled: false
        });

        emit BatchCreated(batchId, msg.sender, _details, _rfidUIDHash);
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

    function disapproveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender ||
                users[msg.sender].masterAccount == batch.manufacturer,
            "Only the manufacturer or sub-accounts can disapprove quality"
        );

        batch.qualityApproved = false;

        emit QualityDisapproved(_batchId, msg.sender);
    }

    function recallBatch(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender ||
                users[msg.sender].masterAccount == batch.manufacturer,
            "Only the manufacturer or sub-accounts can recall the batch"
        );

        batch.isRecalled = true;

        emit BatchRecalled(_batchId, msg.sender);
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

    function assignInHouseDistributor(
        uint256 _batchId,
        address _distributor
    ) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(batch.qualityApproved, "Batch must be quality approved");
        require(
            users[_distributor].role == Role.Manufacturer &&
                users[_distributor].distributionType ==
                DistributionType.InHouse,
            "Invalid in-house distributor"
        );

        batch.distributor = _distributor;

        emit BatchAssignedToDistributor(_batchId, _distributor);
    }

    function assignToProvider(
        uint256 _batchId,
        address _provider
    ) external onlyDistributor {
        require(users[_provider].role == Role.Provider, "Invalid provider");

        Batch storage batch = batches[_batchId];
        require(
            batch.distributor == msg.sender,
            "Only assigned distributor can assign to provider"
        );

        batch.provider = _provider;

        emit BatchAssignedToProvider(_batchId, _provider);
    }

    function verifyRFID(uint256 _batchId, bytes32 _rfidUIDHash) external {
        Batch storage batch = batches[_batchId];
        bool verified = (batch.rfidUIDHash == _rfidUIDHash);

        emit RFIDVerified(_batchId, msg.sender, verified);
    }

    function scanRFID(uint256 _batchId) external view {
        Batch storage batch = batches[_batchId];
        require(
            msg.sender == batch.manufacturer ||
                msg.sender == batch.distributor ||
                msg.sender == batch.provider,
            "Unauthorized scan"
        );

        // Implement RFID scan logic and data recording here
    }

    function orderBatch(string memory _details) external onlyDistributor {
        emit BatchOrdered(msg.sender, address(0), _details);
    }

    function orderMedicine(string memory _details) external onlyProvider {
        emit MedicineOrdered(msg.sender, address(0), _details);
    }

    // Add additional functions as necessary for handling other operations
}
