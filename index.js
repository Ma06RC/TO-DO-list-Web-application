var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//Accessible at localhost:8080/
app.get('/', function(req,res){
	res.send('Hello World!');
});

//Accessible at localhost:8080/get/tasks/
app.get('/get/task/', function(req, res){
	res.send('This is a task.');
// Extend this later to return tasks from the database.
});

var pg = require('pg').native;
var connectionString = "postgres://larozamarc:abc@depot:5432/marc_nodejs";

var client = new pg.Client(connectionString);
client.connect();
//Then make a function to query the data and return the result:
app.get('/task_database', function(req, res){
	// SQL Query > Select Data
	var query = client.query("SELECT * FROM todo");

	var results = [];
	// Stream results back one row at a time
	query.on('row', function(row){
		results.push(row);
	});

	// After all data is returned, close connection and return results
	query.on('end', function(){
		res.json(results);
	});
});

app.put('/create', function(req, res){
	console.log("Inserting this "+req.body.task);
	var query = client.query("insert into todo (item) values ('" + req.body.task + "');",
		function(error, response){
		if(res.rowCount === 0){
			res.status(404).send("Not Found \n");
		}else if(error){
			res.status(400).send("Missing data from the database \n");
		}else{
			res.status(200).send("Ok, "+ req.body.task +" has been added \n");
		}
	});
});

app.delete('/delete', function(req, res){
	console.log("Deleting this "+req.body.task);
	var query = client.query("delete from todo where item = ('" + req.body.task + "');", 
		function(error, response){
		if(res.rowCount === 0){
			res.status(404).send("Not Found \n");
		}else if(error){
			res.status(400).send("Missing data from the database \n");
		}else{
			res.status(200).send("Ok, "+ req.body.task +" has been deleted \n");
		}
	});
});

app.post('/complete', function(req,res){
	console.log("Updating");
	var query = client.query("update todo set completed = not completed where item = ('"+ req.body.task+"');",
		function(error, response){
		if(res.rowCount === 0){
			res.status(404).send("Not Found \n");
		}else if(error){
			res.status(400).send("Missing data from the database \n");
		}else{
			res.status(200).send("Ok, "+ req.body.task +" has been updated \n");
		}
	});
});

app.listen(port, function(){
	console.log('Example app listening on port 8080!');
});

//Curl Test
//curl -H "Content-Type: application/json" -X PUT -d '{"task":"testing"}' localhost:8080/create	
//curl -H "Content-Type: application/json" -X DELETE -d '{"task":"testing"}' localhost:8080/delete


