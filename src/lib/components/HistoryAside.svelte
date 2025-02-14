<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let isOpen = false;

	const openSlide = () => {
		const sliderNav = document.getElementById('sliderNav');
		if (sliderNav) {
			sliderNav.classList.toggle('hidden');
			isOpen = !isOpen;
		}

		const toggleBtn = document.getElementById('toggleBtn');

		if (!toggleBtn) {
			return;
		} else {
			if (isOpen) {
				toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>`;
				toggleBtn.classList.add('left-[200px]');
			} else {
         toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>`;
         toggleBtn.classList.remove('left-[200px]');
      }
   }
	};
</script>

<nav class="fixed left-0 top-[74px] z-50  xl:relative xl:z-0 xl:min-h-screen h-full xl:top-0">
	<button
		class="fixed left-4 top-24 z-50 rounded-md bg-gray-800 p-2 text-white xl:hidden"
		aria-label="Toggle menu"
		id="toggleBtn"
		onclick={() => {
			openSlide();
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	</button>

	<div
		id="sliderNav"
		class="hidden h-full w-[200px] overflow-y-auto bg-gray-800 text-white md:w-[200px] lg:w-[200px] xl:block xl:w-auto"
		transition:slide={{ duration: 300, axis: 'x' }}
	>
		<div class="p-4">
			<h2 class="mb-4 text-2xl font-bold">Menu</h2>
			<ul>
				<li class="mb-2"><a href="/" class="hover:text-gray-300">Home</a></li>
				<li class="mb-2"><a href="/about" class="hover:text-gray-300">About</a></li>
				<li class="mb-2"><a href="/services" class="hover:text-gray-300">Services</a></li>
				<li class="mb-2"><a href="/contact" class="hover:text-gray-300">Contact</a></li>
			</ul>
		</div>
	</div>
</nav>
