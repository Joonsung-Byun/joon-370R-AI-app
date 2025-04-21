<script lang="ts">
        import Paperclip from 'lucide-svelte/icons/paperclip';
    import Image from 'lucide-svelte/icons/image';
    import MessageSquare from 'lucide-svelte/icons/message-square';
    import Search from 'lucide-svelte/icons/search';
    import DynamicIcon from '$lib/components/DynamicIcon.svelte';
const features = [
    { icon: MessageSquare, title: "AI RAG Chatbot", desc: "Chat with your documents using advanced retrieval" },
    { icon: Image, title: "Image Vector Embedding", desc: "Create intelligent vector representations of images" },
    { icon: Search, title: "Image Vector Search", desc: "Find similar images with vector-based search" },
    { icon: Paperclip, title: "AI Image Generation", desc: "Create stunning images with AI" }
];

</script>

{#each features as feature}
<div class="rounded-xl p-6 transition-all duration-300 hover:-translate-y-2 h-full cursor-pointer bg-gray-800">
    <DynamicIcon 
        icon={feature.icon} 
        className="w-10 h-10 mb-4 text-violet-400" 
    />
    <h3 class="text-xl font-semibold mb-2 text-white">
        {feature.title}
    </h3>
    <p class="text-gray-300">
        {feature.desc}
    </p>
</div>
{/each}