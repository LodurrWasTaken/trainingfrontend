<template>
  <v-app-bar app color="primary" light>
    <div class="d-flex align-center">
      <v-img
        alt="Logo"
        class="shrink mr-2"
        contain
        src="../assets/logo.png"
        transition="scale-transition"
        width="100"
      />
    </div>

    <v-spacer></v-spacer>

    <v-layout justify-end align-center v-if="$store.getters.isAuthenticated">
      <div>
        Logged in as:
        <span class="bold">{{ email }}</span>
      </div>
      <v-divider vertical class="divider"></v-divider>
      <v-btn @click="signOut" color="secondary">Sign out</v-btn>
    </v-layout>
  </v-app-bar>
</template>

<script>
import { ActionType } from '../store/auth';
import { ActionType as SessionsType } from '../store/sessions';

export default {
  name: 'Header',
  computed: {
    email() {
      return this.$store.getters.email;
    }
  },
  methods: {
    async signOut() {
      await this.$store.dispatch(ActionType.SIGN_OUT);
      this.$store.commit(SessionsType.RESET_STATE);
      this.$router.push({ path: 'auth' });
    }
  }
};
</script>

<style lang="scss" scoped>
.bold {
  font-weight: bold;
}
.divider {
  margin: 0 10px;
}
</style>
