<script>
    import { browser } from '$app/environment'
    import { onMount } from 'svelte'
    const words = [
        'AI RAG Chatbot to chat with your documents',
        'Image Vector Embedding to analyze your images',
        'Vector Search technology to find similar images',
        'AI Image Generation to create stunning images'
    ]
    // Variables to track the position and deletion status of the word
    let wordIndex = 0
    let charIndex = 0
    let isDeleting = false

    onMount(() => {
        const dynamicText = document.querySelector('h1 span')
        const typeEffect = () => {
            const currentWord = words[wordIndex]
            const currentChar = currentWord.substring(0, charIndex)
            if (dynamicText) {
                dynamicText.textContent = currentChar
                dynamicText.classList.add('stop-blinking')
            }

            if (!isDeleting && charIndex < currentWord.length) {
                // If condition is true, type the next character
                charIndex++
                setTimeout(typeEffect, 80) // 200ms → 80ms로 속도 증가
            } else if (isDeleting && charIndex > 0) {
                // If condition is true, remove the previous character
                charIndex--
                setTimeout(typeEffect, 50) // 100ms → 50ms로 속도 증가
            } else {
                // If word is deleted then switch to the next word
                isDeleting = !isDeleting
                if (dynamicText) {
                    dynamicText.classList.remove('stop-blinking')
                }
                wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex
                setTimeout(typeEffect, 1000) // 1200ms → 1000ms로 약간 줄임
            }
        }
        typeEffect()
    }     )

    // Cleanup function to remove the interval when the component is destroyed

</script>

<h1>Try our <span></span></h1>

<style>
    h1 {
        color: #fff;
        font-size: 2rem;
        font-weight: 600;
    }
    h1 span {
        color: #bd53ed;
        position: relative;
    }
    h1 span::before {
        content: '';
        height: 30px;
        width: 2px;
        position: absolute;
        top: 50%;
        right: -8px;
        background: #bd53ed;
        transform: translateY(-45%);
        animation: blink 0.7s infinite;
    }
    
    h1 span.stop-blinking::before {
        animation: none;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
</style>