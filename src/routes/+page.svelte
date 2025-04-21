<script lang='ts'>
    import MainNav from '$lib/components/MainNav.svelte';
    import DynamicIcon from '$lib/components/DynamicIcon.svelte';
    import Decoration from '$lib/components/Decoration.svelte';
    import Features from '$lib/components/Features.svelte';
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
    
    
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 transition-all duration-500">
    
    <!-- Navbar -->
    <MainNav />
    
    <!-- Hero -->
    <div class="container mx-auto px-4 pt-16 md:pt-20 pb-16">
        <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 ml3">
                Welcome to Joon's AI Application
            </h1>
            
            <Decoration />

        </div>
    </div>
    
    <div class="container mx-auto px-4 pb-24">
        <h2 class="text-3xl font-bold text-center mb-12 text-white">
            Our AI Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
            <Features />
        </div>
    </div>
    
    <!-- Features -->

</div>

<style>
    .ml3 {
        font-weight: 900;   
        font-size: 3.5em;
    }
</style>