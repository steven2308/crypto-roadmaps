import { ethers } from 'hardhat';

export const BASE_METADATA_URI = 'ipfs://QmRJ3TadbE9hbQvF677F6V4GdqrqiEtugrjeu491iRUgZW';

export const Q1_BOX_COLLECTION_METADATA = `${BASE_METADATA_URI}/q1_box/metadata.json`;
export const Q2_BOX_COLLECTION_METADATA = `${BASE_METADATA_URI}/q2_box/metadata.json`;
export const Q3_BOX_COLLECTION_METADATA = `${BASE_METADATA_URI}/q3_box/metadata.json`;
export const Q4_BOX_COLLECTION_METADATA = `${BASE_METADATA_URI}/q4_box/metadata.json`;

export const Q1_TEXT_COLLECTION_METADATA = `${BASE_METADATA_URI}/q1_text/metadata.json`;
export const Q2_TEXT_COLLECTION_METADATA = `${BASE_METADATA_URI}/q2_text/metadata.json`;
export const Q3_TEXT_COLLECTION_METADATA = `${BASE_METADATA_URI}/q3_text/metadata.json`;
export const Q4_TEXT_COLLECTION_METADATA = `${BASE_METADATA_URI}/q4_text/metadata.json`;

export const Q1_BOX_BASE_URI = `${BASE_METADATA_URI}/q1_box/assets/`;
export const Q2_BOX_BASE_URI = `${BASE_METADATA_URI}/q2_box/assets/`;
export const Q3_BOX_BASE_URI = `${BASE_METADATA_URI}/q3_box/assets/`;
export const Q4_BOX_BASE_URI = `${BASE_METADATA_URI}/q4_box/assets/`;

export const Q1_TEXT_BASE_URI = `${BASE_METADATA_URI}/q1_text/assets/`;
export const Q2_TEXT_BASE_URI = `${BASE_METADATA_URI}/q2_text/assets/`;
export const Q3_TEXT_BASE_URI = `${BASE_METADATA_URI}/q3_text/assets/`;
export const Q4_TEXT_BASE_URI = `${BASE_METADATA_URI}/q4_text/assets/`;

export const MAIN_ROADMAP_ASSET_METADATA_URI = `${BASE_METADATA_URI}/roadmap/assets/main.json`;

export const CATALOG_METADATA_URI = `${BASE_METADATA_URI}/catalog/metadata.json`;
export const CATALOG_TYPE = 'image/png';

export const TOTAL_ASSETS_PER_CHILDREN_COLLECTION = 5;

export const PARENT_EQUIPPABLE_GROUP_ID = 1; // Only useful if we decide to make parents equippable into something

export const Q1_BOX_SLOT_ID = 1001;
export const Q2_BOX_SLOT_ID = 1002;
export const Q3_BOX_SLOT_ID = 1003;
export const Q4_BOX_SLOT_ID = 1004;

export const Q1_TEXT_SLOT_ID = 1005;
export const Q2_TEXT_SLOT_ID = 1006;
export const Q3_TEXT_SLOT_ID = 1007;
export const Q4_TEXT_SLOT_ID = 1008;

export const Q1_BOX_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q1_box.json`;
export const Q2_BOX_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q2_box.json`;
export const Q3_BOX_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q3_box.json`;
export const Q4_BOX_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q4_box.json`;
export const Q1_TEXT_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q1_text.json`;
export const Q2_TEXT_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q2_text.json`;
export const Q3_TEXT_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q3_text.json`;
export const Q4_TEXT_SLOT_METADATA = `${BASE_METADATA_URI}/catalog/q4_text.json`;

export const BOX_Z_INDEX = 2n;
export const TEXT_Z_INDEX = 4n;

export const MAX_SUPPLY_PARENT = 1111;
export const MAX_SUPPLY_BOXES = MAX_SUPPLY_PARENT * 4;
export const MAX_SUPPLY_TEXTS = MAX_SUPPLY_PARENT * 4;
export const BENEFICIARY = ''; // Multisig
export const ROYALTIES_BPS = 500; // 5%
export const MINT_PRICE = ethers.parseEther('0.005'); // In BNB, about $14 at the time

// PART TYPES (Defined by standard)
export const PART_TYPE_SLOT = 1n;
export const PART_TYPE_FIXED = 2n;
