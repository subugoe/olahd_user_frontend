<template>
  <section id="contact" class="grid mx-2 sm:mt-10 justify-center">
      <h1 class="mb-4 text-4xl font-bold">Contact</h1>
      <div class="text-left">
        <h2 class="text-xl font-bold">General requests</h2>
        <p>
          Lilja Sautter:
          <a href="mailto:sautter@sub.uni-goettingen.de" class="olahd-link-color">
            sautter@sub.uni-goettingen.de
          </a>
        </p>
        <h2>Address</h2>
        <p class="mb-3">
          Niedersächsische Staats- und Universitätsbibliothek<br />
          Platz der Göttinger Sieben 1<br />
          37073 Göttingen
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
