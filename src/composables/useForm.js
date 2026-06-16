import { reactive, toRefs } from "vue";

export function useForm() {
  const formState = reactive({
    errors: {},
    loading: false
  });

  function setFieldError(field, message) {
    formState.errors[field] = message;
  }

  function setErrors(errors) {
    formState.errors = errors;
  }

  function clearFieldError(field) {
    delete formState.errors[field];
  }

  function clearAllErrors() {
    formState.errors = {};
  }

  function setLoading(state) {
    formState.loading = state;
  }

  return {
    ...toRefs(formState),
    setFieldError,
    setErrors,
    clearFieldError,
    clearAllErrors,
    setLoading
  };
}
