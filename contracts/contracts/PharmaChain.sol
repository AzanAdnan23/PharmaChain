// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// 0xdBCa59dD9Ef98415f7dE588963df02Cadc3E218E
contract PharmaChain {
    enum Role {
        Manufacturer,
        Distributor,
        Provider
    }

    struct User {
        address account;
        string companyName;
        Role role;
        string contactInfo;
    }

    struct Batch {
        uint256 batchId;
        address manufacturer;
        string details;
        bool qualityApproved;
        address distributor;
        bytes32 rfidUIDHash;
        bool isRecalled;
    }

    struct BatchUnit {
        uint256 unitId;
        uint256 batchId;
        address provider;
        bool isAssigned;
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => BatchUnit) public batchUnits;

    uint256 public nextBatchId;
    uint256 public nextUnitId;

    event UserRegistered(
        address indexed user,
        string companyName,
        Role role,
        string contactInfo
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
    event BatchUnitAssignedToProvider(
        uint256 indexed unitId,
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

    // USER FUNCTIONS
    function registerUser(
        address _user,
        string memory _companyName,
        Role _role,
        string memory _contactInfo
    ) external {
        require(_user != address(0), "Invalid address");

        users[_user] = User({
            account: _user,
            companyName: _companyName,
            role: _role,
            contactInfo: _contactInfo
        });

        emit UserRegistered(_user, _companyName, _role, _contactInfo);
    }

    function isUserRegistered(address _user) external view returns (bool) {
        return users[_user].account != address(0);
    }

    function getUserRole(address _user) external view returns (Role) {
        return users[_user].role;
    }

    function getUserInfo(
        address _user
    )
        external
        view
        returns (
            string memory companyName,
            string memory contactInfo,
            Role role
        )
    {
        User memory user = users[_user];
        return (user.companyName, user.contactInfo, user.role);
    }

    // MANUFACTURER FUNCTIONS
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
            rfidUIDHash: _rfidUIDHash,
            isRecalled: false
        });

        emit BatchCreated(batchId, msg.sender, _details, _rfidUIDHash);
    }

    function approveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender,
            "Only the manufacturer can approve quality"
        );

        batch.qualityApproved = true;

        emit QualityApproved(_batchId, msg.sender);
    }

    function disapproveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender,
            "Only the manufacturer can disapprove quality"
        );

        batch.qualityApproved = false;

        emit QualityDisapproved(_batchId, msg.sender);
    }

    function recallBatch(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender,
            "Only the manufacturer can recall the batch"
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

    function isApproved(uint256 _batchId) external view returns (bool) {
        return batches[_batchId].qualityApproved;
    }

    function isRecalled(uint256 _batchId) external view returns (bool) {
        return batches[_batchId].isRecalled;
    }

    // DISTRIBUTOR FUNCTIONS
    function splitBatch(
        uint256 _batchId,
        uint256 _numUnits
    ) external onlyDistributor {
        require(_numUnits > 0, "Number of units must be greater than zero");

        for (uint256 i = 0; i < _numUnits; i++) {
            uint256 unitId = nextUnitId++;
            batchUnits[unitId] = BatchUnit({
                unitId: unitId,
                batchId: _batchId,
                provider: address(0),
                isAssigned: false
            });
        }
    }

    function assignUnitToProvider(
        uint256 _unitId,
        address _provider
    ) external onlyDistributor {
        require(users[_provider].role == Role.Provider, "Invalid provider");

        BatchUnit storage unit = batchUnits[_unitId];
        require(!unit.isAssigned, "Unit already assigned");

        unit.provider = _provider;
        unit.isAssigned = true;

        emit BatchUnitAssignedToProvider(_unitId, _provider);
    }

    function verifyRFID(uint256 _batchId, bytes32 _rfidUIDHash) external {
        Batch storage batch = batches[_batchId];
        bool verified = (batch.rfidUIDHash == _rfidUIDHash);

        emit RFIDVerified(_batchId, msg.sender, verified);
    }

    function orderBatch(string memory _details) external onlyDistributor {
        emit BatchOrdered(msg.sender, address(0), _details);
    }

    function orderMedicine(string memory _details) external onlyProvider {
        emit MedicineOrdered(msg.sender, address(0), _details);
    }
}

// To Do:

// USER FUNCTIONS
// Fix Register User Function and implement sub-accounts logic

// MANUFACTURER FUNCTIONS

// DISTRIBUTOR FUNCTIONS

// PROVIDER FUNCTIONS
// Implement rfid scaned location logic/ track

// GENREAL FUNCTIONS
// Completed orders / Orders delivered
// Pending orders
// Recalled orders
// Quality approved orders
// Quality disapproved orders
// Orders in transit

// orderBatch :
// 1. Distributor just place the order for the batch if it is inhouse distributor.
// 2.  if it is 3rd poarty distributor then it will place the order to the manufacturer and manufacturer will approve then assign the batch to the distributor.

// orderMedicine
// 1. Provider will place the order for the medicine and distributor will approve then assign the unit to the provider.
//
