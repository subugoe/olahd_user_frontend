<template>
  <div :class="modalClass" v-if="open">
    <div
      class="max-w-2xl w-full bg-white rounded-md"
      v-click-outside="handleClose"
      v-escape="onClose"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onClose: {
      type: Function,
      default: () => {},
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    escape: {
      mounted(el, binding) {
        el.escapeEvent = (event) => {
          if (event.keyCode === 27) {
            binding.value(event);
          }
        };
        document.body.addEventListener("keydown", el.escapeEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("keydown", el.escapeEvent);
      }
    },
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    }
  },
  methods: {
    handleClose() {
      this.onClose();
    },
  },
  computed: {
    modalClass() {
      return this.open
        ? "fixed inset-0 flex flex-col flex-1 items-center justify-center bg-black/70"
        : "hidden";
    },
  },
};
</script>
