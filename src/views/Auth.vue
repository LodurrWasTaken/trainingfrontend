<template>
  <v-layout class="mt-12" align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="accent" class="toolbar-head">
          <v-toolbar-title
            @click="setSignUp"
            class="toolbar-head__title"
            :class="!signinMode ? 'active-title' : ''"
          >Sign up</v-toolbar-title>
          <span class="slash-divider">/</span>
          <v-toolbar-title
            @click="setSignIn"
            class="toolbar-head__title"
            :class="signinMode ? 'active-title' : ''"
          >Sign in</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon="email"
              name="email"
              label="email"
              type="text"
              :error-messages="emailErrors"
              :counter="25"
              v-model="email"
              color="blue-grey"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
            <v-text-field
              id="password"
              prepend-icon="lock"
              name="password"
              label="password"
              type="password"
              v-model="password"
              :error-messages="passwordErrors"
              :counter="30"
              color="blue-grey"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="submit" color="accent" width="100">
            <span v-if="!isLoading">Submit</span>
            <v-progress-circular v-else indeterminate></v-progress-circular>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  minLength,
  maxLength,
  email
} from 'vuelidate/lib/validators';
import { ActionType } from '../store/auth';
import { ActionType as SessionAction } from '../store/sessions';

export default {
  name: 'Auth',
  data: () => ({
    signinMode: false,
    email: '',
    password: ''
  }),
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email,
      minLength: minLength(5),
      maxLength: maxLength(25)
    },
    password: { required, minLength: minLength(8), maxLength: maxLength(30) }
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Must be valid e-mail');
      !this.$v.email.required && errors.push('E-mail is required');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push('Password must be at least 8 characters long');
      !this.$v.password.maxLength &&
        errors.push('Password must be at most 30 characters long');
      !this.$v.password.required && errors.push('Password is required');
      return errors;
    },
    isLoading() {
      return this.$store.getters.authInProgress;
    }
  },
  methods: {
    setSignIn() {
      this.signinMode = true;
    },
    setSignUp() {
      this.signinMode = false;
    },
    async submit() {
      this.$v.$touch();
      const { email, password } = this;
      if (!this.$v.$invalid) {
        await this.$store.dispatch(
          this.signinMode ? ActionType.SIGN_IN : ActionType.SIGN_UP,
          { email, password }
        );
        if (this.$store.getters.requestErrored) {
          alert('Bad request');
        } else {
          if (this.$store.state.auth.userData.plan) {
            this.$store.commit(
              SessionAction.SAVE_SESSIONS_PLAN,
              this.$store.state.auth.userData.plan
            );
            this.$store.commit(
              SessionAction.SAVE_PLAN_ID,
              this.$store.state.auth.userData.plan_id
            );
          }
          this.$router.push({ path: 'dashboard' });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.toolbar-head {
  display: flex;

  &__title {
    cursor: pointer;
  }
}
.slash-divider {
  margin: 0 10px;
}
.active-title {
  text-decoration: underline;
}
</style>
