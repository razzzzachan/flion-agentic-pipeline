import { runDataCloudAgentsDemo } from "../src/data-cloud-demo.mjs";

const result = await runDataCloudAgentsDemo();

console.log(JSON.stringify({
  title: result.title,
  dataset: result.dataset,
  finalStage: result.finalWorkItem.stage,
  verification: result.verification,
  releaseNote: result.finalWorkItem.evidence.release.releaseNote.value,
}, null, 2));
