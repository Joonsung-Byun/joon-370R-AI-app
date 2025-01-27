<script lang="ts">
    import type {PageData} from './$types';

    let {data} : {data:PageData} = $props();
    console.log(data)
</script>

<h1>
    Check Readiness is
    {data.ready ? 'Ready!!' : 'Not Ready!!'}
</h1>