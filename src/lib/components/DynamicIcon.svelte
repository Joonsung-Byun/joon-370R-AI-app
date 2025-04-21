<script lang="ts">
    // 이 컴포넌트는 아이콘 컴포넌트와 클래스 이름을 받아 동적으로 아이콘을 렌더링합니다
    let { icon, className = "" } = $props<{ icon: any, className?: string }>();
</script>

{#if icon}
    <div class={className}>
        {#if typeof icon === 'function' || typeof icon === 'object'}
            {@const Icon = icon}
            <Icon class={className} />
        {/if}
    </div>
{/if}