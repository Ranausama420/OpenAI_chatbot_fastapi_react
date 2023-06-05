import { PineconeClient } from '@pinecone-database/pinecone';

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: "asia-southeast1-gcp-free", //this is in the dashboard
        apiKey: "ea9bd77f-ec5b-4b4f-9e47-ecbb72c0c7cf",
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

export const pinecone = await initPinecone();
