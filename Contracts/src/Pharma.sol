// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Pharma {
    address public owner;

    mapping(address => bool) public isManufacturer;
    mapping(address => bool) public isDistributor;
    mapping(address => bool) public isProvider;
    mapping(string => Medicine) public medicines;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyManufacturer() {
        require(
            isManufacturer[msg.sender],
            "Only manufacturers can call this function"
        );
        _;
    }

    modifier onlyDistributor() {
        require(
            isDistributor[msg.sender],
            "Only distributors can call this function"
        );
        _;
    }

    modifier onlyProvider() {
        require(
            isProvider[msg.sender],
            "Only providers can call this function"
        );
        _;
    }

    struct Medicine {
        string name;
        string batchInfo;
        string manufacturingDetails;
        string distributionHistory;
        uint256 expiryDate;
        uint256 manufacturingDate;
        bool temperatureSensitive;
        int256[] temperatureData;
        bool transportConditionMet;
        bool recalled;
        bool RFIDRegistered;
        string[] RFIDInfo;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerManufacturer() external {
        isManufacturer[msg.sender] = true;
    }

    function registerDistributor() external {
        isDistributor[msg.sender] = true;
    }

    function registerProvider() external {
        isProvider[msg.sender] = true;
    }

    function addMedicine(
        string memory _name,
        string memory _batchInfo,
        string memory _manufacturingDetails,
        string memory _distributionHistory,
        uint256 _expiryDate,
        uint256 _manufacturingDate,
        bool _temperatureSensitive
    ) external onlyManufacturer {
        medicines[_batchInfo] = Medicine({
            name: _name,
            batchInfo: _batchInfo,
            manufacturingDetails: _manufacturingDetails,
            distributionHistory: _distributionHistory,
            expiryDate: _expiryDate,
            manufacturingDate: _manufacturingDate,
            temperatureSensitive: _temperatureSensitive,
            temperatureData: new int256[](0),
            transportConditionMet: false,
            recalled: false,
            RFIDRegistered: false,
            RFIDInfo: new string[](0)
        });
    }

    function addTemperatureData(
        string memory _batchInfo,
        int256 _temperature
    ) external onlyDistributor {
        medicines[_batchInfo].temperatureData.push(_temperature);
    }

    function recallMedicine(
        string memory _batchInfo
    ) external onlyManufacturer {
        require(
            bytes(medicines[_batchInfo].batchInfo).length != 0,
            "Medicine batch not found"
        );
        medicines[_batchInfo].recalled = true;
    }

    function trackMedicine(
        string memory _batchInfo
    ) external view returns (string memory) {
        require(
            bytes(medicines[_batchInfo].batchInfo).length != 0,
            "Medicine batch not found"
        );
        return medicines[_batchInfo].distributionHistory;
    }

    function verifyRFID(
        string memory _batchInfo,
        string memory _RFIDInfo
    ) external view returns (bool) {
        require(
            bytes(medicines[_batchInfo].batchInfo).length != 0,
            "Medicine batch not found"
        );
        for (uint i = 0; i < medicines[_batchInfo].RFIDInfo.length; i++) {
            if (
                keccak256(bytes(medicines[_batchInfo].RFIDInfo[i])) ==
                keccak256(bytes(_RFIDInfo))
            ) {
                return true;
            }
        }
        return false;
    }

    function registerRFID(
        string memory _batchInfo,
        string memory _RFIDInfo
    ) external onlyManufacturer {
        require(
            bytes(medicines[_batchInfo].batchInfo).length != 0,
            "Medicine batch not found"
        );
        medicines[_batchInfo].RFIDRegistered = true;
        medicines[_batchInfo].RFIDInfo.push(_RFIDInfo);
    }

    function checkMedicineAvailability(
        string memory _batchInfo
    ) external view returns (bool) {
        require(
            bytes(medicines[_batchInfo].batchInfo).length != 0,
            "Medicine batch not found"
        );
        // Pending Logic: based on distribution history
        return true;
    }

    function placeOrderForMedicine(
        string memory _batchInfo
    ) external view onlyProvider {
        require(
            bytes(medicines[_batchInfo].batchInfo).length != 0,
            "Medicine batch not found"
        );
        // Pending Logic: update distribution history
    }
}
