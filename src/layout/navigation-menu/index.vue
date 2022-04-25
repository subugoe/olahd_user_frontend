<template>
  <!-- Navigation -->
  <div
    class="navbar-expand-md bg-light p-0 fixed top-0 left-0 right-0 z-10 shadow"
    style="position: fixed"
  >
    <!-- Hamburger button -->
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon">
        <i class="fa fa-bars fa-lg"></i>
      </span>
    </button>

    <!-- Navigation menu -->
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav ml-auto flex-1">
        <router-link
          tag="li"
          class="nav-item px-2"
          active-class="active"
          to="/"
          exact
        >
          <a class="nav-link">Home</a>
        </router-link>
        <div class="flex-1" />
        <router-link
          tag="li"
          class="nav-item px-2"
          active-class="active"
          to="/about"
        >
          <a class="nav-link">Über das Projekt</a>
        </router-link>
        <router-link
          tag="li"
          class="nav-item px-2"
          active-class="active"
          to="/contact"
        >
          <a class="nav-link">Kontakt</a>
        </router-link>
        <!--<router-link tag="li" class="nav-item px-2" active-class="active" to="/faq">
                        <a class="nav-link">FAQ</a>
                    </router-link>-->
        <li class="nav-item px-2">
          <a class="nav-link" href="/admin/login">Login</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.navbar {
  .navbar-brand {
    img {
      height: 30px;

      @include media-breakpoint-up(sm) {
        height: 50px;
      }
    }
  }

  .fa.fa-bars {
    color: $secondary;
  }

  .navbar-nav {
    .nav-item {
      padding-top: 1rem;
      padding-bottom: 1rem;

      a {
        text-transform: uppercase;
        color: $primary;
      }
    }

    .nav-item:hover,
    .nav-item.active {
      background-color: $primary;

      a {
        color: white;
      }
    }
  }
}
</style>