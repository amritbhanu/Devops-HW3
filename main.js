var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
var availports=0;
var newport=3001;
var client = redis.createClient(6379, '127.0.0.1', {})
var lenth=0;

if(process.argv.length <3) {
	console.log("Error - wrong number of arguments");
	process.exit();
}

var PORT=process.argv[2];
var server = app.listen(PORT, function ()
 {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
   client.lpush("availableports",port);

      client.llen("availableports",function(err, availports)
   {
   	console.log(availports);
   });

 });

app.use(function(req, res, next)
{
	//console.log(req.method, req.url);
	// ... INSERT HERE.
	client.lpush("recenturl", req.url, function(err, reply)
	{
        client.ltrim("recenturl", 0, 9);
    });
	next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
		PORT=req.headers.host.split(':')[1];
  res.send('This is a HTTP server on port ' + PORT);
});

app.get('/set', function(req, res) {
  PORT=req.headers.host.split(':')[1];
  client.set("key", "this message will self-destruct in 10 seconds");
  client.expire("key", 10, function() {
  })
  res.send('This is a HTTP server on port ' + PORT + '<br> Key has been set on server with port ' + PORT)
});

app.get('/get', function(req, res) {
  var message;
  PORT=req.headers.host.split(':')[1];
  client.get("key", function(err,value){
  	message = value;
  	if(message != null) {
  	res.send('This is a HTTP server on port ' + PORT + '<br>' + message); console.log(value);
	}
	else {
		res.send('This is a HTTP server on port ' + PORT  );
	}
  })
});

app.get('/recent', function(req, res)
{
    PORT=req.headers.host.split(':')[1];
    client.lrange("recenturl", 0, 4, function(err, urls)
    {
        res.send('This is a HTTP server on port ' + PORT + '<br>' + "Recently visited sites - " + urls);
    });
});

app.post('/', function (req, res) {
  res.send('This is a HTTP server on port ' + PORT + '<br> POST request to the homepage');
});

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		client.lpush('images', img);
 		});
 	}
    res.status(204).end()
 }]);


app.get('/meow', function(req, res) {
	{
		PORT=req.headers.host.split(':')[1];
		var data;
		client.lpop('images', function(err, imagedata) {
			if(imagedata == undefined) {
				res.send("This is a HTTP server on port " + PORT + "<br> There are currently no images to  display")
			}
			else {
				res.writeHead(200, {'content-type':'text/html'});
				if(err) {
					console.log(err)
				}
				res.write("<h1>This is a HTTP server on port " + PORT + "\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
				res.end();
			}
		});
	}
});

app.get('/spawn', function(req, res)
{
	client.lindex("availableports", 0, function(err, value){});
	client.sort("availableports", function(err, value){});
	PORT=req.headers.host.split(':')[1];
	newport=newport+1;
	var server = app.listen(newport, function ()
 	{
  		var host = server.address().address
    	var port = server.address().port
    	PORT=port
   		res.send("Created a server with port: "+newport);
   		client.lpush("availableports",newport);

   	});
});

app.get('/destroy', function(req, res)
{
	client.lpop("availableports",function(err, port)
		{
			res.send("Killed the server with port: "+port);
		});
});

app.get('/listservers', function(req, res)
{
	client.llen("availableports",function(err, length)
    {
   		console.log("no. of availableports = "+length);
   		client.lrange("availableports",0,length,function(err, availports)
   		{
   			res.send("List of servers running: "+availports);
   		});
    });
});
