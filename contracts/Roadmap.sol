// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {
    RMRKAbstractEquippable
} from "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";
import {
    RMRKImplementationBase
} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKImplementationBase.sol";
import {IMintWithRandomAsset} from "./interfaces/IMintWithRandomAsset.sol";

error ContractURIFrozen();

contract Roadmap is RMRKAbstractEquippable {
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

    struct EquippableChildConfig {
        address childAddress;
        uint8 slotPartId;
    }

    // struct IntakeEquip {
    //     uint256 tokenId;
    //     uint256 childIndex;
    //     uint64 assetId;
    //     uint64 slotPartId;
    //     uint64 childAssetId;
    // }

    // Variables
    mapping(address => bool) private _autoAcceptCollection;
    uint256 private _contractURIFrozen; // Cheaper than a bool
    uint64 private _mainAssetId = 1; // TODO make constant or updatable
    EquippableChildConfig[] private _equippableChildConfig;

    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyPercentageBps
    )
        RMRKImplementationBase(
            "Roadmap",
            "RMP",
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
    {}

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

    // Suggested Mint Functions
    /**
     * @notice Used to mint the desired number of tokens to the specified address.
     * @dev The data value of the _safeMint method is set to an empty value.
     * @dev Can only be called while the open sale is open.
     * @param to Address to which to mint the token
     * @param numToMint Number of tokens to mint
     * @return The ID of the first token to be minted in the current minting cycle
     */
    function mint(
        address to,
        uint256 numToMint
    ) public onlyOwnerOrContributor returns (uint256) {
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(
            numToMint
        );

        for (uint256 i = nextToken; i < totalSupplyOffset; ) {
            _safeMint(to, i, "");
            _mintAndEquipChildren(i);
            unchecked {
                ++i;
            }
        }

        return nextToken;
    }

    function _mintAndEquipChildren(uint256 tokenId) internal {
        uint256 length = _equippableChildConfig.length;
        for (uint256 i; i < length; ) {
            EquippableChildConfig memory config = _equippableChildConfig[i];
            (, uint64 childAssetId) = IMintWithRandomAsset(config.childAddress)
                .nestMintWithRandomAsset(address(this), tokenId);
            IntakeEquip memory intakeEquip = IntakeEquip({
                tokenId: tokenId,
                childIndex: i,
                assetId: _mainAssetId,
                slotPartId: config.slotPartId,
                childAssetId: childAssetId
            });
            _equip(intakeEquip);
            unchecked {
                ++i;
            }
        }
    }

    function setAutoAcceptCollection(
        address collection,
        bool autoAccept
    ) public virtual onlyOwner {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal virtual override {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(
                tokenId,
                _pendingChildren[tokenId].length - 1,
                childAddress,
                childId
            );
        }
    }

    function lockSupply() external onlyOwner {
        _maxSupply = _totalSupply;
    }

    /**
     * @notice Used to get whether the contract-level metadata is frozen and cannot be further updated.
     * @return isFrozen Whether the contract-level metadata is frozen
     */
    function isContractURIFrozen() external view returns (bool isFrozen) {
        isFrozen = _contractURIFrozen == 1;
    }

    function getEquippableChildConfig()
        external
        view
        returns (EquippableChildConfig[] memory config)
    {
        config = _equippableChildConfig;
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

    function setEquipmentChildConfig(
        EquippableChildConfig[] memory equippableChildConfig
    ) external onlyOwner {
        delete _equippableChildConfig;
        uint256 length = equippableChildConfig.length;
        for (uint256 i; i < length; ) {
            _equippableChildConfig.push(equippableChildConfig[i]);
            unchecked {
                ++i;
            }
        }
    }
}
