import { ethers, run, network } from 'hardhat';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import {
  QuarterBoxes,
  QuarterTexts,
  RMRKBulkWriter,
  RMRKCatalogImpl,
  RMRKCatalogUtils,
  RMRKCollectionUtils,
  RMRKEquipRenderUtils,
  Roadmap,
} from '../typechain-types';
import * as C from './constants';

export async function deployRoadmap(): Promise<Roadmap> {
  console.log(`Deploying Roadmap to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('Roadmap');
  const args = [
    'ipfs://TODO/collection',
    1111n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: Roadmap = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`Roadmap deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/Roadmap.sol:Roadmap',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function deployQuarterBoxes(): Promise<QuarterBoxes> {
  console.log(`Deploying QuarterBoxes to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('QuarterBoxes');
  const args = [
    'ipfs://TODO/collection',
    1111n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: QuarterBoxes = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`QuarterBoxes deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/QuarterBoxes.sol:QuarterBoxes',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function deployQuarterTexts(): Promise<QuarterTexts> {
  console.log(`Deploying QuarterTexts to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory('QuarterTexts');
  const args = [
    'ipfs://TODO/collection',
    1111n,
    (await ethers.getSigners())[0].address,
    300,
  ] as const;

  const contract: QuarterTexts = await contractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`QuarterTexts deployed to ${contractAddress}.`);

  if (!isHardhatNetwork()) {
    console.log('Waiting 10 seconds before verifying contract...');
    await delay(10000);
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
      contract: 'contracts/QuarterTexts.sol:QuarterTexts',
    });

    // Only do on testing, or if whitelisted for production
    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');
  }
  return contract;
}

export async function deployBulkWriter(): Promise<RMRKBulkWriter> {
  const bulkWriterFactory = await ethers.getContractFactory('RMRKBulkWriter');
  const bulkWriter = await bulkWriterFactory.deploy();
  await bulkWriter.waitForDeployment();
  const bulkWriterAddress = await bulkWriter.getAddress();
  console.log('Bulk Writer deployed to:', bulkWriterAddress);

  await verifyIfNotHardhat(bulkWriterAddress);
  return bulkWriter;
}

export async function deployCatalogUtils(): Promise<RMRKCatalogUtils> {
  const catalogUtilsFactory = await ethers.getContractFactory('RMRKCatalogUtils');
  const catalogUtils = await catalogUtilsFactory.deploy();
  await catalogUtils.waitForDeployment();
  const catalogUtilsAddress = await catalogUtils.getAddress();
  console.log('Catalog Utils deployed to:', catalogUtilsAddress);

  await verifyIfNotHardhat(catalogUtilsAddress);
  return catalogUtils;
}

export async function deployCollectionUtils(): Promise<RMRKCollectionUtils> {
  const collectionUtilsFactory = await ethers.getContractFactory('RMRKCollectionUtils');
  const collectionUtils = await collectionUtilsFactory.deploy();
  await collectionUtils.waitForDeployment();
  const collectionUtilsAddress = await collectionUtils.getAddress();
  console.log('Collection Utils deployed to:', collectionUtilsAddress);

  await verifyIfNotHardhat(collectionUtilsAddress);
  return collectionUtils;
}

export async function deployRenderUtils(): Promise<RMRKEquipRenderUtils> {
  const renderUtilsFactory = await ethers.getContractFactory('RMRKEquipRenderUtils');
  const renderUtils = await renderUtilsFactory.deploy();
  await renderUtils.waitForDeployment();
  const renderUtilsAddress = await renderUtils.getAddress();
  console.log('Equip Render Utils deployed to:', renderUtilsAddress);

  await verifyIfNotHardhat(renderUtilsAddress);
  return renderUtils;
}

export async function deployCatalog(
  catalogMetadataUri: string,
  catalogType: string,
): Promise<RMRKCatalogImpl> {
  const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog = await catalogFactory.deploy(catalogMetadataUri, catalogType);
  await catalog.waitForDeployment();
  const catalogAddress = await catalog.getAddress();
  console.log('Catalog deployed to:', catalogAddress);

  await verifyIfNotHardhat(catalogAddress, [catalogMetadataUri, catalogType]);
  return catalog;
}

async function verifyIfNotHardhat(contractAddress: string, args: any[] = []) {
  if (isHardhatNetwork()) {
    // Hardhat
    return;
  }

  // sleep 20s
  await delay(20000);

  console.log('Etherscan contract verification starting now.');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    // probably already verified
  }
}

export async function configureQuarterBoxesAssets(boxes: QuarterBoxes, roadmap: Roadmap) {
  console.log('Configuring QuarterBoxes...');
  const q1_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => i + 1,
  );
  const q2_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION + i + 1,
  );
  const q3_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION * 2 + i + 1,
  );
  const q4_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION * 3 + i + 1,
  );

  const q1_assets = q1_asset_ids.map((id) => `${C.Q1_BOX_BASE_URI}${id}.json`);
  const q2_assets = q2_asset_ids.map((id) => `${C.Q2_BOX_BASE_URI}${id}.json`);
  const q3_assets = q3_asset_ids.map((id) => `${C.Q3_BOX_BASE_URI}${id}.json`);
  const q4_assets = q4_asset_ids.map((id) => `${C.Q4_BOX_BASE_URI}${id}.json`);

  let tx = await boxes.batchAddEquippableAssetEntries(q1_assets, C.Q1_BOX_SLOT_ID);
  await tx.wait();
  tx = await boxes.batchAddEquippableAssetEntries(q2_assets, C.Q2_BOX_SLOT_ID);
  await tx.wait();
  tx = await boxes.batchAddEquippableAssetEntries(q3_assets, C.Q3_BOX_SLOT_ID);
  await tx.wait();
  tx = await boxes.batchAddEquippableAssetEntries(q4_assets, C.Q4_BOX_SLOT_ID);
  await tx.wait();
  console.log('Assets added to boxes for each quarter.');

  tx = await boxes.setValidAssets(q1_asset_ids, 1);
  await tx.wait();
  tx = await boxes.setValidAssets(q2_asset_ids, 1);
  await tx.wait();
  tx = await boxes.setValidAssets(q3_asset_ids, 1);
  await tx.wait();
  tx = await boxes.setValidAssets(q4_asset_ids, 1);
  await tx.wait();
  console.log('Assets set as valid for each quarter.');

  tx = await boxes.setValidParentForEquippableGroup(
    C.Q1_BOX_SLOT_ID,
    await roadmap.getAddress(),
    C.Q1_BOX_SLOT_ID,
  );
  await tx.wait();
  tx = await boxes.setValidParentForEquippableGroup(
    C.Q2_BOX_SLOT_ID,
    await roadmap.getAddress(),
    C.Q2_BOX_SLOT_ID,
  );
  await tx.wait();
  tx = await boxes.setValidParentForEquippableGroup(
    C.Q3_BOX_SLOT_ID,
    await roadmap.getAddress(),
    C.Q3_BOX_SLOT_ID,
  );
  await tx.wait();
  tx = await boxes.setValidParentForEquippableGroup(
    C.Q4_BOX_SLOT_ID,
    await roadmap.getAddress(),
    C.Q4_BOX_SLOT_ID,
  );
  await tx.wait();
  console.log('Parents set as valid for each quarter.');

  console.log('QuarterBoxes configured.');
}

export async function configureQuarterTextsAssets(texts: QuarterTexts, roadmap: Roadmap) {
  console.log('Configuring QuarterTexts...');
  const q1_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => i + 1,
  );
  const q2_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION + i + 1,
  );
  const q3_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION * 2 + i + 1,
  );
  const q4_asset_ids = Array.from(
    { length: C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION },
    (_, i) => C.TOTAL_ASSETS_PER_CHILDREN_COLLECTION * 3 + i + 1,
  );

  const q1_assets = q1_asset_ids.map((id) => `${C.Q1_TEXT_BASE_URI}${id}.json`);
  const q2_assets = q2_asset_ids.map((id) => `${C.Q2_TEXT_BASE_URI}${id}.json`);
  const q3_assets = q3_asset_ids.map((id) => `${C.Q3_TEXT_BASE_URI}${id}.json`);
  const q4_assets = q4_asset_ids.map((id) => `${C.Q4_TEXT_BASE_URI}${id}.json`);

  let tx = await texts.batchAddEquippableAssetEntries(q1_assets, C.Q1_TEXT_SLOT_ID);
  await tx.wait();
  tx = await texts.batchAddEquippableAssetEntries(q2_assets, C.Q2_TEXT_SLOT_ID);
  await tx.wait();
  tx = await texts.batchAddEquippableAssetEntries(q3_assets, C.Q3_TEXT_SLOT_ID);
  await tx.wait();
  tx = await texts.batchAddEquippableAssetEntries(q4_assets, C.Q4_TEXT_SLOT_ID);
  await tx.wait();
  console.log('Assets added to texts for each quarter.');

  tx = await texts.setValidAssets(q1_asset_ids, 1);
  await tx.wait();
  tx = await texts.setValidAssets(q2_asset_ids, 1);
  await tx.wait();
  tx = await texts.setValidAssets(q3_asset_ids, 1);
  await tx.wait();
  tx = await texts.setValidAssets(q4_asset_ids, 1);
  await tx.wait();
  console.log('Assets set as valid for each quarter.');

  tx = await texts.setValidParentForEquippableGroup(
    C.Q1_TEXT_SLOT_ID,
    await roadmap.getAddress(),
    C.Q1_TEXT_SLOT_ID,
  );
  await tx.wait();
  tx = await texts.setValidParentForEquippableGroup(
    C.Q2_TEXT_SLOT_ID,
    await roadmap.getAddress(),
    C.Q2_TEXT_SLOT_ID,
  );
  await tx.wait();
  tx = await texts.setValidParentForEquippableGroup(
    C.Q3_TEXT_SLOT_ID,
    await roadmap.getAddress(),
    C.Q3_TEXT_SLOT_ID,
  );
  await tx.wait();
  tx = await texts.setValidParentForEquippableGroup(
    C.Q4_TEXT_SLOT_ID,
    await roadmap.getAddress(),
    C.Q4_TEXT_SLOT_ID,
  );
  await tx.wait();
  console.log('Parents set as valid for each quarter.');

  console.log('QuarterTexts configured.');
}

export async function configureCatalog(
  boxesAddress: string,
  textsAddress: string,
  catalog: RMRKCatalogImpl,
) {
  console.log('Configuring Catalog...');
  const tx = await catalog.addPartList([
    {
      partId: C.Q1_BOX_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [boxesAddress],
        metadataURI: C.Q1_BOX_SLOT_METADATA,
      },
    },
    {
      partId: C.Q2_BOX_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [boxesAddress],
        metadataURI: C.Q2_BOX_SLOT_METADATA,
      },
    },
    {
      partId: C.Q3_BOX_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [boxesAddress],
        metadataURI: C.Q3_BOX_SLOT_METADATA,
      },
    },
    {
      partId: C.Q4_BOX_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [boxesAddress],
        metadataURI: C.Q4_BOX_SLOT_METADATA,
      },
    },
    {
      partId: C.Q1_TEXT_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [textsAddress],
        metadataURI: C.Q1_TEXT_SLOT_METADATA,
      },
    },
    {
      partId: C.Q2_TEXT_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [textsAddress],
        metadataURI: C.Q2_TEXT_SLOT_METADATA,
      },
    },
    {
      partId: C.Q3_TEXT_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [textsAddress],
        metadataURI: C.Q3_TEXT_SLOT_METADATA,
      },
    },
    {
      partId: C.Q4_TEXT_SLOT_ID,
      part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.BOX_Z_INDEX,
        equippable: [textsAddress],
        metadataURI: C.Q4_TEXT_SLOT_METADATA,
      },
    },
  ]);
  await tx.wait();
  console.log('Catalog configured.');
}

export async function addRoadMapAsset(roadmap: Roadmap, catalogAddress: string) {
  console.log('Adding Roadmap asset...');
  const tx = await roadmap.addEquippableAssetEntry(
    C.PARENT_EQUIPPABLE_GROUP_ID,
    catalogAddress,
    C.MAIN_ROADMAP_ASSET_METADATA_URI,
    [
      C.Q1_BOX_SLOT_ID,
      C.Q2_BOX_SLOT_ID,
      C.Q3_BOX_SLOT_ID,
      C.Q4_BOX_SLOT_ID,
      C.Q1_TEXT_SLOT_ID,
      C.Q2_TEXT_SLOT_ID,
      C.Q3_TEXT_SLOT_ID,
      C.Q4_TEXT_SLOT_ID,
    ],
  );
  await tx.wait();
  console.log('Roadmap asset added.');
}
