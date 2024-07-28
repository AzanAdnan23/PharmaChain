// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
        uint256 manufactureDate;
        uint256 expiryDate;
        uint256 quantity;
    }

    struct BatchUnit {
        uint256 unitId;
        uint256 batchId;
        address provider;
        bool isAssigned;
    }

    struct DistributorOrder {
        uint256 orderId;
        address distributor;
        address manufacturer;
        uint256 orderDate;
        uint256 batchId; // Batch to be assigned by the manufacturer
        string details;
        bool isAssigned;
    }

    struct ProviderOrder {
        uint256 orderId;
        address provider;
        address distributor;
        uint256 orderDate;
        uint256[] unitIds; // List of unit IDs ordered
        string details;
        bool isAssigned;
        uint256 batchId; // Will be assigned by the distributor later
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => BatchUnit) public batchUnits;
    mapping(uint256 => DistributorOrder) public distributorOrders;
    mapping(uint256 => ProviderOrder) public providerOrders;

    uint256 public nextBatchId;
    uint256 public nextUnitId;
    uint256 public nextDistributorOrderId;
    uint256 public nextProviderOrderId;

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
        bytes32 rfidUIDHash,
        uint256 manufactureDate,
        uint256 expiryDate,
        uint256 quantity
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
    event DistributorOrderCreated(
        uint256 indexed orderId,
        address indexed distributor,
        address indexed manufacturer,
        uint256 orderDate,
        string details
    );
    event ProviderOrderCreated(
        uint256 indexed orderId,
        address indexed provider,
        address indexed distributor,
        uint256 orderDate,
        uint256[] unitIds,
        string details
    );
    event DistributorOrderAssigned(uint256 indexed orderId, uint256 batchId);
    event ProviderOrderAssigned(uint256 indexed orderId, uint256 batchId);

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
        bytes32 _rfidUIDHash,
        uint256 _expiryDate,
        uint256 _quantity
    ) external onlyManufacturer {
        uint256 batchId = nextBatchId++;

        require(
            _expiryDate > block.timestamp,
            "Expiry date must be in the future"
        );
        require(_quantity > 0, "Quantity must be greater than zero");

        batches[batchId] = Batch({
            batchId: batchId,
            manufacturer: msg.sender,
            details: _details,
            qualityApproved: false,
            distributor: address(0),
            rfidUIDHash: _rfidUIDHash,
            isRecalled: false,
            manufactureDate: block.timestamp,
            expiryDate: _expiryDate,
            quantity: _quantity
        });

        emit BatchCreated(
            batchId,
            msg.sender,
            _details,
            _rfidUIDHash,
            block.timestamp,
            _expiryDate,
            _quantity
        );
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

    function getCreatedBatches(
        address _manufacturer
    ) external view returns (Batch[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (batches[i].manufacturer == _manufacturer) {
                count++;
            }
        }

        Batch[] memory createdBatches = new Batch[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (batches[i].manufacturer == _manufacturer) {
                createdBatches[index] = batches[i];
                index++;
            }
        }

        return createdBatches;
    }

    function getPendingDistributorOrders()
        external
        view
        returns (DistributorOrder[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < nextDistributorOrderId; i++) {
            if (!distributorOrders[i].isAssigned) {
                count++;
            }
        }

        DistributorOrder[] memory pendingOrders = new DistributorOrder[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextDistributorOrderId; i++) {
            if (!distributorOrders[i].isAssigned) {
                pendingOrders[index] = distributorOrders[i];
                index++;
            }
        }

        return pendingOrders;
    }

    function getCompletedDistributorOrders(
        address _distributor
    ) external view returns (DistributorOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextDistributorOrderId; i++) {
            if (
                distributorOrders[i].distributor == _distributor &&
                distributorOrders[i].isAssigned
            ) {
                count++;
            }
        }

        DistributorOrder[] memory completedOrders = new DistributorOrder[](
            count
        );
        uint256 index = 0;
        for (uint256 i = 0; i < nextDistributorOrderId; i++) {
            if (
                distributorOrders[i].distributor == _distributor &&
                distributorOrders[i].isAssigned
            ) {
                completedOrders[index] = distributorOrders[i];
                index++;
            }
        }

        return completedOrders;
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

    function createDistributorOrder(
        address _manufacturer,
        uint256 _batchId,
        string memory _details
    ) external onlyDistributor {
        uint256 orderId = nextDistributorOrderId++;

        distributorOrders[orderId] = DistributorOrder({
            orderId: orderId,
            distributor: msg.sender,
            manufacturer: _manufacturer,
            orderDate: block.timestamp,
            batchId: _batchId,
            details: _details,
            isAssigned: false
        });

        emit DistributorOrderCreated(
            orderId,
            msg.sender,
            _manufacturer,
            block.timestamp,
            _details
        );
    }

    function assignDistributorOrder(
        uint256 _orderId,
        uint256 _batchId
    ) external onlyManufacturer {
        DistributorOrder storage order = distributorOrders[_orderId];
        require(
            order.manufacturer == msg.sender,
            "Only the assigned manufacturer can fulfill the order"
        );

        Batch storage batch = batches[_batchId];
        require(batch.qualityApproved, "Batch must be quality approved");

        order.batchId = _batchId;
        order.isAssigned = true;

        emit DistributorOrderAssigned(_orderId, _batchId);
    }

    function createProviderOrder(
        uint256[] memory _unitIds,
        string memory _details
    ) external onlyProvider {
        uint256 orderId = nextProviderOrderId++;

        providerOrders[orderId] = ProviderOrder({
            orderId: orderId,
            provider: msg.sender,
            distributor: address(0),
            orderDate: block.timestamp,
            unitIds: _unitIds,
            details: _details,
            isAssigned: false,
            batchId: 0 // Placeholder, will be assigned later
        });

        emit ProviderOrderCreated(
            orderId,
            msg.sender,
            address(0),
            block.timestamp,
            _unitIds,
            _details
        );
    }

    function getPendingProviderOrders()
        external
        view
        returns (ProviderOrder[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (!providerOrders[i].isAssigned) {
                count++;
            }
        }

        ProviderOrder[] memory pendingOrders = new ProviderOrder[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (!providerOrders[i].isAssigned) {
                pendingOrders[index] = providerOrders[i];
                index++;
            }
        }

        return pendingOrders;
    }

    function getCompletedProviderOrders(
        address _provider
    ) external view returns (ProviderOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (
                providerOrders[i].provider == _provider &&
                providerOrders[i].isAssigned
            ) {
                count++;
            }
        }

        ProviderOrder[] memory completedOrders = new ProviderOrder[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (
                providerOrders[i].provider == _provider &&
                providerOrders[i].isAssigned
            ) {
                completedOrders[index] = providerOrders[i];
                index++;
            }
        }

        return completedOrders;
    }

    function assignProviderOrder(
        uint256 _orderId,
        uint256 _batchId
    ) external onlyDistributor {
        ProviderOrder storage order = providerOrders[_orderId];
        require(
            order.distributor == msg.sender,
            "Only the assigned distributor can fulfill the order"
        );

        order.batchId = _batchId;
        order.isAssigned = true;

        emit ProviderOrderAssigned(_orderId, _batchId);
    }
}
