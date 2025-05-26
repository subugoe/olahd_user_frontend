<template>
  <section id="contact" class="grid mx-2 sm:mt-10 justify-center">
      <h1 class="mb-4 text-4xl font-bold">Contact</h1>
      <div class="text-left">
        <h2 class="text-xl font-bold">General requests</h2>
        <p>
          Name Placeholder:
          <a href="mailto:test@example.com" class="olahd-link-color">
            test@example.com
          </a>
        </p>
        <h2>Address</h2>
        <p class="mb-3">
          Test-Name<br />
          Test-Street<br />
          12345 Test-Town
        </p>
      </div>
  </section>
</template>

<script>
export default {
  name: "Contact",
};
</script>

<style scoped>
  h1 {
    @apply mb-4 text-4xl font-semibold text-slate-700
  }
  h2 {
    @apply text-xl font-semibold mt-10 mb-2 text-slate-700
  }
</style>
