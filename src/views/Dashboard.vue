<template>
  <v-layout class="pt-12">
    <v-flex>
      <v-layout justify-center>
        <CreateTrainingSession />
      </v-layout>
      <TrainingBoard />
    </v-flex>
  </v-layout>
</template>

<script>
import CreateTrainingSession from '../components/CreateTrainingSession';
import TrainingBoard from '../components/TrainingBoard';

export default {
  name: 'Dashboard',
  components: {
    CreateTrainingSession,
    TrainingBoard
  }
};
</script>
