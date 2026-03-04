<template>
    <CFormControl
      max-width="420px"
      background-color="var(--background-color)"
      color="var(--text-color)"
      border="1px solid var(--border-color)"
      margin="auto"
      padding="30px"
    >
      <CInput
        v-model="mail"
        type="email"
        name="email"
        aria-label="Email"
        placeholder="Email"
        required
        autocapitalize="off"
        autocorrect="off"
        data-cy="email"
        mb="15px"
        border="none"
        height="20px"
        border-radius="5px"
        p="10px"
        max-width="400px"
        :disabled="submitted"
      />
      <CButton
        @click.prevent="onSubmit"
        type="submit"
        data-cy="submit"
        bg-color="var(--accent-color)"
        w="100%"
        h="40px"
        border-radius="5px"
        border="none"
        font-weight="bold"
        font-size="16"
        cursor="pointer"
        :disabled="submitted || loading"
      >
        {{ buttonText }}
      </CButton>
    </CFormControl>
</template>

<script>
import { CFormControl, CInput, CButton } from '@chakra-ui/vue'

const KEILA_FORM_URL = '/api/subscribe'
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ig

export default {
  name: 'Newsletter',
  components: { CFormControl, CInput, CButton },
  data() {
    return {
      mail: '',
      loading: false,
      submitted: false,
    }
  },
  computed: {
    isValidEmail() {
      return this.mail.match(emailRegex)
    },
    buttonText() {
      if (this.submitted) return 'Subscribed!'
      if (this.loading) return 'Subscribing...'
      return 'Subscribe'
    }
  },
  methods: {
    async onSubmit() {
      if (!this.isValidEmail || this.loading || this.submitted) return
      this.loading = true
      try {
        const body = new URLSearchParams({ email: this.mail })
        await fetch(KEILA_FORM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        })
        this.submitted = true
        this.mail = ''
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.newsletter {
  ::v-deep .newsletter__wrap {
    max-width: 420px;
    background-color: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    .newsletter__input {
      margin-bottom: 15px;
    }
    .newsletter__button {
      background-color: var(--accent-color);
    }
  }
}
</style>
