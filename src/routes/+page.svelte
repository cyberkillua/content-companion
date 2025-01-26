<script>
  import Editor from "../lib/components/Editor.svelte";
</script>

<main class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
        Writing Companion
      </h1>
      <p class="mt-2 text-lg text-gray-600">
        Write, edit, and enhance with AI assistance
      </p>
    </div>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <Editor />
    </div>
  </div>
</main>
