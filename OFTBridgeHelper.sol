// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOFT {
    function quoteSend(
        uint32 dstEid,
        bytes32 to,
        uint256 amount,
        bytes calldata options
    ) external view returns (uint256 nativeFee, uint256 zroFee);

    function send(
        uint32 dstEid,
        bytes32 to,
        uint256 amount,
        bytes calldata options
    ) external payable;
}

contract OFTBridgeHelper {
    IOFT public immutable oft;

    uint32 public constant EID_BSC = 30102;
    uint32 public constant EID_ETH = 30101;
    uint32 public constant EID_0G  = 30388;

    constructor(address _oft) {
        oft = IOFT(_oft);
    }

    function evmToBytes32(address a) public pure returns (bytes32) {
        return bytes32(uint256(uint160(a)));
    }

    function quote(
        uint32 dstEid,
        address to,
        uint256 amount,
        bytes calldata options
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return oft.quoteSend(dstEid, evmToBytes32(to), amount, options);
    }

    function bridge(
        uint32 dstEid,
        address to,
        uint256 amount,
        bytes calldata options
    ) external payable {
        oft.send{value: msg.value}(dstEid, evmToBytes32(to), amount, options);
    }

    function bridgeBscTo0G(address to, uint256 amount) external payable {
        bytes memory options = hex"";
        oft.send{value: msg.value}(EID_0G, evmToBytes32(to), amount, options);
    }

    function bridge0GToBsc(address to, uint256 amount) external payable {
        bytes memory options = hex"";
        oft.send{value: msg.value}(EID_BSC, evmToBytes32(to), amount, options);
    }
}
