// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PharmaChain {
    enum Role {
        Manufacturer,
        Distributor,
        Provider
    }

    enum DistributionType {
        InHouse,
        ThirdParty
    }

    enum OrderStatus {
        Pending,
        Approved,
        Recalled,
        InTransit,
        Delivered
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
        bytes32 rfidUIDHash;
        bool isRecalled;
    }

    struct BatchUnit {
        uint256 unitId;
        uint256 batchId;
        address provider;
        bool isAssigned;
    }

    struct Order {
        uint256 orderId;
        address distributor;
        address manufacturer;
        string details;
        OrderStatus status;
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => BatchUnit) public batchUnits;
    mapping(uint256 => Order) public orders;

    uint256 public nextBatchId;
    uint256 public nextUnitId;
    uint256 public nextOrderId;

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
        uint256 indexed orderId,
        address indexed distributor,
        address indexed manufacturer,
        string details,
        OrderStatus status
    );
    event MedicineOrdered(
        uint256 indexed orderId,
        address indexed provider,
        address indexed distributor,
        string details,
        OrderStatus status
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
        Role _role,
        bool _isSubAccount,
        address _masterAccount,
        DistributionType _distributionType
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

    function isUserRegistered(address _user) external view returns (bool) {
        return users[_user].account != address(0);
    }

    function isUserSubAccount(address _user) external view returns (bool) {
        return users[_user].isSubAccount;
    }

    function isUserMasterAccount(address _user) external view returns (bool) {
        return users[_user].masterAccount == _user;
    }

    function getUserRole(address _user) external view returns (Role) {
        return users[_user].role;
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

    // ORDER FUNCTIONS
    function orderBatch(string memory _details) external onlyDistributor {
        User storage user = users[msg.sender];

        if (user.distributionType == DistributionType.InHouse) {
            uint256 orderId = nextOrderId++;
            orders[orderId] = Order({
                orderId: orderId,
                distributor: msg.sender,
                manufacturer: address(0),
                details: _details,
                status: OrderStatus.Pending
            });

            emit BatchOrdered(
                orderId,
                msg.sender,
                address(0),
                _details,
                OrderStatus.Pending
            );
        } else {
            uint256 orderId = nextOrderId++;
            orders[orderId] = Order({
                orderId: orderId,
                distributor: msg.sender,
                manufacturer: user.masterAccount,
                details: _details,
                status: OrderStatus.Pending
            });

            emit BatchOrdered(
                orderId,
                msg.sender,
                user.masterAccount,
                _details,
                OrderStatus.Pending
            );
        }
    }

    function approveOrder(uint256 _orderId) external onlyManufacturer {
        Order storage order = orders[_orderId];
        require(
            order.manufacturer == msg.sender,
            "Only the manufacturer can approve the order"
        );

        order.status = OrderStatus.Approved;

        emit BatchOrdered(
            _orderId,
            order.distributor,
            msg.sender,
            order.details,
            OrderStatus.Approved
        );
    }

    function deliverOrder(uint256 _orderId) external onlyDistributor {
        Order storage order = orders[_orderId];
        require(
            order.distributor == msg.sender,
            "Only the distributor can deliver the order"
        );

        order.status = OrderStatus.Delivered;

        emit BatchOrdered(
            _orderId,
            msg.sender,
            order.manufacturer,
            order.details,
            OrderStatus.Delivered
        );
    }

    function trackOrder(uint256 _orderId) external view returns (OrderStatus) {
        return orders[_orderId].status;
    }

    function getCompletedOrders() external view returns (Order[] memory) {
        return filterOrdersByStatus(OrderStatus.Delivered);
    }

    function getPendingOrders() external view returns (Order[] memory) {
        return filterOrdersByStatus(OrderStatus.Pending);
    }

    function getRecalledOrders() external view returns (Order[] memory) {
        return filterOrdersByStatus(OrderStatus.Recalled);
    }

    function getQualityApprovedOrders() external view returns (Order[] memory) {
        return filterOrdersByStatus(OrderStatus.Approved);
    }

    function getQualityDisapprovedOrders()
        external
        view
        returns (Order[] memory)
    {
        return filterOrdersByStatus(OrderStatus.Recalled);
    }

    function getOrdersInTransit() external view returns (Order[] memory) {
        return filterOrdersByStatus(OrderStatus.InTransit);
    }

    function filterOrdersByStatus(
        OrderStatus _status
    ) internal view returns (Order[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextOrderId; i++) {
            if (orders[i].status == _status) {
                count++;
            }
        }

        Order[] memory result = new Order[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextOrderId; i++) {
            if (orders[i].status == _status) {
                result[index] = orders[i];
                index++;
            }
        }

        return result;
    }
}
