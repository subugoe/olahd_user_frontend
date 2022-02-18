<template>
  <footer
    padless
    dark
  >
    <b-container>
      <b-row align-h="center">
        <b-col class="" align-self="center">
          <router-link to="/about">Über das Projekt</router-link>
          <span class="mx-2">&#183;</span>

          <router-link to="/contact">Kontakt</router-link>
          <span class="mx-2">&#183;</span>
        </b-col>

        <b-col cols="auto" class="d-flex justify-space-between align-center">
          <a
            v-for="(item, index) in urls"
            :key="index"
            :href="item.to"
            :title="item.title"
            target="_blank"
          >
            <!-- {{ item.title }} -->
            <b-img
              height="80px"
              width="160px"
              block
              style="margin-right: 10px;object-fit:contain;"
              :src="require(`@/assets/${item.image}`)"
            />
            <!-- <img :src="item.image" class="mr-2 mr-md-4"> -->
          </a>
        </b-col>

        <b-col class="" align-self="center">
          <div>&copy; GWDG 2019. All Rights Reserved.</div>
        </b-col>
      </b-row>

      <b-row>

      </b-row>
    </b-container>
  </footer>
</template>

<script>
import urls from "../utilities/urls";

export default {
  name: "Footer",
  data: () => ({
    urls,
  }),
}
</script>

<!-- To keep the footer at the bottom of the page -->
<style lang="scss">
    html, body {
        height: 100%;
        position: relative;
    }

    #app {
        min-height: 100vh; /* will cover the 100% of viewport */
        overflow: hidden;
        display: block;
        position: relative;
        padding-bottom: 80px; /* height of your footer */

        @include media-breakpoint-down(xs) {
            padding-bottom: 104px;
        }

        @include media-breakpoint-up(sm) {
            padding-bottom: 56px;
        }
    }

    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
    }
</style>

<style lang="scss" scoped>
    footer {
        background-color: $secondary;
        color: white;

        ul li.list-inline-item a {
            color: white;
            text-decoration: none;
        }
    }
</style>
