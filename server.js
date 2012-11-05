// © 2012 Sami Majadla and Rapcities Inc. All Rights Reserved

var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;
    
if(cluster.isMaster){
  console.log(numCPUs + ' cores on this machine.');
  for(var i = 0; i < numCPUs; i++)
    cluster.fork();
    
  cluster.on('exit', function(worker){
    console.log('worker ' + worker.process.pid + ' died.');
    cluster.fork();
  });
  process.on("SIGTERM", process.exit);
  process.on("SIGINT", process.exit);
  process.on("SIGKILL", process.exit);
  /*process.on("SIGTERM", websiteDown);
  process.on('exit',websiteDown);
  process.on('SIGINT', websiteDown);*/
}
else{
  connect = require('connect'),
  url = require('url'),
  locations = require('./locs');
		
	function router(req, res, next) {
	    var arr = req.url.split('?')[0];

	    switch(arr){
			case '/loc/getTypes': locations.getTypes(req,res); break;
			case '/loc/getTypeIcon': locations.getTypeIcon(req,res); break;
			case '/loc/browse': locations.browseLoc(req,res); break;
			case '/loc/view': locations.view(req,res); break;
			default: 
				next();
    	}
	}

	function checkWWW(req, res, next){
		if(req.headers.host.match(/^www/)){
			console.log('www');
			res.writeHead(301, {'location':'http://'+req.headers.host.replace(/^www\./,'')+req.url});
			res.end();
		} 
		else
			next();
	}
	
	function checkRobots(req, res, next){
		var path = req.url.split('?')[0];
		if(path == '/robots.txt'){
			res.writeHead(404);
        	res.end();
        } else{
			res.writeHead(500); 
			res.end();
		}
	}
	
  connect.createServer(
	connect.favicon(__dirname+'/files/icons/favicon.ico'),
	checkWWW,
	connect.logger(),
	connect.bodyParser(),
	connect.query(),
    require('./fileServer')(),
	router,
	//checkRobots).listen(80);
	checkRobots).listen(8888);
  console.log('Server has started.');
}

