<script>
  import Editor from "../lib/components/Editor.svelte";
</script>

<main class="min-h-screen bg-amber-50 px-4 py-8 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-4xl text-indigo-900 sm:text-5xl">Writing Companion</h1>
      <p class="mt-2 text-xl text-indigo-700">
        Write, edit, and enhance with AI assistance
      </p>
    </div>
    <div
      class="bg-white shadow-lg rounded-lg overflow-hidden border-2 border-indigo-200"
    >
      <Editor />
    </div>
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap");

  :global(body) {
    font-family: "Caveat", cursive;
  }

  /* :global(.) {
    font-family: "Caveat", cursive;
  } */
</style>
