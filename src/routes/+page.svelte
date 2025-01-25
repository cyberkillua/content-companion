<script>
  import Editor from "../lib/components/Editor.svelte";
</script>

<main class="app-container">
  <div class="header">
    <h1 class="title">AI Content Editor</h1>
    <p class="subtitle">Write, edit, and enhance with AI assistance</p>
  </div>

  <div class="editor-wrapper">
    <Editor></Editor>
  </div>
</main>

<style>
  .app-container {
    min-height: 100vh;
    background-color: #f8fafc;
    padding: 2rem;
  }

  .header {
    max-width: 64rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
    text-align: center;
  }

  .title {
    font-family: "Poppins", sans-serif;
    font-size: 2.5rem;
    line-height: 1.2;
    font-weight: 700;
    color: #0c4a6e;
    margin-bottom: 0.75rem;
  }

  .subtitle {
    color: #64748b;
    font-size: 1rem;
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
  }

  .editor-wrapper {
    max-width: 64rem;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    border: 1px solid #e2e8f0;
  }
</style>
