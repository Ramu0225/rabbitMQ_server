const registerOrderHandler = async (data, db) => {
	const { chefid, orderstatus, orderitems } = data;
	//console.log("body", req.body,orderitems);
	// console.log("regdata", data);
	try {
		const response = await db("orderinfo").returning("*").insert({
			chefid: chefid,
			orderstatus: orderstatus,
			orderitems: orderitems,
			ordertime: new Date(),
		});
		const allOrders = db.select("*").where({chefid:chefid}).from("orderinfo");
		
		return allOrders;
	} catch (error) {
		throw new Error(error);
	}
};
module.exports = {
	registerOrderHandler: registerOrderHandler,
};
