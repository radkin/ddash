DevOps Dashboard
================

Running The App
---------------

To run the app, follow these steps.

1.	Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.

2.	Ensure that [Redis](http://redis.io/topics/quickstart) is installed. This is only required if you have the useRedis switch set to true. See [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis) for setting up remotely.

3.	From the project folder, execute the following command:

```
npm install
```

1.	To run and serve the app, execute the following command:

```
node server.js
```

1.	Navigate to http://localhost:9000/ to browse the dashboard.

2.	To pull the data for cistatus, (for example) execute the following command:

```
node api/cistatus/worker.js
```

Setting up cronjobs
-------------------

To set up a cronjob to constantly update the data follow these steps:

1.	Get the path to node using `which node`.

2.	Get the path to your dashboard directory using `pwd`.

3.	Open up crontab editor using `crontab -e`.

4.	Insert the following replacing your paths respectively:

Production / Development

```
*/3 * * * * /usr/bin/node /home/dduser/DevOps_Dashboard/api/cistatus/worker.js > /home/dduser/cistatus.log 2>&1
0 * * * * /usr/bin/node /home/dduser/DevOps_Dashboard/api/notifyEmail/worker.js > /home/dduser/notifyemail.log 2>&1
```

Development Only

```
# update to master every 5 minutes and restart the server daily
*/5 * * * * cd DevOps_Dashboard; git reset --hard; git pull --rebase > /home/dduser/git_update.log 2>&1
0 17 * * * cd DevOps_Dashboard; pm2 stop server; pm2 start server > /home/dduser/server_restart.log 2>&1
```

1.	Confirm you have added the cron task by running `crontab -l`

Testing
-------

1.	Follow these directions: http://nightwatchjs.org/guide

2.	Copy all test related files to nightwatch-tests. Gitignore will make sure we don't commit them

3.	Run the basic functionality test for the landing page and ci-status SPA like This

```
cd nightwatch-tests; nightwatch --test tests/basic_func.js
```

*note* if you blow away the selenium driver, just run these commands

```
cd nightwatch-tests/lib
wget http://selenium-release.storage.googleapis.com/2.48/selenium-server-standalone-2.48.2.jar
```

APIs
----------------------------

Backend API

`node api/cistatus/worker.js` (gathers cistatus SPA data)
