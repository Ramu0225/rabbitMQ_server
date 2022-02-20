var amqp = require("amqplib/callback_api");
module.exports = (callback) => {
	amqp.connect("amqp://localhost", (error, connection) => {
		if (error) {
			throw new Error(error);
		}
		callback(connection);
	});
};
