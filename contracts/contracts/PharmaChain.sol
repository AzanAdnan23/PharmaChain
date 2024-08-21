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
        bool isQualityApproved;
        bool isQualityDisapproved;
        address distributor;
        bytes32 rfidUIDHash;
        bool isRecalled;
        uint256 manufactureDate;
        uint256 expiryDate;
        uint256 quantity;
        uint256 orderId;
    }

    struct DistributorOrder {
        string medName;
        uint256 quantity;
        uint256 orderId;
        uint256 batchId;
        address distributor;
        address manufacturer;
        bool isAssigned;
        uint256 orderDate;
        uint256 orderApprovedDate;
        OrderStatus status;
    }

    struct ProviderOrder {
        string medName;
        uint256 quantity;
        uint256 orderId;
        uint256 batchId;
        address provider;
        address distributor;
        bool isAssigned;
        uint256 orderDate;
        uint256 orderApprovedDate;
        OrderStatus status;
    }

    struct StockItem {
        string medName;
        uint256 quantity;
    }

    mapping(address => User) public users;
    mapping(uint256 => Batch) public batches;

    mapping(uint256 => DistributorOrder) public distributorOrders;
    mapping(uint256 => ProviderOrder) public providerOrders;

    mapping(address => mapping(string => uint256)) public distributorStocks;
    mapping(address => mapping(string => uint256)) public providerStocks;
    mapping(address => string[]) public distributorMedNames;
    mapping(address => string[]) public providerMedNames;

    mapping(bytes32 => uint256) public rfidToDistributorOrderId;
    mapping(bytes32 => uint256) public rfidToProviderOrderId;

    uint256 public nextBatchId = 100;

    uint256 public nextDistributorOrderId = 100;
    uint256 public nextProviderOrderId = 100;


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
     event UpdateDistributorOrderStatus(
        uint256 indexed orderId,
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
            isQualityDisapproved: false,
            distributor: address(0),
            rfidUIDHash: _rfidUIDHash,
            isRecalled: false,
            manufactureDate: block.timestamp,
            expiryDate: _expiryDate,
            quantity: _quantity,
            orderId: 0
        });

      
    }

    function approveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender,
            "Only the manufacturer can approve quality"
        );

        batch.isQualityApproved = true;
        batch.isQualityDisapproved = false;

      
    }

    function disapproveQuality(uint256 _batchId) external onlyManufacturer {
        Batch storage batch = batches[_batchId];
        require(
            batch.manufacturer == msg.sender,
            "Only the manufacturer can disapprove quality"
        );

        batch.isQualityApproved = false;
        batch.isQualityDisapproved = true;

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
        require(batch.distributor == address(0), "Batch already assigned");

        DistributorOrder storage order = distributorOrders[_orderId];
        require(order.batchId == 0, "Order is already assigned to a batch");
        require(
            order.quantity <= batch.quantity,
            "Order quantity exceeds batch quantity"
        );

        batch.distributor = _distributor;
        batch.orderId = _orderId;
        order.batchId = _batchId;

        order.isAssigned = true;
        order.manufacturer = msg.sender;
        order.status = OrderStatus.Approved;
        order.orderApprovedDate = block.timestamp;

        rfidToDistributorOrderId[batch.rfidUIDHash] = _orderId;

        emit BatchAssignedToDistributor(_batchId, _distributor);
    }

    function getCreatedBatches(
        address _manufacturer
    ) external view returns (Batch[] memory) {
        uint256 count = 0;
        for (uint256 i = 100; i < nextBatchId; i++) {
            // Start from 100
            if (batches[i].manufacturer == _manufacturer) {
                count++;
            }
        }

        Batch[] memory createdBatches = new Batch[](count);
        uint256 index = 0;
        for (uint256 i = 100; i < nextBatchId; i++) {
            // Start from 100
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
        for (uint256 i = 100; i < nextBatchId; i++) {
            if (
                batches[i].manufacturer == _manufacturer &&
                batches[i].distributor != address(0)
            ) {
                count++;
            }
        }

        Batch[] memory fulfilledBatches = new Batch[](count);
        uint256 index = 0;
        for (uint256 i = 100; i < nextBatchId; i++) {
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

   function updateDistributorOrderStatusByRFID(
    bytes32 _rfidUIDHash,
    OrderStatus _status
) external {

   
    require(
        users[msg.sender].role == Role.Manufacturer || users[msg.sender].role == Role.Distributor,
        "Only manufacturers or distributors can perform this action"
    );

    uint256 orderId = rfidToDistributorOrderId[_rfidUIDHash];
    require(orderId != 0, "Order not found for the given RFID UID");

    DistributorOrder storage order = distributorOrders[orderId];

    require(order.status != OrderStatus.Reached, "Order has already reached");
    order.status = _status;

    if (_status == OrderStatus.Reached) {
        // Update distributor's stock when order status changes to Reached
        distributorStocks[msg.sender][order.medName] += order.quantity;

        // Add medName to distributor's medName list if not already present
        if (!_distributorMedNameExists(msg.sender, order.medName)) {
            distributorMedNames[msg.sender].push(order.medName);
        }
    }

    emit UpdateDistributorOrderStatus(orderId, _status);
}


   function assignBatchToProvider(
    uint256 _batchId,
    address _provider,
    uint256 _orderId
) external onlyDistributor {
    require(
        users[_provider].role == Role.Provider,
        "Invalid provider"
    );

    Batch storage batch = batches[_batchId];
    require(batch.isQualityApproved, "Batch must be quality approved");
    require(batch.distributor == msg.sender, "Only the distributor who received the batch can assign it to a provider");

    ProviderOrder storage order = providerOrders[_orderId];
    require(order.batchId == 0, "Order is already assigned to a batch");
   
    order.batchId = _batchId;
    order.isAssigned = true;
    order.distributor = msg.sender;
    order.status = OrderStatus.Approved;
    order.orderApprovedDate = block.timestamp;

    rfidToProviderOrderId[batch.rfidUIDHash] = _orderId;

    emit BatchAssignedToProvider(_batchId, _provider);
}


    function getPendingDistributorOrders()
        external
        view
        returns (DistributorOrder[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 100; i < nextDistributorOrderId; i++) {
            if (!distributorOrders[i].isAssigned) {
                count++;
            }
        }

        DistributorOrder[] memory pendingOrders = new DistributorOrder[](count);
        uint256 index = 0;
        for (uint256 i = 100; i < nextDistributorOrderId; i++) {
            if (!distributorOrders[i].isAssigned) {
                pendingOrders[index] = distributorOrders[i];
                index++;
            }
        }

        return pendingOrders;
    }

    // Function to get fulfilled distributor orders
    function getFulfilledDistributorOrders(
        address _distributor
    ) external view returns (DistributorOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 100; i < nextDistributorOrderId; i++) {
            if (
                distributorOrders[i].distributor == _distributor &&
                distributorOrders[i].status == OrderStatus.Reached
            ) {
                count++;
            }
        }

        DistributorOrder[] memory fulfilledOrders = new DistributorOrder[](
            count
        );
        uint256 index = 0;
        for (uint256 i = 100; i < nextDistributorOrderId; i++) {
            if (
                distributorOrders[i].distributor == _distributor &&
                distributorOrders[i].status == OrderStatus.Reached
            ) {
                fulfilledOrders[index] = distributorOrders[i];
                index++;
            }
        }

        return fulfilledOrders;
    }

    function getDistributorOrder(
        uint256 _orderId
    ) external view returns (DistributorOrder memory) {
        DistributorOrder storage order = distributorOrders[_orderId];
        require(order.orderId != 0, "Order does not exist");
        return order;
    }

    function getDistributorOrders(
        address _distributor
    ) external view returns (DistributorOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 100; i < nextDistributorOrderId; i++) {
            if (distributorOrders[i].distributor == _distributor) {
                count++;
            }
        }

        DistributorOrder[] memory orders = new DistributorOrder[](count);
        uint256 index = 0;
        for (uint256 i = 100; i < nextDistributorOrderId; i++) {
            if (distributorOrders[i].distributor == _distributor) {
                orders[index] = distributorOrders[i];
                index++;
            }
        }

        return orders;
    }

    function getDistributorOrderByRFID(
        bytes32 _rfidUIDHash
    ) external view returns (uint256) {
        uint256 orderId = rfidToDistributorOrderId[_rfidUIDHash];
        if (orderId == 0) {
            return 0; // Return 0 if the orderId is not found
        } else {
            return distributorOrders[orderId].orderId; // Return the actual orderId
        }
    }

    // STOCK FUNCTION
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

    // PROVIDER FUNCTIONS
    function createProviderOrder(
        string memory _medName,
        uint256 _qunatity
    ) external onlyProvider {
        uint256 orderId = nextProviderOrderId++;

        providerOrders[orderId] = ProviderOrder({
            orderId: orderId,
            provider: msg.sender,
            distributor: address(0),
            orderDate: block.timestamp,
            medName: _medName,
            quantity: _qunatity,
            isAssigned: false,
            batchId: 0,
            status: OrderStatus.Pending,
            orderApprovedDate: 0
        });
    }
function updateProviderOrderStatusByRFID(
    bytes32 _rfidUIDHash,
    OrderStatus _status
) external {
    require(
        users[msg.sender].role == Role.Provider || users[msg.sender].role == Role.Distributor,
        "Only Providers or Distributors can perform this action"
    );

    uint256 orderId = rfidToProviderOrderId[_rfidUIDHash];
    require(orderId != 0, "Order not found for the given RFID UID");

    ProviderOrder storage order = providerOrders[orderId];
    require(order.status != OrderStatus.Reached, "Order has already reached");

    order.status = _status;

    if (_status == OrderStatus.Reached) {
        // Update provider's stock
        providerStocks[order.provider][order.medName] += order.quantity;

        // Add medName to provider's medName list if not already present
        if (!_providerMedNameExists(order.provider, order.medName)) {
            providerMedNames[order.provider].push(order.medName);
        }

        // Deduct quantity from distributor's stock
        distributorStocks[order.distributor][order.medName] -= order.quantity;
    }
}



    function getProviderOrderDetails(
        uint256 _orderId
    ) external view returns (ProviderOrder memory) {
        ProviderOrder storage order = providerOrders[_orderId];
        require(order.orderId != 0, "Order does not exist");
        return order;
    }

    function getProviderOrders(
        address _provider
    ) external view returns (ProviderOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 100; i < nextProviderOrderId; i++) {
            if (providerOrders[i].provider == _provider) {
                count++;
            }
        }

        ProviderOrder[] memory orders = new ProviderOrder[](count);
        uint256 index = 0;
        for (uint256 i = 100; i < nextProviderOrderId; i++) {
            if (providerOrders[i].provider == _provider) {
                orders[index] = providerOrders[i];
                index++;
            }
        }

        return orders;
    }

