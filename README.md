# issue-tracker

> tracker integration for drupal
> built for [jira integration module for drupal8](https://github.com/albu-vlad/jira-integration) with [vue.js](https://github.com/vuejs) and [vuetify.js](https://github.com/vuetifyjs)
## Build Setup
1. Get a jira token from your [Jira profile](https://id.atlassian.com/profile/profile.action)
2. Add your jira credentials [here](https://github.com/vuetifyjs) "api_url" example: https://[server]/rest/api/2/search?jql=resolution %3D Unresolved AND assignee in ([local-part](https://en.wikipedia.org/wiki/Email_address#Local-part) of email)&expand=renderedFields

3. Make sure you have your domain name whitelisted on jira server or install a browser extension to enable CORS

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
