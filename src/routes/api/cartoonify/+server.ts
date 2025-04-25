import type { WeaviateClient } from 'weaviate-client'
import weaviate from 'weaviate-client'
import type { Actions, RequestEvent } from '@sveltejs/kit'
import fs from 'fs/promises'
import { json } from '@sveltejs/kit'
import { readFile } from 'fs/promises'
import path from 'path'
import Replicate from 'replicate'
import type { FileOutput } from "replicate";
import { REPLICATE_API_TOKEN } from '$env/static/private'
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
})

let client: WeaviateClient
async function connectToWeaviate(): Promise<WeaviateClient> {
    const clientPromise = weaviate.connectToLocal()
    return clientPromise
}

export const POST = async ({ request }: any) => {
    try {
        if (!client) {
            client = await connectToWeaviate()
        }

  const body = await request.json();
  const imagePath = `${body.originalImageUrl}`; 
  const fullPath = path.join(process.cwd(), "static", imagePath);
  const fileBuffer = await readFile(fullPath);


  const output = await replicate.run(
    "catacolabs/cartoonify:f109015d60170dfb20460f17da8cb863155823c85ece1115e1e9e4ec7ef51d3b",
    {
      input: {
        image: fileBuffer,
      }
    }
  )as FileOutput; 

const imageResponse = await fetch(output.url().href);
const arrayBuffer = await imageResponse.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const dirname = path.dirname(fullPath);               
  const basename = path.basename(fullPath);             
  const cartoonBasename = `cartoon-${basename}`;      
  const cartoonFullPath = path.join(dirname, cartoonBasename);

  await fs.mkdir(dirname, { recursive: true });
  await fs.writeFile(cartoonFullPath, Buffer.from(base64Data, "base64"));

  const imageId = crypto.randomUUID();

        return json({
            success: true,
            imageUrl: `/${cartoonBasename}`,
            imageId
        })
   
    } catch (error) {
        console.error('Error in refineImage action:', error)
        return {
            success: false,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error while refining image'}`
        }
    }


}
