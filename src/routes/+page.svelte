<script>
  import "../app.css";
  import Editor from "../lib/components/Editor.svelte";
</script>

<main class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-center text-indigo-900">
      TipTap AI Plugin Editor
    </h1>
    <Editor />
  </div>
</main>

<style>
  :global(body) {
    @apply antialiased;
  }
</style>
