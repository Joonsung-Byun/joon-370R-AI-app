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

        console.log(body.refinementPrompt)

  const input = {
    steps: 50,
    prompt: body.refinementPrompt,
    guidance: 7,
    control_image: fileBuffer,
    output_format: "jpg",
    safety_tolerance: 2,
    prompt_upsampling: false
  };
  const output = await replicate.run("black-forest-labs/flux-depth-pro", { input }) as FileOutput;

  console.log(output.url().href);

  const imageResponse = await fetch(output.url());

    const arrayBuffer = await imageResponse.arrayBuffer();

  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const dirname = path.dirname(fullPath);               
  const basename = path.basename(fullPath);             
  const refineBasename = `refine-${basename}`;      
  const cartoonFullPath = path.join(dirname, refineBasename);

  await fs.mkdir(dirname, { recursive: true });
  await fs.writeFile(cartoonFullPath, Buffer.from(base64Data, "base64"));

  const imageId = crypto.randomUUID();

        return json({
            success: true,
            imageUrl: `/${refineBasename}`,
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
