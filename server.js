const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const { registerOrderHandler } = require("./controllers/orderToDB");
const { orderDataHandler } = require("./controllers/getOrderDb");
const app = express();

const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "5199",
		database: "gustasi",
	},
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.post('/api/v1/registerOrder', (req, res) => {
	registerOrderHandler(req, res, db);
})
app.get('/api/v1/order', (req, res) => {
	orderDataHandler(req, res, db);
});
app.listen(5000, () => {
	console.log("app is running on port 5000");
});