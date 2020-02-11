<template>
  <v-btn @click="visible = true" color="secondary">
    Create training session
    <v-dialog v-model="visible" max-width="500px">
      <v-card light>
        <v-card-title class="headline accent white-color" primary-title>Title</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              name="title"
              label="title"
              type="text"
              v-model="title"
              :error-messages="titleErrors"
              :counter="128"
              required
              @input="$v.title.$touch()"
              @blur="$v.title.$touch()"
            ></v-text-field>
            <v-textarea
              name="description"
              label="description"
              type="text"
              v-model="description"
              :error-messages="descriptionErrors"
              :counter="4096"
              required
              @input="$v.description.$touch()"
              @blur="$v.description.$touch()"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-btn color="accent" @click="create">Create</v-btn>
          <v-btn @click="close">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  minLength,
  maxLength,
  email
} from 'vuelidate/lib/validators';
import { ActionType } from '../store/sessions';

export default {
  mixins: [validationMixin],
  validations: {
    title: { required, minLength: minLength(1), maxLength: maxLength(128) },
    description: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(4096)
    }
  },
  computed: {
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push('Title is required');
      !this.$v.title.minLength &&
        errors.push('Title must be at least 1 characters long');
      !this.$v.title.maxLength &&
        errors.push('Title must be at most 128 characters long');
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.description.$dirty) return errors;
      if (!this.$v.description.required || !this.description)
        errors.push('Description is required');
      if (!this.$v.description.minLength)
        errors.push('Description must be at least 1 characters long');
      if (!this.$v.description.maxLength)
        errors.push('Description must be at most 4096 characters long');
      return errors;
    }
  },
  data: () => ({
    visible: false,
    title: '',
    description: ''
  }),
  methods: {
    create() {
      this.$store.dispatch(ActionType.CREATE_SESSION, {
        title: this.title,
        description: this.description
      });
      this.close();
    },
    close() {
      this.title = '';
      this.description = '';
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">
.white-color {
  color: #fff;
}
</style>
