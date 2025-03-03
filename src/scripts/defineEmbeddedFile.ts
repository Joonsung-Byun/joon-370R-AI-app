import weaviate, { dataType, type WeaviateClient, type Collection } from 'weaviate-client'

let client: WeaviateClient

async function connectToWeaviate() : Promise<WeaviateClient> {
    const clientPromise = weaviate.connectToLocal()
	return clientPromise;
}

const embeddedFileSchema = {
    name: 'Chunks',
    description: 'Relevant chunks of text from selected PDF files',
    vectorizers: weaviate.configure.vectorizer.text2VecOllama({
        model: 'nomic-embed-text',
        apiEndpoint: 'http://host.docker.internal:11434'
    }),
    generative: weaviate.configure.generative.ollama({
        model: 'llama3.2',
        apiEndpoint: 'http://host.docker.internal:11434'
    }),
    properties: [
        {
            name: 'chunk_text',
            dataType: dataType.TEXT
        },
        {
            name: 'file_name',
            dataType: dataType.TEXT
        },
        {
            name: 'metadata',
            dataType: dataType.OBJECT,
            nestedProperties: [
                {
                    name: 'totalPages',
                    dataType: dataType.INT
                },
                {
                    name: 'pageNumberLocation',
                    dataType: dataType.INT
                },
                {
                    name: 'chunkIndex',
                    dataType: dataType.INT
                }
            ]
        }
    ]
} //weaviate에 들어갈 데이터 형식 (Schema) 정의

async function addCollection() {
    try {
        await client.collections.create(embeddedFileSchema)
        console.log('Added the Chunks collection')
    } catch (err) {
        console.error('Failed to add the Chunks collection')
    }
} // embeddedFileSchema로 정의한 데이터 형식을 Weaviate volume에 추가가


async function getCollectionCount(collectionName: string){
    try {
        const collection = client.collections.get(collectionName)
        let count = 0
        for await (const _ of collection.iterator()) {
            count++
        }

        console.log(`The ${collectionName} collection has ${count} items`)
    } catch (err) {
        console.error(`Failed to get the count of the ${collectionName} collection`)
    }
} // Weaviate volume에 있는 데이터의 수를 세는 함수

async function run() {
    const startTime: Date = new Date()

    client = await connectToWeaviate()

    //  await addCollection()
    // await client.collections.delete('Chunks')
    // await getCollectionCount('Chunks')

//     const myCollection = client.collections.get('Chunks')

// const response = await myCollection.data.deleteMany(
//   myCollection.filter.byProperty('file_name').like('Joonsun_Byun-Resume (1).pdf')
// )

// console.log(JSON.stringify(response))

    const endTime: Date = new Date()
    const elapsedTime: number = endTime.getTime() - startTime.getTime();
	const elapsedTimeSeconds: number = elapsedTime / 1000;
	const elapsedTimeMinutes: number = elapsedTimeSeconds / 60;

	console.log(
		`Total running time: ${elapsedTimeSeconds} seconds or ${elapsedTimeMinutes} minutes.`
	);
}

await run()