---
title: "Heroku and Brunch+Ember.JS"
date: 2014-04-22T16:52:00.000+03:00
lastmod: 2014-04-22T16:52:22.766+03:00
original_url: "https://antigluk.blogspot.com/2014/04/heroku-and-brunchemberjs.html"
tags: ["brunch", "english", "heroku", "javascript", "node.js", "python"]
draft: true
migrated_from: blogspot
---

`The goal is to build static files (with brunch) while heroku deploys application, and in runtime serve it statically with dynamic backend (Python/django in my case).`\
\
`To build brunch we need node.js, but for backend we need python buildpack. `\
**`heroku-buildpack-multi `**`makes this possible to have several buildpacks simultaneously in one Heroku app. `\
\
`1.`` We need to attach ``heroku-buildpack-multi to our app:`\
` `\

     

    $ heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git

     

`2. In your repository add `**`.buildpacks`**` file`\
\
`Add buildpacks one in each line. Let first be node.js, and second is your backend buildpack:`\
\
\
`$ cat .buildpacks`\
`https://github.com/heroku/heroku-buildpack-nodejs.git#v58`\
`https://github.com/heroku/heroku-buildpack-python.git#v36`\
\
`3. Configure your node.js app with `**`package.json`**\
`$ cat package.json`\
`{`\
`  "name": "dnd",`\
`  "version": "0.0.1",`\
`  "description": "D&D Character Generator",`\
`  "author": "Roman Rader",`\
`  "license": "BSD",`\
`  "dependencies": {`\
`    "brunch": ">= 1.7.12",`\
`    "javascript-brunch": ">= 1.0 < 1.8",`\
`    "css-brunch": ">= 1.0 < 1.8",`\
`    "bower": ">= 1.2.0",`\
`    "ember-precompiler-brunch": ">= 1.5.0",`\
`    "less-brunch": "~1.7.1"`\
`  },`\
`  "scripts": {`\
`    "postinstall": "./postinstall.sh",`\
`  }`\
`}`\
\
`4. Here, `**`postinstall.sh`**` is script to install bower modules and build brunch`\
`$ cat postinstall.sh`\
`./node_modules/bower/bin/bower install`\
`./node_modules/.bin/brunch build`\
\
`5. Configure bower dependencies with `**`bower.json`**\
\
`$ cat bower.json`\
`{`\
`  "name": "dnd-chargen",`\
`  "version": "0.0.1",`\
`  "license": "BSD",`\
`  "private": true,`\
`  "dependencies": {`\
`    "ember": "1.4.0",`\
`    "ember-data": "1.0.0-beta.5",`\
`    "handlebars": "~1.3.0",`\
`    "bootstrap": "3.0.x",`\
`    "moment": "~2.5.1"`\
`  }`\
`}`\
\
`6. And last thing, configure brunch with `**`config.coffee`**\
\
`It's pretty default config file, but importrant `*`heroku-dependent`*` thing:`` `\
\
`Node.js files are in vendor/node directory on heroku side, so you have to ignore them from compilation``.`\
\
*`javascripts->joinTo-> `*\
*`        'static/javascripts/vendor.js': /^bower_components|vendor\/(?!node)/`` `*\
\
`To specify directory to put compiled artifacts use `*`public`*` property:`\
*`public: 'public'`*\
\
`And all compiled stuff will be in /public directory`\
\
\
\
`$ cat config.coffee`\
`exports.config =`\
\
`  files:`\
`    javascripts:`\
`      defaultExtension: 'js'`\
`      joinTo:`\
`        'static/javascripts/app.js': /^app/`\
`        'static/javascripts/vendor.js': /^bower_components|vendor\/(?!node)/`\
\
`    stylesheets:`\
`      defaultExtension: 'css'`\
`      joinTo: 'static/stylesheets/app.css': /^app/`\
\
`    templates:`\
`      precompile: true`\
`      root: 'templates'`\
`      defaultExtension: 'hbs'`\
`      joinTo: 'static/javascripts/app.js' : /^app/`\
`      paths:`\
`        jquery: 'bower_components/jquery/jquery.js'`\
`        handlebars: 'bower_components/handlebars/handlebars.js'`\
`        ember: 'bower_components/ember/ember.js'`\
\
`  modules:`\
`    addSourceURLs: true`\
\
`  paths:`\
`    public: 'public'`\
\
`Now you can try to push stuff to heroku, everything should compile fine.  `\
`Of course, now app folder is empty (if exists), but brunch should compile well with at least bootstrap stuff.`\
\
\
`Put your application code to /app directory (and don't try to rename it :) doesn't work, it's kinda hardcoded)`\
` `
