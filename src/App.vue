<template>
  <div class= class-issue-tracker-app id="issue-tracker-app">
    <v-app class="main-app">
      <v-content>
        <v-layout align-start justify-end row>
          <v-btn class = "jira-button"
                  color="pink"
                  dark
                  @click.stop="rightDrawer = !rightDrawer"
          >
            Jira
          </v-btn>
        </v-layout>
      </v-content>
      <v-navigation-drawer
              temporary
              :right="right"
              :width="500"
              v-model="rightDrawer"
              fixed
              app
              class="v-drawer"
      >
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="tile-title text-xs-center">
              <h5>
                Assigned Projects
              </h5>
            </v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>

          <!--PROJECT LIST START-->

          <v-expansion-panel focusable>
            <v-expansion-panel-content
                    v-for="(value, key) in projectList"
                    v-if="value"
                    :key="key"
            >

              <div slot="header">
                <div class="project-title">
              <span>
              <v-list-tile-avatar :size="24">
                <img :src="value.avatar">
              </v-list-tile-avatar>
              </span>
                  <span>
                {{ value.name }}
              </span>
                  <span>
                <v-badge color="orange" rignt>
                  <span slot="badge"> {{value.issues.length}} </span>
                </v-badge>
              </span>
                </div>
              </div>

              <v-list-tile
                      v-for="(issue, index) in value.issues"
                      :key="index"
                      @click=""
                      class="card_title"
              >

                <!--ISSUE LIST START-->

                <v-list-tile-content>
                  <v-layout>
                    <v-flex xs12 sm12>
                      <v-card>
                        <v-card-title primary-title>
                          <div class="issue-details">
                          <span class="summary">
                            <h3>{{ issue.key }}: {{ issue.fields.summary }} </h3>
                          </span>
                            <div v-html="issue.renderedFields.description" class="description"></div>
                          </div>

                          <!--Timer-->

                          <template>
                            <div class="stopwatch">
                              <StopWatch
                                      :issue=issue.key
                                      :issue_status=issue.fields.status.statusCategory.id
                                      :user_name=user_name
                                      :user_email="user_email"
                                      :user_pass="user_pass">
                              </StopWatch>
                            </div>
                          </template>

                        </v-card-title>
                        <v-divider v-if="index + 1 < value.issues.length" :key="`divider-${index}`"></v-divider>
                      </v-card>
                    </v-flex>
                  </v-layout>

                </v-list-tile-content>

                <!--ISSUE LIST END-->

              </v-list-tile>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-list>
        <!--PROJECT LIST START-->
      </v-navigation-drawer>
    </v-app>
  </div>
</template>

<script>
  import axios from 'axios'
  import StopWatch from './components/StopWatch'

  export default {
    name: 'App',
    data () {
      return {
        info: null,
        right: true,
        rightDrawer: false,
        projects: [],
        state: 'PAUSED',
        startTime: Date.now(),
        currentTime: Date.now(),
        interval: null,
        countTime: []
      }
    },
    components: { StopWatch },
    mounted () {
      var sessionUrl = this.api_url
      var token = window.btoa(this.user_email + ':' + this.user_pass)
      axios
        .get(sessionUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
            'X-Atlassian-Token': 'no-check'
          }
        })
        .then(
          response => (this.info = response)
        )
      this.interval = setInterval(this.updateCurrentTime, 1000)
    },
    destroyed: function () {
      clearInterval(this.interval)
    },
    computed: {
      projectList: function () {
        if (this.info !== null) {
          var issues = this.info.data.issues
          var projects = []
          issues.forEach(function (entry) {
            var projectId = entry.fields.project.id
            var project = {}
            project.name = entry.fields.project.name
            project.avatar = entry.fields.project.avatarUrls['24x24']
            project.issues = []
            projects[projectId] = project
          })
          issues.forEach(function (entry) {
            var projectId = entry.fields.project.id
            if (projects[projectId]) {
              projects[projectId].issues.push(entry)
            }
          })
          this.projects = projects
          return this.projects
        }
      }
    },
    props: {
      user_name: {
        type: String,
        required: false
      },
      user_email: {
        type: String,
        required: false
      },
      user_pass: {
        type: String,
        required: false
      },
      api_url: {
        type: String,
        required: false
      },
      rendered_fields: {
        type: String,
        required: false
      },
      issue_status: {
        type: String,
        required: false
      }
    }

  }
</script>

<style>
  .v-list__tile.v-list__tile--link {
    min-height: 60px;
    height: 100%;
    padding: 0px;
  }
  .v-card__tile {
    width: 100%;
  }
  .layout {
    margin: 0px;
    width: 100%;
  }
  .flex.offset-sm3 {
    margin: 0px;
  }
  .flex.offset-sm3 {
    max-width: 100%;
    min-width: 100%;
  }
  .v-expansion-panel__header{
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: initial;
  }
  .time {
    color: orange;
  }
  .v-card__actions {
    padding-left: 20%;
  }
  p > a {
    word-break: break-all;
  }
  .project-title > span {
    float: left;
  }
  span.project-title:last-child {
    float: right;
  }
  .v-content__wrap {
    background-color: transparent;
  }
  .application--wrap {
    min-height: 0px;
  }
  .class-issue-tracker-app {
    width: 46px;
    position: absolute;
    /*right: 0px;*/
  }
  .v-drawer {
    z-index: 999 !important;
  }
  .menuable__content__active {
    position: absolute;
  }
  .v-expansion-panel {
    margin: 0px;
  }
  .tile-title {
    height: 30px !important;
  }
  .main-app {
    background-color: transparent !important;
  }
  a :hover {
    text-decoration: none !important;
  }
  .v-list__tile__title {
    text-align: center !important;
  }
</style>
<style scoped>
  .jira-button {
    position: fixed !important;
    right: 0 !important;
  }
  .v-content {
    margin-top: 5px;
    margin-left: -16px !important;
  }
  .description {
    width: 100%;
  }
  .issue-details {
    width: 100%;
  }

  h5  {
    text-transform: uppercase;
  }
  h3 {
    margin-bottom: 25px;
    /*text-align: center;*/
  }
  .stopwatch{
    width: 100%;
    display: inline-flex;
    flex-flow: row wrap;
    justify-content: center;
  }
</style>
