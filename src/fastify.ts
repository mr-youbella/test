import fastify from 'fastify';
import cors from '@fastify/cors';
import type { ProductsType, EmailType, UsersType } from './interfaces';
import postgres from 'fastify-postgres';
import argon2 from 'argon2';

const	server = fastify({logger: true});
server.register(cors, {origin: ["https://my-react-projects-e-commerce.vercel.app", "http://localhost:3000"]});
server.register(postgres,
{
	connectionString: "postgresql://postgres:uTcpdbCfpKtpSlQYNYtIBMMRRRIIMSPB@ballast.proxy.rlwy.net:20026/railway",
	ssl: {rejectUnauthorized: false},
});

// Products
server.get("/products", async () =>
{
	const	{rows} = await server.pg.query("SELECT * FROM products");
	return (rows);
});
server.post<{Body: ProductsType}>("/products", async (req, res) =>
{
	const	{title, price, old_price, image, gategory, is_new_product} = req.body;
	await	server.pg.query(`INSERT INTO products (title, price, old_price, image, gategory, is_new_product) VALUES ('${title}', '${price}', '${old_price}', '${image}', '${gategory}', '${is_new_product}')`);
});
// Subscribe
server.post<{Body: EmailType}>("/subscribe", async (req, res) =>
{
	const	{email} = req.body;
	try 
	{
		await	server.pg.query(`INSERT INTO subscribe (email) VALUES ('${email}')`);
	}
	catch (e)
	{
		res.status(409).send({error: `email=${email} already exists.`});
	}
});
// Login
server.post<{Body: UsersType}>("/login", async (req, res) =>
{
	const	{email, password} = req.body;
	const	{rows}  = await server.pg.query<UsersType>(`SELECT * FROM users WHERE email = $1`, [email]);
	if (rows.length)
	{
		const	check_password = await argon2.verify(rows[0].password, password);
		if (check_password)
			return (rows);
		return ({error: "Password incorrect"});
	}
	return ({error: "User not Found"});
});

server.listen({port: Number(process.env.PORT) || 3001, host: "0.0.0.0"}, (error, address) =>
{
	if (error)
	{
		console.log(error);
		process.exit(1);
	}
	console.log(address);
});
