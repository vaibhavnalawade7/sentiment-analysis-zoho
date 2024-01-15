const bodyParser = require('body-parser');
const catalyst = require('zcatalyst-sdk-node');
const request = require('request');
const url = require('url');  // Import the 'url' module for parsing URLs

const urlencodedParser = bodyParser.urlencoded({ extended: false });

function Catalyst_connector(catalystapp, msg_text, res) {

    var connector = catalystapp.connection({
        ConnectorName: {
            client_id: '1000.4R2BDOEAEXCPELWS9XGOHPI7MVP5QK',
            client_secret: '2b20b2853b299496247058ced73f2980c89aae1d01',
            auth_url: 'https://accounts.zoho.com/oauth/v2/token',
            refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
            refresh_token: '1000.140a5d9ff89ebe9edb2a04ef24416c8d.0cad2f94c183530ac94e47afe94d95a9',
            access_token: '1000.140a5d9ff89ebe9edb2a04ef24416c8d.0cad2f94c183530ac94e47afe94d95a9',
        }
    }).getConnector('ConnectorName');
    res.write(`<p>${"function run tri hoty baba"}</p>`);

    // If access_token is not provided, retrieve it
    connector.getAccessToken().then((access_token) => {
        // sentiment analysis API
        res.write(`<p>${"accesstoken" + access_token}</p>`);
        // //sentiment_analysis(access_token , msg_text);
        res.write(`<p>${"sentiment analysis zala ahe hurre..."}</p>`);
    }).catch(err => {
        res.write(`<p>${"error" + err}</p>`);
    }).finally(() => {
        res.write(`<p>${"end kartoy"}</p>`);
        res.end();
    });

    res.write(`<p>${"pn te varcha getacesstoken call ch zala nahi"}</p>`);
}

function sentiment_analysis(accessToken, msg_text) {
    var document_json = { "document": "[" + msg_text + "]" };
    console.log("body:" + JSON.stringify(document_json));
    var options = {
        'method': 'POST',
        'url': 'https://api.catalyst.zoho.com/baas/v1/project/4346000000006001/ml/text-analytics/sentiment-analysis',
        'headers': {
            'Authorization': 'Zoho-oauthtoken ' + accessToken,
            'Content-Type': 'application/json'
        }, body: JSON.stringify(document_json)
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);

        // Log or display the sentiment analysis result locally
        console.log("Sentiment Analysis Result:", response.body);

        // You can also include logic to display the result on your HTML page
        // res.send("Sentiment Analysis Result: " + response.body);
    });
} //test 

function push_to_desk(msg_text) {
    var options = {
        'method': 'POST', 
        'url': 'https://zylkertech.zendesk.com/api/v2/tickets.json',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 3RSQ9NGUQINXvOdQwih3jzv06PXzcKfyzavywQvz'
        },
        body: JSON.stringify({ "ticket": { "subject": "Ticket from Locally", "comment": { "body": msg_text } } })
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

const getDefault = (req, res) => {
    res.write(`
        <h1>Sentiment Analysis</h1>
        <form action="/server/catalyst/trigger-process" method="get">
            <label for="message">Enter Message:</label>
            <input type="text" id="message" name="message" required>
            <button type="submit">Submit</button>
        </form>
    `);
}

const postTriggerPrices = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const queryData = parsedUrl.query;

    const msg_text = queryData.message || "Default message"; // Use user input or a default message
    // const msg_text = req.body.message || "Default message"; // Use user input or a default message

    const catalystApp = catalyst.initialize(req);

    // Uncomment the next line if you want to process the message further
    Catalyst_connector(catalystApp, msg_text, res);

    res.write(`Process triggered successfully with message: ${msg_text}`);
}

module.exports = (req, res) => {
	var url = req.url;
	const msg = req?.body?.message||"Hello from index.js testing something";
console.log({msg});
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<style>p{border-bottom:2px solid black; padding-bottom:.5rem;}</style>")
	if(req.url == '/'){
		getDefault(req, res);
		res.end();
	} else if (req.url.startsWith('/trigger-process')) {
		// if(req.method == "POST") {
		// 	urlencodedParser(req, res, (err) => { // helps to convert the data into json object when form is submited
		// 		if (err) {
		// 			console.error('Error parsing URL-encoded data:', err);
		// 			res.statusCode = 400;
		// 			res.end('Bad Request');
		// 			return;
		// 		}
                res.write("<br>");
				postTriggerPrices(req, res);
			// });
		// } else {
		// 	res.end(req.method + " is invalid request" );
		// } 
	}else {
		res.writeHead(404);
		res.write('You might find the page you are looking for at "/" path');
        res.end();
	}
};


//req.method