import { reactive, toRefs } from "vue";

interface FormErrors {
  [key: string]: string;
}

export function useForm() {
  const formState = reactive<{ errors: FormErrors; loading: boolean }>({
    errors: {},
    loading: false
  });

  function setFieldError(field: string, message: string) {
    formState.errors[field] = message;
  }

  function setErrors(errors: FormErrors) {
    formState.errors = errors;
  }

  function clearFieldError(field: string) {
    delete formState.errors[field];
  }

  function clearAllErrors() {
    formState.errors = {};
  }

  function setLoading(state: boolean) {
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
