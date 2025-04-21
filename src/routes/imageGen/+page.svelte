<script lang="ts">
    import ImageGenerator from '../../lib/components/ImageGen.svelte';
    import MainNav from '$lib/components/MainNav.svelte';
	import Image from 'lucide-svelte/icons/image'
   </script>
   
   <svelte:head>
       <title>Generate AI Images | Future Image</title>
   </svelte:head>
   
   <main class="w-full bg-gradient-to-br from-gray-900 to-indigo-950 text-gray-100 min-h-screen">
    <MainNav />
    <div class="max-w-4xl mx-auto p-4 pt-8">
    <div class="mb-8">
        <div class="flex items-center mb-2">
            <div class="w-10 h-10 bg-violet-800 rounded-lg flex items-center justify-center mr-3">
                <Image class="w-5 h-5 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-white">AI Image
            Generation</h1>
        </div>
        <p class="text-gray-400 ml-[3.25rem]">
            Create stunning AI-generated images from text prompts using Flux-Schnell
        </p>
    </div>
       
       <ImageGenerator />
       
       <div class="mt-12 text-center">
           <a href="/images" class="text-primary-600 hover:underline">
               View your image collection
           </a>
       </div>
    </div>
   </main>