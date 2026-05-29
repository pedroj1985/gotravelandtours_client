// Mixin para lógica de manejo de formularios y validación
export default {
  data() {
    return {
      formErrors: {},
      formLoading: false,
    };
  },
  methods: {
    setFieldError(field, message) {
      this.$set(this.formErrors, field, message);
    },
    clearFieldError(field) {
      this.$delete(this.formErrors, field);
    },
    clearAllErrors() {
      this.formErrors = {};
    },
    setLoading(state) {
      this.formLoading = state;
    },
  },
};
