<template>
  <!-- Toast Container -->
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-xs backdrop-blur-sm',
            toast.type === 'error'
              ? 'bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300'
              : toast.type === 'success'
              ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300'
              : toast.type === 'warn'
              ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300'
              : 'bg-white/95 dark:bg-zinc-900/90 border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300'
          ]"
        >
          <!-- Icon -->
          <span class="flex-shrink-0 mt-0.5 text-base">
            {{ toast.type === 'error' ? '❌' : toast.type === 'success' ? '✅' : toast.type === 'warn' ? '⚠️' : 'ℹ️' }}
          </span>
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="font-semibold text-xs uppercase tracking-wide mb-0.5 opacity-70">{{ toast.title }}</p>
            <p class="leading-snug text-xs break-words">{{ toast.message }}</p>
          </div>
          <button
            class="flex-shrink-0 text-current opacity-40 hover:opacity-70 transition mt-0.5"
            @click="remove(toast.id)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  toasts: { type: Array, default: () => [] }
})

const emit = defineEmits(['remove'])

function remove(id) {
  emit('remove', id)
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
