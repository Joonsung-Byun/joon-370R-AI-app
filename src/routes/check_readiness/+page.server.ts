import weaviate from 'weaviate-client';
import type { WeaviateClient } from 'weaviate-client';
import type {PageServerLoad} from './$types';

let client: WeaviateClient;


export const load: PageServerLoad = async () => {
    // To connectToLocal, I need to run the container with the docker-compose file
    client = await weaviate.connectToLocal();
    const clientReadiness = await client.isReady();

    client.close();

    return {
        ready: clientReadiness
    }
}