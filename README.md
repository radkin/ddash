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
*/2 * * * * export ZABBIX_USER="secret_user"; export ZABBIX_PASS="secret_pass"; /usr/bin/node /home/dduser/DevOps_Dashboard/api/landing/worker.js > /home/dduser/landing.log 2>&1
0 * * * * /usr/bin/node /home/dduser/DevOps_Dashboard/api/details/worker.js > /home/dduser/details.log 2>&1
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

Services
-------

Services are as follows (all Single Page Applications or SPAs)

`cistatus` (for public consumption) -- details view

`cistatusnoc` (custom status for the NOC)

`/` (root dir aka landing)

`cistatussearch` (search for a specific Jenkins build by application)

`api/cistatus` (JSON REST API)

The above are endpoints that when added to the base URLs listed below will have the desired result.

Example: http://larry.com/#/cistatus


Backend APIs
-------


`node api/cistatus/worker.js` (gathers cistatus SPA data)

`node api/details/worker.js` (gathers details for cistatus artifact drill-down data)

`node api/landing/worker.js` (gathers zabbix status for landing page link servers)

Development Lifecycle including Release Process
-----------------------------------------------

* **create a new branch based upon code in master**	

		git checkout -b [ticket #] + [short description]

		EXAMPLE: `git checkout -b 72_update_doc_002`

*	**make changes, commit, push changes to branch in git, create merge request & assign**

	EXAMPLE:

	-	coding changes reviewed and ready for commit

			cd nightwatch-tests; nightwatch --test tests/basic_func.js

	-	Review results and confirm functionality

			git commit -a
			git push origin 72_update_doc_002


	-	Open a merge request, review the changes and diff, assign, comment, etc.

		http://larry.com/DevOps_Dashboard

*	**release to development**

		ssh larry-dev.com
		sudo su - dduser
		cd DevOps_Dashboard
		git pull --rebase
		git checkout <your branch>
		pm2 stop server
		pm2 start server.js
		
		*note* you may have to run an API script to gather new data


	*look over the changes on the dev instance and let others see as needed*

		https://larry-dev.com/#/

    **super fast release to development** ( If sure the change is solid)
    
        merge the merge request to master
        wait 5 minutes
        look over the change as it is automatically updated
        
        *note* you may have to run an API script to gather new data

	*development notes*
 
	- always runs 9000 locally. We use port 80 in dev.

 	- instances should always use local files and not redis.

	- instance works as expected. Release to production


* **basic troubleshooting**

    ISSUE: you find that API updates are not showing up

    -   cat out the logs in /home/dduser (landing.log, cistatus.log, etc.)

	-	check for lingering API processes

			ps -efl | grep node	

	-	If you see old/stale API processes, kill them

			node api/details/worker.js

	-	There will be some red in the log, this is of no concern. Look for serious issues.

    ISSUE: The landing page is not updating and there is no data in data.log
    
    -   It is likely someone blew away the landing page zabbix system user "supersecret_user"
        Confirm that user exists and has the ability to access the REST API

* **release to production**

			ssh moe.com
			sudo su - dduser
			tmux a -t ddash1 (not required, but useful)
			cd DevOps_Dashboard
			git pull --rebase
			
			** if API change, run the worker.js scripts now**
			
			pm2 stop server; pm2 start server


	-	confirm https://moe.com
