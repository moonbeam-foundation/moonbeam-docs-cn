pragma solidity ^0.7.0;

contract Hash256 {
    bytes32 public expectedHash =
        0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069;

    function calculateHash() internal pure returns (bytes32) {
        string memory word = "Hello World!";
        bytes32 hash = sha256(bytes(word));

        return hash;
    }

    function checkHash() public view returns (bool) {
        return (calculateHash() == expectedHash);
    }
}
