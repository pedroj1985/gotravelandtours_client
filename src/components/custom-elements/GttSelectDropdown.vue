<template>
  <div class="gtt__list_area_div">
    <input
      autofocus
      type="text"
      ref="gttinput"
      class="gtt__list_area_input"
      :value="searchQuery"
      @input="onInput"
      @keyup="submitSearch"
      placeholder="Buscar"
    />
    <ul class="gtt__list_area">
      <li
        v-if="nullable"
        class="gtt__item"
        @click="$emit('select', 'ALL_ITEMS')"
      >
        {{ $helpers.traducir("Todos") }}
      </li>
      <li
        class="gtt__item"
        v-for="option in searchResult"
        :key="option.id"
        @click="$emit('select', option)"
      >
        <slot name="option" v-bind:option="option">{{ option }}</slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array
    },
    nullable: {
      type: Boolean,
      default: false
    },
    searchQuery: {
      type: String,
      default: ""
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchResult: []
    };
  },
  mounted() {
    this.searchResult = this.options;
    if (this.$refs.gttinput) {
      this.$refs.gttinput.focus();
    }
  },
  watch: {
    options: function(val) {
      this.searchResult = val;
    }
  },
  methods: {
    onInput(e) {
      this.$emit("update:searchQuery", e.target.value);
      this.$emit("search", e.target.value);
    },
    submitSearch(e) {
      let query = e.target.value;
      this.searchResult = this.options.filter(opt =>
        opt.nombre.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.gtt__list_area_div {
  @include dropdown-wrapper;
}

ul.gtt__list_area {
  min-height: 100px;
  max-height: 300px;
  min-width: 150px;
  list-style: none;
  text-align: left;
  border-radius: var(--border-radius-lg);
  overflow: auto;
  padding: var(--spacing-md) 0;
  background-color: var(--color-background-white);
  margin-bottom: 0;
  color: var(--color-text-primary);
  padding-left: 0;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
}

.gtt__list_area_input {
  @include gtt-input;
  border: none;
  background: var(--color-background-white);
  padding: var(--spacing-md) var(--spacing-xl);
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  border-bottom: 1px solid var(--color-border-light);

  &:focus {
    outline: none;
  }
}

li.gtt__item {
  padding: var(--spacing-md) var(--spacing-xl);
  cursor: default;

  &:hover {
    background: var(--color-text-primary);
    color: var(--color-text-light);
  }
}

@media (max-width: 1440px) {
  ul.gtt__list_area {
    font-size: 10px;
    padding: var(--spacing-xs) 0;
  }

  li.gtt__item {
    padding: var(--spacing-xs) var(--spacing-xl);
    cursor: default;
  }
}
</style>
