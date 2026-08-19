<template>
  <div class="gtt__search_area">
    <input
      type="text"
      :value="searchQuery"
      @input="onInput"
      @keyup="submitSearch"
      placeholder="¿Donde desea alojarse?"
    />
    <ul class="gtt__list_area" v-if="searchQuery">
      <li
        class="gtt__item"
        role="option"
        v-for="(option, index) in searchResult"
        :key="option.id"
        :aria-selected="isSelected(option)"
        :id="'gtt-option-' + index"
        @click="$emit('select', option)"
      >
        <slot name="option" v-bind:option="option">{{ option }}</slot>
      </li>
    </ul>
    <div class="no-result-area" v-else>
      <div class="result-area-search-icon">
        <i class="mdi mdi-magnify"></i>
      </div>
      <slot name="no-result-text"
        >Buscar por destino, alojamiento o punto de interés</slot
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array
    },
    searchQuery: {
      type: String,
      default: ""
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
  },
  watch: {
    options: function(val) {
      this.searchResult = val;
    }
  },
  methods: {
    isSelected(option) {
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
.gtt__search_area {
  width: 400px;
  text-align: left;
  padding: var(--spacing-xl);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-background-white);
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);

  input {
    @include gtt-input;
    border: none;
    border-bottom: 1px solid var(--color-border);
    border-radius: 0;
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-xl);
    font-size: var(--font-size-sm);
  }
}

.result-area-search-icon {
  font-size: 60px;
  color: var(--color-text-secondary);
}

.no-result-area {
  font-size: var(--font-size-xs);
  text-align: center;
  color: var(--color-text-secondary);
  padding-top: 60px;
  line-height: var(--line-height-tight);
}

.gtt__search_result_area {
  overflow: auto;
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

.gtt__search_area ul.gtt__list_area {
  width: 100%;
  height: 100%;
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
