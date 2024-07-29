// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PharmaChain {
    enum Role {
        Manufacturer,
        Distributor,
        Provider
    }

    enum OrderStatus {
        Pending,
        InTransit,
        Approved,
        Reached,
        Recalled
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
        OrderStatus status;
    }

    struct ProviderOrder {
        uint256 orderId;
        address provider;
        address distributor;
        uint256 orderDate;
        uint256 unitId;
        string details;
        bool isAssigned;
        uint256 batchId; // Will be assigned by the distributor
        OrderStatus status;
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
        uint256 unitId,
        string details
    );

    event DistributorOrderAssigned(uint256 indexed orderId, uint256 batchId);
    event ProviderOrderAssigned(uint256 indexed orderId, uint256 batchId);
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);

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

    function recallBatch(uint256 _batchId) public onlyManufacturer {
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
                distributorOrders[i].isAssigned &&
                distributorOrders[i].distributor == _distributor
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
                distributorOrders[i].isAssigned &&
                distributorOrders[i].distributor == _distributor
            ) {
                completedOrders[index] = distributorOrders[i];
                index++;
            }
        }

        return completedOrders;
    }

    function assignDistributorOrderToBatch(
        uint256 _orderId,
        uint256 _batchId
    ) external onlyManufacturer {
        DistributorOrder storage order = distributorOrders[_orderId];
        require(!order.isAssigned, "Order is already assigned");
        require(
            batches[_batchId].distributor == order.distributor,
            "Batch must be assigned to the correct distributor"
        );

        order.isAssigned = true;
        order.batchId = _batchId;

        emit DistributorOrderAssigned(_orderId, _batchId);
    }

    // DISTRIBUTOR FUNCTIONS
    function createDistributorOrder(
        address _manufacturer,
        string memory _details
    ) external onlyDistributor {
        require(
            users[_manufacturer].role == Role.Manufacturer,
            "Invalid manufacturer"
        );

        uint256 orderId = nextDistributorOrderId++;

        distributorOrders[orderId] = DistributorOrder({
            orderId: orderId,
            distributor: msg.sender,
            manufacturer: _manufacturer,
            orderDate: block.timestamp,
            batchId: 0,
            details: _details,
            isAssigned: false,
            status: OrderStatus.Pending // Initialize order status
        });

        emit DistributorOrderCreated(
            orderId,
            msg.sender,
            _manufacturer,
            block.timestamp,
            _details
        );
    }

    function assignBatchUnitToProvider(
        uint256 _unitId,
        address _provider
    ) external onlyDistributor {
        require(users[_provider].role == Role.Provider, "Invalid provider");

        BatchUnit storage unit = batchUnits[_unitId];
        require(!unit.isAssigned, "Unit is already assigned");

        unit.isAssigned = true;
        unit.provider = _provider;

        emit BatchUnitAssignedToProvider(_unitId, _provider);
    }

    function verifyRFID(
        uint256 _batchId,
        bytes32 _rfidUIDHash
    ) external onlyDistributor {
        Batch storage batch = batches[_batchId];
        bool verified = batch.rfidUIDHash == _rfidUIDHash;

        if (!verified) {
            recallBatch(_batchId);
        }

        emit RFIDVerified(_batchId, msg.sender, verified);
    }

    function getAssignedBatches()
        external
        view
        onlyDistributor
        returns (Batch[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (batches[i].distributor == msg.sender) {
                count++;
            }
        }

        Batch[] memory assignedBatches = new Batch[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (batches[i].distributor == msg.sender) {
                assignedBatches[index] = batches[i];
                index++;
            }
        }

        return assignedBatches;
    }

    function getPendingProviderOrders()
        external
        view
        onlyDistributor
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
                providerOrders[i].isAssigned &&
                providerOrders[i].provider == _provider
            ) {
                count++;
            }
        }

        ProviderOrder[] memory completedOrders = new ProviderOrder[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (
                providerOrders[i].isAssigned &&
                providerOrders[i].provider == _provider
            ) {
                completedOrders[index] = providerOrders[i];
                index++;
            }
        }

        return completedOrders;
    }

    function assignProviderOrderToBatch(
        uint256 _orderId,
        uint256 _batchId
    ) external onlyDistributor {
        ProviderOrder storage order = providerOrders[_orderId];
        require(!order.isAssigned, "Order is already assigned");

        order.isAssigned = true;
        order.batchId = _batchId;

        emit ProviderOrderAssigned(_orderId, _batchId);
    }

    // PROVIDER FUNCTIONS
    function createProviderOrder(
        address _distributor,
        uint256 _unitId,
        string memory _details
    ) external onlyProvider {
        require(
            users[_distributor].role == Role.Distributor,
            "Invalid distributor"
        );

        uint256 orderId = nextProviderOrderId++;

        providerOrders[orderId] = ProviderOrder({
            orderId: orderId,
            provider: msg.sender,
            distributor: _distributor,
            orderDate: block.timestamp,
            unitId: _unitId, // Single unit ID
            details: _details,
            isAssigned: false,
            batchId: 0,
            status: OrderStatus.Pending // Initialize order status
        });

        emit ProviderOrderCreated(
            orderId,
            msg.sender,
            _distributor,
            block.timestamp,
            _unitId,
            _details
        );
    }

    function getAvailableBatchUnits()
        external
        view
        onlyProvider
        returns (BatchUnit[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < nextUnitId; i++) {
            if (!batchUnits[i].isAssigned) {
                count++;
            }
        }

        BatchUnit[] memory availableUnits = new BatchUnit[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextUnitId; i++) {
            if (!batchUnits[i].isAssigned) {
                availableUnits[index] = batchUnits[i];
                index++;
            }
        }

        return availableUnits;
    }

    // COMMON FUNCTION FOR ORDER STATUS UPDATE
    function updateOrderStatus(
        uint256 _orderId,
        OrderStatus _status,
        bool isDistributor
    ) external {
        if (isDistributor) {
            DistributorOrder storage distributorOrder = distributorOrders[
                _orderId
            ];
            require(
                msg.sender == distributorOrder.distributor ||
                    users[msg.sender].role == Role.Manufacturer,
                "Not authorized to update order status"
            );
            distributorOrder.status = _status;
        } else {
            ProviderOrder storage providerOrder = providerOrders[_orderId];
            require(
                msg.sender == providerOrder.provider ||
                    msg.sender == providerOrder.distributor,
                "Not authorized to update order status"
            );
            providerOrder.status = _status;
        }

        emit OrderStatusUpdated(_orderId, _status);
    }
}
