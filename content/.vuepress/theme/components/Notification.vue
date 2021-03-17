<template>
  <CAlert
    v-show="notification && !notificationIsClosed"
    class="alert"
    position="absolute"
    top="64px"
    left="0"
    right="0"
    status="info"
    py="0.3rem"
    background="var(--text-color)"
    color="var(--background-color)"
    box-shadow="1px 1px 2px rgba(0,0,0,0.15)"
    transition="all 0.3s ease"
    justify-content="center"
    align-items="center"
  >
    <CLink isExternal href="https://donate.unhcr.org/int/ethiopia-emergency/~my-donation#step-1" d="flex" align-items="center" color="var(--background-color)" :_hover="{ color: 'var(--background-color)' }">
      <CAlertIcon name="hand-holding-heart" max-width="50px" />
      <CBox max-width="600px" mx="1rem" >
        <CAlertTitle :mr="2" v-if="notificationTitle">{{notificationTitle}}</CAlertTitle>
        <CAlertDescription class="description" display="none">{{notification}}</CAlertDescription>
      </CBox>
    </CLink>
    <CCloseButton @click="closeNotification" position="absolute" right="10px" />
  </CAlert>
</template>

<script>
import {
  CAlert,
  CAlertIcon,
  CAlertTitle,
  CAlertDescription,
  CCloseButton,
  CBox,
  CLink
} from "@chakra-ui/vue"
export default {
  name: 'Notification',
  components: {
    CAlert,
    CAlertIcon,
    CAlertTitle,
    CAlertDescription,
    CCloseButton,
    CBox,
    CLink
  }, 
  data() {
    return {
      notificationTitle: 'Help Refugees in Tigray',
      notification: 'Donate to UNHCR to help thousands of refugees flee ongoing fighting in Ethiopia\'s Tigray region to seek safety in eastern Sudan.',
      notificationIsClosed: typeof window !== 'undefined' && localStorage.getItem('notificationIsClosed') || false
    }
  },
  methods: {
    closeNotification() {
      this.notificationIsClosed = true
      localStorage.setItem('notificationIsClosed', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  &:hover {
    box-shadow: 3px 3px 5px rgba(0,0,0,0.15);
  }
}

@media (min-width: 720px) {
  .alert {
    top: 80px;
    .description {
      display: block;
    }
  }
}
@media (min-width: 1300px) {
  .alert {
    margin-right: 230px;
    border-radius: 0 0 5px 0;
  }
}
</style>