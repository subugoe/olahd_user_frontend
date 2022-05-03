<template>
  <!-- Navigation -->
  <div class="left-0 right-0 z-10" style="position: fixed">
    <!-- Navigation menu -->
    <div class="bg-white sticky top-0">
      <div class="mx-auto sm:px-6">
        <div
          class="
            flex
            justify-between
            items-center
            border-b-2 border-gray-100
            py-2
            md:justify-start md:space-x-10
          "
        >
          <div class="flex justify-start lg:w-0 lg:flex-1">
            <router-link
              as="nav"
              class="px-2"
              active-class="active"
              to="/"
              exact
            >
              <a class="nav-link text-sky-500 hover:text-slate-700">Home</a>
            </router-link>
          </div>
          <div
            class="
              flex
              justify-center
              text-sky-500
              hover:text-slate-700
              lg:w-0 lg:flex-1
            "
          >
            <span>OLA-HD Service</span>
          </div>
          <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <router-link as="nav" active-class="active" to="/about">
              <a class="nav-link text-sky-500 hover:text-slate-700"
                >Über das Projekt</a
              >
            </router-link>
            <router-link as="nav" active-class="active" to="/contact">
              <a class="nav-link text-sky-500 hover:text-slate-700">Kontakt</a>
            </router-link>
            <a
              href="#"
              class="
                bg-sky-600
                font-medium
                px-4
                py-2
                rounded-md
                shadow-sm
                text-white
                hover:bg-sky-700
              "
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
</style>