import { deployRoadmap, deployQuarterBoxes, deployQuarterTexts } from './deploy-methods';

async function main() {
  await deployRoadmap();
  await deployQuarterBoxes();
  await deployQuarterTexts();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
