const orderDataHandler = async (req, res, db) => {
	db.select("*")
		.from("orderinfo")
    .then((data) => { 
			res.json(data);
		})
		.catch((err) => res.status(400).json("error getting employee-list"));
};

module.exports = {
	orderDataHandler: orderDataHandler,
};
