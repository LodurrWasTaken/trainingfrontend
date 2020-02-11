<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex v-if="plan" xs4 class="elevation-1 pa-3 ma-2">
        <v-list two-line>
          <v-subheader>
            <v-layout justify-space-between align-center>
              My training plan
              <v-btn @click="clearSessions">clear</v-btn>
            </v-layout>
          </v-subheader>
          <draggable v-model="plan" :options="{ group: 'sessions' }" style="min-height: 10px">
            <template v-for="item in plan">
              <v-list-item :key="`${item.id}${item.title}`">
                <v-list-item-content>
                  <v-layout justify-space-between>
                    <div>
                      <v-list-item-title v-html="item.title"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.description"></v-list-item-subtitle>
                    </div>
                    <div class="icons-block">
                      <v-icon
                        @click="checkSession(item.id, !item.completed)"
                        class="list-icon"
                        right
                      >{{ item.completed ? 'check_circle' : 'highlight_off'}}</v-icon>
                      <v-icon @click="deleteSession(item.id)" class="list-icon" right>delete</v-icon>
                    </div>
                  </v-layout>
                </v-list-item-content>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-flex>
      <v-flex v-else xs4>
        <v-container fluid>
          <v-row>
            <v-col>
              <v-row align="center" justify="center" style="height: 300px;">
                <v-btn @click="createPlan" color="secondary">create plan</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-flex>
      <v-flex xs4 class="elevation-1 pa-3 ma-2">
        <v-list two-line>
          <v-subheader>Training sessions bank</v-subheader>
          <draggable v-model="bank" :options="{ group: 'sessions' }" style="min-height: 10px">
            <template v-for="item in bank">
              <v-list-item :key="`${item.id}${item.title}`">
                <v-list-item-content>
                  <v-layout justify-space-between>
                    <div>
                      <v-list-item-title v-html="item.title"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.description"></v-list-item-subtitle>
                    </div>
                    <div class="icons-block">
                      <v-icon @click="addSessionToPlan(item)" class="list-icon" right>control_point</v-icon>
                      <v-icon @click="deleteSessionFromBank(item.id)" class="list-icon" right>delete</v-icon>
                    </div>
                  </v-layout>
                </v-list-item-content>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import draggable from 'vuedraggable';
import { mapState } from 'vuex';
import { ActionType } from '../store/sessions';

export default {
  components: {
    draggable
  },
  mounted() {
    this.fetchSessions();
  },
  computed: {
    bank: {
      get: function() {
        return this.$store.getters.sessionsBank;
      },
      set: function(value) {
        if (!value) return;
        return this.$store.commit(ActionType.SAVE_SESSIONS_BANK, value);
      }
    },
    plan: {
      get: function() {
        return this.$store.getters.plan;
      },
      set: function(value) {
        if (!value) return;
        return this.$store.dispatch(ActionType.SAVE_SESSIONS_PLAN, value);
      }
    }
  },
  methods: {
    createPlan() {
      this.$store.dispatch(ActionType.CREATE_PLAN, this.$store.getters.userId);
    },
    fetchSessions() {
      this.$store.dispatch(ActionType.FETCH_SESSIONS_BANK);
    },
    clearSessions() {
      this.$store.dispatch(ActionType.CLEAR_SESSIONS);
    },
    deleteSession(id) {
      this.$store.dispatch(ActionType.DELETE_SESSION, id);
    },
    checkSession(id, status) {
      this.$store.dispatch(ActionType.CHECK_SESSION, { id, status });
    },
    async addSessionToPlan(session) {
      await this.$store.dispatch(ActionType.SAVE_SESSIONS_PLAN, [
        ...this.plan,
        session
      ]);
      this.fetchSessions();
    },
    async deleteSessionFromBank(id) {
      await this.$store.dispatch(ActionType.DELETE_SESSION_FROM_BANK, id);
      this.fetchSessions();
    }
  }
};
</script>

<style lang="scss" scoped>
.list-icon {
  position: absolute;
  right: 0;
}
</style>