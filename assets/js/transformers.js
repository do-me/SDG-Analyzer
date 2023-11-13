import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';

let pipe
async function allocatePipeline() {
  pipe = await pipeline("embeddings", "Xenova/jina-embeddings-v2-base-en");
}

allocatePipeline();