mobbr angular app
=================

Using grunt for running and building the app:

1. install nodejs (see nodejs.org for binaries)
2. cd to project dir and do:
```
npm install -g grunt
npm install -g grunt-cli
npm install -g bower
npm install
bower install
```
3. run the app with ```grunt server```
4. build the app with ```grunt build```. This minifies and concatenates resources and copies them to the ```/dist``` directory.

5. deployment
- deploying user should copy his ssh key to the server
- deploying user should be a member of www-data: ```sudo usermod -a -G www-data <username>```
- run ```grunt deploy``` with optional environment value of 'test' (default) or 'production': ```grunt deploy --env=<environment>```