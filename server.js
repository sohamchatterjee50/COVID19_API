var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

let url = "mongodb://localhost:27017/";
var dbo;


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("covid19_db");
  /*
  var query = {};
  dbo.collection("covid_stats").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
  */
});


router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Covid 19 API"});
});

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

router.route("/getDeceased")
    .get(function(req,res){
		var coll = dbo.collection('covid_stats');
        var response = {};
		var query = { status: "Deceased" };
        coll.find( query ,{ patientId:1, reportedOn:1, ageEstimate:1, gender:1, state:1, status:1, _id:0} ).toArray(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
			//console.log(response);
            res.json(response);
        });
    });

router.route("/getStats")
    .get(function(req,res){
		var coll = dbo.collection('covid_stats');
        var response = {};
		var query = { };
        coll.find( query ,{ patientId:1, reportedOn:1, ageEstimate:1, gender:1, state:1, status:1, _id:0} ).toArray(function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
			//console.log(response);
            res.json(response);
        });
    });


app.use('/',router);

app.listen(3500);
console.log("Listening to PORT 3500");