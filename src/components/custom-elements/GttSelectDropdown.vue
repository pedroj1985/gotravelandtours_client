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
        role="option"
        :aria-selected="isSelected('ALL_ITEMS')"
        id="gtt-option-all"
        @click="$emit('select', 'ALL_ITEMS')"
      >
        {{ $helpers.traducir("Todos") }}
      </li>
      <li
        class="gtt__item"
        role="option"
        v-for="(option, index) in searchResult"
        :key="typeof option === 'object' && option !== null ? option.id : option"
        :aria-selected="isSelected(option)"
        :id="'gtt-option-' + index"
        @click="$emit('select', option)"
      >
        <span v-if="isSelected(option)" class="mdi mdi-check" aria-hidden="true"></span>
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
    },
    selectedValue: {
      default: null
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
    isSelected(option) {
      if (option === 'ALL_ITEMS') {
        return this.selectedValue === 'ALL_ITEMS';
      }
      if (typeof option === 'object' && typeof this.selectedValue === 'object') {
        return option.id === this.selectedValue.id;
      }
      return option === this.selectedValue;
    },
    getOptionText(option) {
      if (option !== null && typeof option === "object") {
        return String(option.nombre ?? "");
      }
      return String(option);
    },
    filterOptions(query) {
      const q = query.toLowerCase();
      return this.options.filter(opt =>
        this.getOptionText(opt)
          .toLowerCase()
          .includes(q)
      );
    },
    onInput(e) {
      const query = e.target.value;
      this.$emit("update:searchQuery", query);
      this.$emit("search", query);
      this.searchResult = this.filterOptions(query);
    },
    submitSearch(e) {
      this.searchResult = this.filterOptions(e.target.value);
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
