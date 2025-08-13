// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    struct Certificate {
        string ipfsHash;   // IPFS CID of the certificate file
        string fileHash;   // SHA256 hash of the file content
        address issuer;    // Address that issued the certificate
        uint256 issueDate; // Block timestamp
    }

    mapping(string => Certificate) public certificates;

    event CertificateAdded(string fileHash, string ipfsHash, address issuer);

    function storeCertificate(string memory fileHash, string memory ipfsHash) public {
        require(bytes(certificates[fileHash].ipfsHash).length == 0, "Certificate already exists");
        certificates[fileHash] = Certificate(ipfsHash, fileHash, msg.sender, block.timestamp);
        emit CertificateAdded(fileHash, ipfsHash, msg.sender);
    }

    function verifyCertificate(string memory fileHash) public view returns (bool) {
        return bytes(certificates[fileHash].ipfsHash).length > 0;
    }
}
