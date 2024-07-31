// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//0x7D5157031399dCa98Af1d16a225d9c237aA7afA8
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
        bool isQualityApproved;
        bool isQualityDisapproved;
        address distributor;
        bytes32 rfidUIDHash;
        bool isRecalled;
        uint256 manufactureDate;
        uint256 expiryDate;
        uint256 quantity;
        uint256 orderId; // New field
    }

    struct DistributorOrder {
        uint256 orderId;
        address distributor;
        address manufacturer;
        uint256 orderDate;
        uint256 batchId;
        string medName;
        uint256 quantity;
        bool isAssigned;
        OrderStatus status;
        uint256 orderApprovedDate; // New field
    }

    struct BatchUnit {
        uint256 unitId;
        uint256 batchId;
        address provider;
        bool isAssigned;
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

    struct StockItem {
        string medName;
        uint256 quantity;
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => BatchUnit) public batchUnits;
    mapping(uint256 => DistributorOrder) public distributorOrders;
    mapping(uint256 => ProviderOrder) public providerOrders;

    mapping(address => mapping(string => uint256)) public distributorStocks; // Distributor stock mapping
    mapping(address => mapping(string => uint256)) public providerStocks; // Provider stock mapping
    mapping(address => string[]) public distributorMedNames; // List of medication names for distributor
    mapping(address => string[]) public providerMedNames; // List of medication names for provider

    uint256 public nextBatchId = 100;
    uint256 public nextUnitId = 100;
    uint256 public nextDistributorOrderId = 100;
    uint256 public nextProviderOrderId = 100;

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

    function getCompanyNameFromAddress(
        address _user
    ) external view returns (string memory) {
        return users[_user].companyName; // Get company name from the address
    }

    function getUserByAddress(
        address _user
    ) external view returns (User memory) {
        return users[_user];
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
            isQualityApproved: false,
            isQualityDisapproved: false, // Initialize as not disapproved
            distributor: address(0),
            rfidUIDHash: _rfidUIDHash,
            isRecalled: false,
            manufactureDate: block.timestamp,
            expiryDate: _expiryDate,
            quantity: _quantity,
            orderId: 0
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

        batch.isQualityApproved = true;
        batch.isQualityDisapproved = false; // Set disapproved to false

        emit QualityApproved(_batchId, msg.sender);
    }

    function disapproveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender,
            "Only the manufacturer can disapprove quality"
        );

        batch.isQualityApproved = false; // Ensure the approved flag is false
        batch.isQualityDisapproved = true; // Set disapproved to true

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
        address _distributor,
        uint256 _orderId
    ) external onlyManufacturer {
        require(
            users[_distributor].role == Role.Distributor,
            "Invalid distributor"
        );

        Batch storage batch = batches[_batchId];
        require(batch.isQualityApproved, "Batch must be quality approved");

        batch.distributor = _distributor;
        batch.orderId = _orderId; // Set order ID in batch

        DistributorOrder storage order = distributorOrders[_orderId];
        require(
            order.batchId == _batchId,
            "Order must be assigned to this batch"
        );

        order.manufacturer = msg.sender;
        order.status = OrderStatus.Approved;
        order.orderApprovedDate = block.timestamp; // Update approved date

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

    function getFulfilledBatches(
        address _manufacturer
    ) external view returns (Batch[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (
                batches[i].manufacturer == _manufacturer &&
                batches[i].distributor != address(0)
            ) {
                count++;
            }
        }

        Batch[] memory fulfilledBatches = new Batch[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (
                batches[i].manufacturer == _manufacturer &&
                batches[i].distributor != address(0)
            ) {
                fulfilledBatches[index] = batches[i];
                index++;
            }
        }

        return fulfilledBatches;
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

    // DISTRIBUTOR FUNCTIONS
    function createDistributorOrder(
        string memory _medName,
        uint256 _quantity
    ) external onlyDistributor {
        uint256 orderId = nextDistributorOrderId++;

        distributorOrders[orderId] = DistributorOrder({
            orderId: orderId,
            distributor: msg.sender,
            manufacturer: address(0),
            orderDate: block.timestamp,
            batchId: 0,
            medName: _medName,
            quantity: _quantity,
            isAssigned: false,
            status: OrderStatus.Pending,
            orderApprovedDate: 0
        });
    }

    function assignBatchToOrder(
        uint256 _orderId,
        uint256 _batchId
    ) external onlyManufacturer {
        DistributorOrder storage order = distributorOrders[_orderId];
        require(
            order.manufacturer == address(0) ||
                order.manufacturer == msg.sender,
            "Only the order's manufacturer can assign the batch"
        );

        Batch storage batch = batches[_batchId];
        require(batch.manufacturer == msg.sender, "Invalid manufacturer");
        require(
            batch.quantity >= order.quantity,
            "Insufficient batch quantity"
        );

        order.batchId = _batchId;
        order.manufacturer = msg.sender;
        order.isAssigned = true;
        order.status = OrderStatus.InTransit;
    }

    function updateDistributorOrderStatus(
        uint256 _orderId,
        OrderStatus _status
    ) external onlyDistributor {
        DistributorOrder storage order = distributorOrders[_orderId];
        require(
            order.distributor == msg.sender,
            "Only the distributor can update the order status"
        );

        order.status = _status;

        if (_status == OrderStatus.Reached) {
            // Update distributor's stock when order status changes to Reached
            distributorStocks[msg.sender][order.medName] += order.quantity;

            // Add medName to distributor's medName list if not already present
            if (!_medNameExistsInList(msg.sender, order.medName, true)) {
                distributorMedNames[msg.sender].push(order.medName);
            }
        }
    }

    function getDistributorOrderStatus(
        uint256 _orderId
    ) external view returns (OrderStatus, uint256) {
        DistributorOrder storage order = distributorOrders[_orderId];
        return (order.status, order.orderApprovedDate); // Return status and approved date
    }

    function assignUnitToProvider(
        uint256 _unitId,
        address _provider
    ) external onlyDistributor {
        BatchUnit storage unit = batchUnits[_unitId];
        require(!unit.isAssigned, "Unit is already assigned");
        require(users[_provider].role == Role.Provider, "Invalid provider");

        unit.provider = _provider;
        unit.isAssigned = true;
    }

    function getDistributorOrders(
        address _distributor
    ) external view returns (DistributorOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextDistributorOrderId; i++) {
            if (distributorOrders[i].distributor == _distributor) {
                count++;
            }
        }

        DistributorOrder[] memory orders = new DistributorOrder[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextDistributorOrderId; i++) {
            if (distributorOrders[i].distributor == _distributor) {
                orders[index] = distributorOrders[i];
                index++;
            }
        }

        return orders;
    }

    // PROVIDER FUNCTIONS
    function createProviderOrder(
        string memory _details,
        address _distributor
    ) external onlyProvider {
        uint256 orderId = nextProviderOrderId++;

        providerOrders[orderId] = ProviderOrder({
            orderId: orderId,
            provider: msg.sender,
            distributor: _distributor,
            orderDate: block.timestamp,
            unitId: 0,
            details: _details,
            isAssigned: false,
            batchId: 0,
            status: OrderStatus.Pending
        });
    }

    function assignBatchUnitToOrder(
        uint256 _orderId,
        uint256 _unitId
    ) external onlyDistributor {
        ProviderOrder storage order = providerOrders[_orderId];
        require(
            order.distributor == msg.sender,
            "Only the distributor can assign a unit"
        );

        BatchUnit storage unit = batchUnits[_unitId];
        require(unit.isAssigned && unit.provider != address(0), "Invalid unit");

        order.unitId = _unitId;
        order.isAssigned = true;
        order.batchId = unit.batchId;
        order.status = OrderStatus.InTransit;
    }

    function updateProviderOrderStatus(
        uint256 _orderId,
        OrderStatus _status
    ) external onlyProvider {
        ProviderOrder storage order = providerOrders[_orderId];
        require(
            order.provider == msg.sender,
            "Only the provider can update the order status"
        );

        order.status = _status;

        if (_status == OrderStatus.Reached) {
            // Update provider's stock when order status changes to Reached
            BatchUnit storage unit = batchUnits[order.unitId];
            distributorStocks[order.distributor][
                batches[unit.batchId].details
            ] -= 1;
            providerStocks[msg.sender][batches[unit.batchId].details] += 1;

            // Add medName to provider's medName list if not already present
            if (
                !_medNameExistsInList(
                    msg.sender,
                    batches[unit.batchId].details,
                    false
                )
            ) {
                providerMedNames[msg.sender].push(
                    batches[unit.batchId].details
                );
            }
        }
    }

    function getProviderOrders(
        address _provider
    ) external view returns (ProviderOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (providerOrders[i].provider == _provider) {
                count++;
            }
        }

        ProviderOrder[] memory orders = new ProviderOrder[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextProviderOrderId; i++) {
            if (providerOrders[i].provider == _provider) {
                orders[index] = providerOrders[i];
                index++;
            }
        }

        return orders;
    }

    // STOCK FUNCTIONS
    function getDistributorStock(
        address _distributor
    ) external view returns (StockItem[] memory) {
        uint256 count = distributorMedNames[_distributor].length;
        StockItem[] memory stocks = new StockItem[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory medName = distributorMedNames[_distributor][i];
            stocks[i] = StockItem({
                medName: medName,
                quantity: distributorStocks[_distributor][medName]
            });
        }

        return stocks;
    }

    function getProviderStock(
        address _provider
    ) external view returns (StockItem[] memory) {
        uint256 count = providerMedNames[_provider].length;
        StockItem[] memory stocks = new StockItem[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory medName = providerMedNames[_provider][i];
            stocks[i] = StockItem({
                medName: medName,
                quantity: providerStocks[_provider][medName]
            });
        }

        return stocks;
    }

    // Internal Helper Function
    function _medNameExistsInList(
        address _user,
        string memory _medName,
        bool isDistributor
    ) internal view returns (bool) {
        string[] storage medNames = isDistributor
            ? distributorMedNames[_user]
            : providerMedNames[_user];
        for (uint256 i = 0; i < medNames.length; i++) {
            if (keccak256(bytes(medNames[i])) == keccak256(bytes(_medName))) {
                return true;
            }
        }
        return false;
    }
}
