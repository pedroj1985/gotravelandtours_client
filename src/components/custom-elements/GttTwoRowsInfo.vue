<template>
    <div>
        <div class="twoRowsDiv general-text-opt gtt-text-color hn-roman">
            <div class="tr-icon-wrapper">
                <slot name="tr-icon-slot">
                    <i class="mdi mdi-account"></i>
                </slot>
            </div>
            <div class="tr-info-wrapper">
                <div class="tr-info-name font12">
                    <slot name="tr-info-name">
                        Seleccione
                    </slot>
                </div>
                <div class="tr-info-value">
                    {{value}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            default: 'Aquí va su valor'
        }
    }
}
</script>
<style lang="scss" scoped>
.twoRowsDiv {
  width: 100%;
  display: flex;
  padding: var(--spacing-md);
  border: 2px solid var(--color-background);
  border-radius: var(--border-radius-lg);
}

.tr-icon-wrapper {
  align-self: center;
}

.tr-info-wrapper {
  margin-left: var(--spacing-xs);
}

.tr-info-value {
  font-size: var(--font-size-sm) !important;
}

@media (max-width: 1440px) {
  .twoRowsDiv {
    padding: var(--spacing-xs);
  }

  .tr-info-name {
    font-size: 10px !important;
  }

  .tr-info-value {
    font-size: var(--font-size-xs) !important;
  }
}
</style>
