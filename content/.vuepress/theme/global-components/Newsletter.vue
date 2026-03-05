<template>
  <div class="newsletter">
    <input
      v-model="mail"
      type="email"
      name="email"
      aria-label="Email"
      placeholder="Email"
      autocapitalize="off"
      autocorrect="off"
      data-cy="email"
      class="newsletter-input"
      :disabled="submitted"
    />
    <button
      type="submit"
      data-cy="submit"
      class="newsletter-btn"
      :disabled="submitted || loading"
      @click.prevent="onSubmit"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const KEILA_FORM_URL = '/api/subscribe'
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i

const mail = ref('')
const loading = ref(false)
const submitted = ref(false)

const isValidEmail = computed(() => emailRegex.test(mail.value))
const buttonText = computed(() => {
  if (submitted.value) return 'Subscribed!'
  if (loading.value) return 'Subscribing...'
  return 'Subscribe'
})

async function onSubmit() {
  if (!isValidEmail.value || loading.value || submitted.value) return
  loading.value = true
  try {
    const body = new URLSearchParams({ email: mail.value })
    await fetch(KEILA_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    submitted.value = true
    mail.value = ''
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.newsletter {
  max-width: 420px;
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  margin: auto;
  padding: 30px;
  border-radius: 4px;
}

.newsletter-input {
  display: block;
  width: 100%;
  max-width: 400px;
  height: 40px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--foreground-color);
  color: var(--text-color);
  font-size: 1rem;

  &:disabled {
    opacity: 0.6;
  }
}

.newsletter-btn {
  display: block;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: var(--accent-color);
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
