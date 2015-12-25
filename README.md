#Aria CSV Generator

##Summary

This project generates CSV data sheets for use in other API uploader tools.

##Setup

To use the dockerized version, run `docker-compose up` and the program will start on port 3000.

This program is only of use to folks that have Aria Systems API credentials (because API calls are made to retreive data for generation) and in combination with other uploader tools.

##Running Application

#docker
`docker up`

Docker may require manually installing the bower dependencies prior to running docker container.  If the application fails, try running `bower install` first.  
This will create a bower_componenets directory with the angular dependencies included.  bower is going to be removed in future versions because of this issue.

This will require npm to be installed and then bower to be installed globally with `npm install -g bower` for the above command to work.

#native

Install dependencies using `npm install` and then `bower install` *note:* bower will be removed in future versions in favor of pure npm because issues with docker.

Ensure that a mongo is running with default setting using the `mongod` command from within the Mongo
installation directory.

`node start` or using nodemon: `nodemon start`


