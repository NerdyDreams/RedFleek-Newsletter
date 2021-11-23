const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// serve up static files eg css and images
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

//serve up home page
app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const FirstName = req.body.FirstName;
  const LastName = req.body.LastName;
  const Email = req.body.Email;

//  data to send to mail chimp 👇
  var data = {
    members: [
      {
      email_address: Email,
      status: "subscribed",
      merge_fields: {
        FNAME: FirstName,
        LNAME: LastName,
      }

    }]
  };

  // mail chimp requires flatened json file
  const jsonData = JSON.stringify(data);

  // mail chimp api
  const url = 'https://us5.api.mailchimp.com/3.0/lists/42667f4706';

// http authentication
  const options = {
    method: "POST",
    auth: "Pere:56974fe0283dd052e18a3b0b0507a07f-us5"
  }

//object for sending data
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {

      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data))
    })
  })

//sending data to mailchimp
  request.write(jsonData)
  request.end()


});

app.post("/failure", function(req, res){
   res.redirect("/")
});


// run on cloud and local server 👇
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000")
});

// api key
// 56974fe0283dd052e18a3b0b0507a07f-us5

// list ID
// 42667f4706
