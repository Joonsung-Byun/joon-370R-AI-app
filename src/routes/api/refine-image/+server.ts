import type { WeaviateClient } from 'weaviate-client'
import weaviate from 'weaviate-client'
import type { Actions, RequestEvent } from '@sveltejs/kit'
import fs from 'fs/promises'
import { json } from '@sveltejs/kit'
import { readFile } from 'fs/promises'
import path from 'path'
import Replicate from 'replicate'
import type { FileOutput } from "replicate";

const replicate = new Replicate({
    auth: "r8_7Csc2pnmDFm63pLuFAmhRMK4s6ulcZU21HsZr",
});

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
  
  console.log('fileBuffer start', new Date().toISOString())
  const raw = await replicate.run(
    "catacolabs/cartoonify:043a7a0bb103cd8ce5c63e64161eae63a99f01028b83aa1e28e53a42d86191d3",
    { input: { image: fileBuffer } }
  ) as FileOutput;
  console.log('fileBuffer done', new Date().toISOString())
  const imageResponse = await fetch(raw.url());
  console.log(1)
  const arrayBuffer = await imageResponse.arrayBuffer();
    console.log(2)
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
    console.log(3)

  const dirname = path.dirname(fullPath);               
  const basename = path.basename(fullPath);             
  const cartoonBasename = `cartoon${basename}`;     
  console.log(4)    
  const cartoonFullPath = path.join(dirname, cartoonBasename);

  await fs.mkdir(dirname, { recursive: true });
    console.log(5)
  await fs.writeFile(cartoonFullPath, Buffer.from(base64Data, "base64"));
    console.log(6)

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
