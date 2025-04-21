
<script lang="ts">
    import DynamicIcon from "./DynamicIcon.svelte";
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    import Paperclip from 'lucide-svelte/icons/paperclip';
    import Image from 'lucide-svelte/icons/image';
    import MessageSquare from 'lucide-svelte/icons/message-square';
    import Search from 'lucide-svelte/icons/search';

    
    const routes = [
        { name: "AI RAG Chatbot", href: "/chat", icon: MessageSquare },
        { name: "Image Vector Embedding", href: "/images", icon: Image },
        { name: "Image Vector Search", href: "/search", icon: Search },
        { name: "AI Image Generation", href: "/imageGen", icon: Paperclip }
    ];
</script>

<div class="container mx-auto px-4 w-full border-b border-gray-800">
    <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-2">
            <a class="font-bold text-xl text-white" href="/">
                AI Application
            </a>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
            {#each routes as route}
                <a 
                    href={route.href} 
                    class="relative group"
                >
                    <span 
                        class="transition-colors duration-300 flex items-center text-gray-200 hover:text-violet-400"
                    >
                        <DynamicIcon 
                            icon={route.icon} 
                            className="w-4 h-4 mr-2" 
                        />
                        {route.name}
                    </span>
                    <span 
                        class="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all duration-300 group-hover:w-full"
                    ></span>
                </a>
            {/each}
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
            <button 
                onclick={toggleMobileMenu}
                class="p-2 rounded-md text-white"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>
        </div>
    </div>
    
    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
        <div 
            class="md:hidden py-4 px-2 rounded-lg mb-4 transition-all duration-300 z-50 bg-gray-800"
        >
            <div class="flex flex-col space-y-4">
                {#each routes as route}
                    <a 
                        href={route.href} 
                        class="flex items-center p-2 rounded-md transition-colors duration-300 text-gray-200 hover:bg-gray-700"
                    >
                        <DynamicIcon 
                            icon={route.icon} 
                            className="w-5 h-5 mr-3" 
                        />
                        {route.name}
                    </a>
                {/each}
            </div>
        </div>
    {/if}
</div>