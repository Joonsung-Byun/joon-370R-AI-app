<script lang="ts">
   import { browser } from "$app/environment";

   function openSidebar() {
      const sidebar = document.getElementById('default-sidebar');
      const button = document.querySelector('[data-drawer-target="default-sidebar"]');
      if(sidebar) {
         sidebar.classList.toggle('hidden');
      }
      if(button) {
        // ml-[170px]이 클래스리스트에 있으면 삭제, 있으면 추가
         if(button.classList.contains('ml-[170px]')) {
            button.classList.remove('ml-[170px]');
         } else {
            button.classList.add('ml-[170px]');
         }
      }


   }
</script>

<button data-drawer-target="default-sidebar" onclick={openSidebar} data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" class="inline-flex xl:hidden absolute top-24 left-5  items-center p-2 mt-2 ms-3 text-sm bg-surface-700 text-white rounded-lg  hover:bg-gray-500 hover:text-black focus:outline-none">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
 </button>
 
 <aside id="default-sidebar" class="absolute hidden xl:block xl:relative z-20 bg-surface-600 min-h-screen h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div class="h-full md:px-3 md:py-4 overflow-y-auto bg-surface-800">
       <ul class="space-y-2 font-medium">
          <li>
             <a href="#" class="flex items-center p-2  rounded-lg text-white group">
                <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                   <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                   <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span class="ms-3 ">Place holder</span>
             </a>
          </li>      
         </ul>
    </div>
 </aside>
 
 