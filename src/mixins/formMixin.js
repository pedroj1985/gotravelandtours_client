// DEPRECATED: Use composables/useForm.js instead
import { useForm } from "../composables/useForm";

export default {
  data() {
    const { errors, loading } = useForm();
    return {
      formErrors: errors.value || {},
      formLoading: loading.value || false
    };
  },
  methods: {
    setFieldError(field, message) {
      useForm().setFieldError(field, message);
      this.$set(this.formErrors, field, message);
    },
    clearFieldError(field) {
      this.$delete(this.formErrors, field);
    },
    clearAllErrors() {
      useForm().clearAllErrors();
      this.formErrors = {};
    },
    setLoading(state) {
      useForm().setLoading(state);
      this.formLoading = state;
    }
  }
};