function getPendingProviderOrders()
    external
    view
    returns (ProviderOrder[] memory)
{
    uint256 count = 0;
    for (uint256 i = 100; i < nextProviderOrderId; i++) {
        if (providerOrders[i].status == OrderStatus.Pending
        ) {
            count++;
        }
    }

    ProviderOrder[] memory pendingOrders = new ProviderOrder[](count);
    uint256 index = 0;
    for (uint256 i = 100; i < nextProviderOrderId; i++) {
        if (providerOrders[i].status == OrderStatus.Pending
        ) {
            pendingOrders[index] = providerOrders[i];
            index++;
        }
    }

    return pendingOrders;
}



    //  Get fulfilled provider orders
    function getFulfilledProviderOrders(
        address _provider
    ) external view returns (ProviderOrder[] memory) {
        uint256 count = 0;
        for (uint256 i = 100; i < nextProviderOrderId; i++) {
            if (
                providerOrders[i].provider == _provider &&
                providerOrders[i].status == OrderStatus.Reached
            ) {
                count++;
            }
        }

        ProviderOrder[] memory fulfilledOrders = new ProviderOrder[](count);
        uint256 index = 0;
        for (uint256 i = 100; i < nextProviderOrderId; i++) {
            if (
                providerOrders[i].provider == _provider &&
                providerOrders[i].status == OrderStatus.Reached
            ) {
                fulfilledOrders[index] = providerOrders[i];
                index++;
            }
        }

        return fulfilledOrders;
    }

    function getProviderOrderByRFID(
        bytes32 _rfidUIDHash
    ) external view returns (uint256) {
        uint256 orderId = rfidToProviderOrderId[_rfidUIDHash];
        if (orderId == 0) {
            return 0;
        } else {
            return providerOrders[orderId].orderId;
        }
    }

    // STOCK FUNCTIONS

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


// Internal Helper Function for Distributor
function _distributorMedNameExists(
    address _user,
    string memory _medName
) internal view returns (bool) {
    string[] storage medNames = distributorMedNames[_user];
    for (uint256 i = 0; i < medNames.length; i++) {
        if (keccak256(bytes(medNames[i])) == keccak256(bytes(_medName))) {
            return true;
        }
    }
    return false;
}

// Internal Helper Function for Provider
function _providerMedNameExists(
    address _user,
    string memory _medName
) internal view returns (bool) {
    string[] storage medNames = providerMedNames[_user];
    for (uint256 i = 0; i < medNames.length; i++) {
        if (keccak256(bytes(medNames[i])) == keccak256(bytes(_medName))) {
            return true;
        }
    }
    return false;
}


}
