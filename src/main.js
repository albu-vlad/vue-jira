// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

let defaults = null
if (process.env.NODE_ENV === 'production') {
  defaults = require('./data/variables_default.json')
} else {
  defaults = require('./data/variables.json')
}

/* eslint-disable no-new */
let issueTracker = new Vue({
  el: '#app',
  data: {
    config: defaults
  },
  render (h) {
    return h(App, {
      props: {
        user_email: this.config.user_email,
        user_pass: this.config.user_pass,
        api_url: this.config.api_url
      }
    })
  },
  created () {
    if (window.issue_config) {
      Object.assign(this.config, window.issue_config)
    }
  }
})

window.issue_tracker = issueTracker
