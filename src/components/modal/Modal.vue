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
import Vue from "vue";
Vue.directive("click-outside", {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

Vue.directive("escape", {
  bind(el, binding, vnode) {
    el.escapeEvent = (event) => {
      if (event.keyCode === 27) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("keydown", el.escapeEvent);
  },
  unbind(el) {
    document.body.removeEventListener("keydown", el.escapeEvent);
  },
});
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
  methods: {
    handleClose() {
      // this.onClose();
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
