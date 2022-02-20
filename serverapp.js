var express = require("express");
var bodyParser = require("body-parser");
var rabbitMQHandler = require("./connection/index");
const cors = require("cors");
const knex = require("knex");
const { registerOrderHandler } = require("./controllers/orderToDB");
const { orderDataHandler } = require("./controllers/getOrderDb");
const app = express();
var router = express.Router();
var server = require("http").Server(app);

var socketIO = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

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

var calcSocket = socketIO.of("/orderUpdate");
rabbitMQHandler((connection) => {
	connection.createChannel((err, channel) => {
		if (err) {
			throw new Error(err);
		}
		const mainQueue = "gustasi_job";

		channel.assertQueue(
			"gustasi_job",
			{ durable: false },
			(err, queue) => {
				if (err) {
					throw new Error(err);
				}
				//channel.bindQueue(queue.queue, mainQueue, "");

				channel.consume(queue.que, async (msg) => {
				//	console.log(msg);
					const data = JSON.parse(msg?.content?.toString()).task;

					const result = await registerOrderHandler(data, db);
					socketIO.of("/orderUpdate").emit(`gustasi_job${data.chefid}`, result);
					channel.ack(msg);
				});
			},
			{ noAck: false }
		);
	});
});

app.use("/api", router);

app.post("/api/v1/registerOrder", (req, res) => {
	//console.log("reg");
	rabbitMQHandler((connection) => {
		connection.createChannel((err, channel) => {
			if (err) {
				throw new Error(err);
			}
			var ex = "gustasi_job";
			var msg = JSON.stringify({ task: req.body });
			//console.log("msg", msg);
			channel.publish("", ex, Buffer.from(msg), { persistent: false });

			channel.close(() => {
				connection.close();
			});
			res.data = { "message-sent": "true" };
			return res.json();
		});
	});
});
app.get("/api/v1/order", (req, res) => {
	orderDataHandler(req, res, db);
});

server.listen(5555, "0.0.0.0", () => {
	console.log("Running at at localhost:5555");
});
