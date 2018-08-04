<template>
  <div class="counter-block">
    <div class="block">
      <p class="digit">{{ this.hours }}:{{ this.minutes }}:{{ this.seconds }}</p>
      <div class="counter-block">
        <v-btn @click="timerSwitch" flat color="orange">{{ active === false ? startText : pauseText }}</v-btn>
        <v-btn @click="timeReset" flat color="orange">Reset</v-btn>
        <v-btn @click="close" flat color="orange">Close</v-btn>
      </div>
    </div>
    <div class="block">
        <v-select
                v-if="selected"
                v-model="selected"
                :hint="`${selected.status}, ${selected.id}`"
                :items="statusItems"
                item-text="status"
                item-value="id"
                label="Select"
                persistent-hint
                return-object
                single-line
        ></v-select>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'

  export default {
    props: {
      issue: {
        type: String
      },
      user_name: {
        type: String
      },
      user_email: {
        type: String
      },
      user_pass: {
        type: String
      },
      issue_status: {
        type: Number
      }
    },
    data () {
      return {
        now: new Date(),
        state: 'stopped',
        interval: null,
        workflow: null,
        submitId: '',
        active: false,
        startText: 'Start',
        pauseText: 'Pause',
        seconds: '00',
        minutes: '00',
        hours: '00'
      }
    },
    created: function () {
      Date.prototype.toIsoString = function () {
        var tzo = -this.getTimezoneOffset(),
          dif = tzo >= 0 ? '-' : '-',
          pad = function (num) {
            var norm = Math.floor(Math.abs(num))
            return (norm < 10 ? '0' : '') + norm
          }
        return this.getFullYear() +
          '-' + pad(this.getMonth() + 1) +
          '-' + pad(this.getDate()) +
          'T' + pad(this.getHours()) +
          ':' + pad(this.getMinutes()) +
          ':' + pad(this.getSeconds()) +
          '.' + '000' +
          dif + pad(tzo / 60) +
          ':' + pad(tzo % 60)
      }
    },
    mounted: function () {
      var sessionUrl = 'https://epointproject.atlassian.net/rest/api/2/issue/' + this.issue + '/transitions'
      this.getJira(sessionUrl)
    },
    destroyed: function () {
      clearInterval(this.interval)
    },
    computed: {
      statusItems: function () {
        var items = []
        if (this.workflow !== null) {
          this.workflow.forEach(function (entry) {
            var item = {}
            item.status = entry.name
            item.id = entry.id
            item.statusId = entry.to.statusCategory.id
            items.push(item)
          })
          return items
        }
      },
      selected: {
        get: function () {
          if (this.statusItems) {
            var currentStatus = this.statusItems
            var that = this
            var result = currentStatus.filter(function (obj) {
              return obj.statusId === that.issue_status
            })
            return result[0]
          }
        },
        set: function (val) {
          this.submitId = val
        }
      }
    },
    methods: {
      timerSwitch: function () {
        if (this.active === false) {
          this.active = true
          this.timeStart()
        } else {
          this.active = false
          this.timeStop()
        }
      },
      timeStart: function () {
        clearInterval(this.interval)
        this.interval = setInterval(this.startTimer, 1000)
      },
      timeStop: function () {
        clearInterval(this.interval)
      },
      timeReset: function () {
        clearInterval(this.interval)
        this.seconds = '00'
        this.minutes = '00'
        this.hours = '00'
      },
      startTimer: function () {
        this.seconds++
        if (this.seconds <= 9) {
          this.seconds = '0' + this.seconds
        }
        if (this.seconds > 60) {
          this.minutes++
          this.seconds = '00'
          if (this.minutes <= 9) {
            this.minutes = '0' + this.minutes
          }
        }
        if (this.minutes > 60) {
          this.hours++
          this.minutes = '00'
          if (this.minutes <= 9) {
            this.hours = '0' + this.hours
          }
        }
      },
      close: function () {
        this.$data.state = 'stopped'
        var hourFormat = parseInt(this.hours) * 60
        var minFormat = parseInt(this.minutes)
        var data = {'transition': {'id': this.submitId.id}}
        var work = {'timeSpent': hourFormat + minFormat + 'm', 'started': this.now.toIsoString}
        // var work = {'timeSpent': hourFormat + minFormat + 'm', 'started': '2018-07-07T01:20:38.957-0300'}
        var sessionUrl = 'https://epointproject.atlassian.net/rest/api/2/issue/' + this.issue + '/transitions'
        var worklogUrl = 'https://epointproject.atlassian.net/rest/api/2/issue/' + this.issue + '/worklog'
        if (this.submitId.id) {
          this.postJira(sessionUrl, data)
        }
        if (hourFormat + minFormat > 0) {
          this.postJira(worklogUrl, work)
        }
      },
      updateCurrentTime: function () {
        if (this.$data.state === 'started') {
          this.currentTime = Date.now()
        }
      },
      getJira: function (sessionUrl) {
        var token = window.btoa(this.user_email + ':' + this.user_pass)
        axios
          .get(sessionUrl, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + token,
              'X-Atlassian-Token': 'no-check'
            }
          }).then(
          response => (this.workflow = response.data.transitions)
        )
      },
      postJira: function (sessionUrl, data) {
        var token = window.btoa(this.user_email + ':' + this.user_pass)
        axios
          .post(sessionUrl, data, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + token,
              'X-Atlassian-Token': 'no-check'
            }
          })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .block {
    display: flex;
    flex-direction: column;
    margin: 5px;
    max-width: 50%;
  }
  .counter-block {
    display: flex;
    flex-direction: row;
  }

  .v-btn {
    margin: 0;
    min-width: 0;
  }

  .digit {
    font-size: 16px;
    font-weight: 100;
    margin: 5px;
    text-align: center;
  }
</style>
