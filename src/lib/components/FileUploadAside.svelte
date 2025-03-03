<script lang="ts">

    let isSubmitted = false

    function handleSubmit() {
        isSubmitted = true
        console.log('Submitting form...')
    }

</script>

<div class="flex flex-col items-center justify-start m-8 bg-white">
    <form class="flex flex-col gap-4" method="POST" action="/chat?/uploadFile" enctype="multipart/form-data" onsubmit={handleSubmit}>
        <label class="label">
            <span class="label-text">Select a file</span>
            <input class="input" type="file" accept=".pdf" name="file" onchange={()=>{console.log('upload')}}/>
        </label>
        <button class="btn preset-filled-primary-200-800" type="submit">Upload chosen file</button>
    </form>
</div>