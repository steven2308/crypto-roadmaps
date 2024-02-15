// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {
    RMRKAbstractEquippable
} from "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";

error ContractURIFrozen();

abstract contract QuarterBase is RMRKAbstractEquippable {
    // Events
    /**
     * @notice From ERC4906 This event emits when the metadata of a token is changed.
     *  So that the third-party platforms such as NFT market could
     *  get notified when the metadata of a token is changed.
     */
    event MetadataUpdate(uint256 _tokenId);

    /**
     * @notice From ERC7572 (Draft) Emitted when the contract-level metadata is updated
     */
    event ContractURIUpdated();

    // Variables
    uint256 private _contractURIFrozen; // Cheaper than a bool
    uint256 private _seedBitShift;
    uint64[] private _validAssets;

    // Methods
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        _requireMinted(tokenId);
        // This will revert if the token has not assets, only use if at least an asset is assigned on mint to every token
        return getAssetMetadata(tokenId, _activeAssets[tokenId][0]);
    }

    /**
     * @notice Hook that is called after an asset is accepted to a token's active assets array.
     * @param tokenId ID of the token for which the asset has been accepted
     * @param index Index of the asset in the token's pending assets array
     * @param assetId ID of the asset expected to have been located at the specified index
     * @param replacedAssetId ID of the asset that has been replaced by the accepted asset
     */
    function _afterAcceptAsset(
        uint256 tokenId,
        uint256 index,
        uint64 assetId,
        uint64 replacedAssetId
    ) internal virtual override {
        index;
        assetId;
        if (replacedAssetId != 0) {
            emit MetadataUpdate(tokenId);
        }
    }

    function batchAddEquippableAssetEntries(
        string[] memory metadataURIs,
        uint64 equippableGroupId
    ) public virtual onlyOwnerOrContributor {
        uint256 length = metadataURIs.length;

        for (uint256 i; i < length; ) {
            unchecked {
                ++_totalAssets;
            }
            _addAssetEntry(
                uint64(_totalAssets),
                equippableGroupId,
                address(0),
                metadataURIs[i],
                new uint64[](0)
            );
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Used to mint a desired number of child tokens to a given parent token.
     * @dev The "data" value of the "_safeMint" method is set to an empty value.
     * @dev Can only be called while the open sale is open.
     * @param to Address of the collection smart contract of the token into which to mint the child token
     * @param destinationId ID of the token into which to mint the new child token
     * @return tokenId The ID of the first token to be minted in the current minting cycle
     * @return assetId The ID of the asset added to the token
     */
    function nestMintWithRandomAsset(
        address to,
        uint256 destinationId
    ) public onlyOwnerOrContributor returns (uint256 tokenId, uint64 assetId) {
        (tokenId, ) = _prepareMint(1);

        _nestMint(to, tokenId, destinationId, "");
        assetId = _validAssets[
            block.prevrandao >> _seedBitShift % _validAssets.length
        ];
        _addAssetToToken(tokenId, assetId, 0);
        // First asset is auto accepted
    }

    /**
     * @notice Used to get whether the contract-level metadata is frozen and cannot be further updated.
     * @return isFrozen Whether the contract-level metadata is frozen
     */
    function isContractURIFrozen() external view returns (bool isFrozen) {
        isFrozen = _contractURIFrozen == 1;
    }

    function getSeedBitShift() external view returns (uint256) {
        return _seedBitShift;
    }

    function getValidAssets() external view returns (uint64[] memory) {
        return _validAssets;
    }

    /**
     * @notice Freezes the contract-level metadata, so it cannot be further updated.
     */
    function freezeContractURI() external onlyOwner {
        _contractURIFrozen = 1;
    }

    /**
     * @notice Sets the contract-level metadata URI to a new value and emits an event.
     * @param contractURI_ The new contract-level metadata URI
     */
    function setContractURI(string memory contractURI_) external onlyOwner {
        if (_contractURIFrozen == 1) {
            revert ContractURIFrozen();
        }
        _contractURI = contractURI_;
        emit ContractURIUpdated();
    }

    function setSeedBitShift(uint256 seedBitShift_) external onlyOwner {
        _seedBitShift = seedBitShift_;
    }

    function setValidAssets(uint64[] memory validAssets) external onlyOwner {
        delete _validAssets;
        uint256 length = validAssets.length;
        for (uint256 i = 0; i < length; i++) {
            _validAssets.push(validAssets[i]);
        }
    }
}
