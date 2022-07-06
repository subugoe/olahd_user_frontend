<template>
  <section id="contact">
    <div class="container">
      <div class="row mt-3">
        <div class="col">
          <h2>Kontakt</h2>
          <hr />
          <h4>Allgemeine Anfragen</h4>
          <p>
            Lilja Sautter:
            <a href="mailto:sautter@sub.uni-goettingen.de">
              sautter@sub.uni-goettingen.de
            </a>
          </p>
          <h4>Technischer Support</h4>
          <a
            href="https://github.com/subugoe/OLA-HD-IMPL/issues"
            target="_blank"
          >
            Fehler melden
          </a>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col">
          <h4>Anschrift</h4>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <p>
            Niedersächsische Staats- und Universitätsbibliothek<br />
            Platz der Göttinger Sieben 1<br />
            37073 Göttingen
          </p>
          <iframe
            src="https://www.geodata.uni-goettingen.de/Lageplan_mobile/?zoom=1&piz=5383&etage=EG"
            width="100%"
            height="450"
            frameborder="0"
            style="border: 0"
            allowfullscreen=""
            aria-hidden="false"
            tabindex="0"
          ></iframe>
        </div>
        <div class="col-6">
          <p>
            Gesellschaft für wissenschaftliche Datenverarbeitung mbH
            Göttingen<br />
            Burckhardtweg 4<br />
            37077 Göttingen
          </p>
          <iframe
            src="https://www.geodata.uni-goettingen.de/Lageplan_mobile/?zoom=1&piz=0775&etage=EG"
            width="100%"
            height="450"
            frameborder="0"
            style="border: 0"
            allowfullscreen=""
            aria-hidden="false"
            tabindex="0"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Contact",
};
</script>

<style scoped>
</style>