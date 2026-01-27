import fastify from 'fastify';
import cors from '@fastify/cors';
import type { ProductsType, EmailType, UsersType } from './interfaces';
import postgres from 'fastify-postgres';
import argon2 from 'argon2';
import jwt from '@fastify/jwt';
import { v2 as cloudinary } from 'cloudinary';
import multiparr from '@fastify/multipart';

const	server = fastify({logger: true});

// Register Plugins
server.register(cors, {origin: ["https://my-react-projects-e-commerce.vercel.app", "http://localhost:3000"], credentials: true});
server.register(postgres,
{
	connectionString: "postgresql://postgres:uTcpdbCfpKtpSlQYNYtIBMMRRRIIMSPB@ballast.proxy.rlwy.net:20026/railway",
	ssl: {rejectUnauthorized: false},
});
server.register(jwt, {secret: "b24579092bdac2b934399bde85fb9f68347890b390f8529c"})
server.register(multiparr);
cloudinary.config
({
	cloud_name: "durxazo41",
	api_key: "557158398488963",
	api_secret: "IETuhEGeteYSQlPIZSXxFPS2Js0"
});

// Products
server.get("/products", async (req, res) =>
{
	if (req.headers["secret-key"] === "d05572fece98136e")
	{
		const {rows} = await server.pg.query("SELECT * FROM products");
		return (rows);
	}
	res.status(401);
	return ({error: "Forbidden"});
});
server.post<{Body: ProductsType}>("/products", async (req, res) =>
{
	const	data = await req.file();
	if (!data)
	{
		res.status(401);
		return ({error: "Data no sended"});
	}
	const	fields = data.fields as Record<string, {value: string}>;
	const	product_data: ProductsType = JSON.parse(fields.data.value);
	const	buffer_image = await data.toBuffer();
	let		image_url: string = "";
	try
	{
		const	promise = await new Promise<string>((resolve, reject) =>
		{
			const	upload_image = cloudinary.uploader.upload_stream({folder: "products"}, (error, result) =>
			{
				if (error || !result)
					return (reject(error));
				return (resolve(result.url));
			});
			upload_image.end(buffer_image);
		});
		image_url = promise;
	}
	catch (e)
	{
		console.log(e);
		res.status(401).send({error: "Can't send data try again...."});
	}
	try
	{
		const	{rows} = await server.pg.query(`INSERT INTO products (title, price, old_price, image, gategory, is_new_product, about, description, attributes, values_attributes) VALUES ('${product_data.title}', '${product_data.price}', '${product_data.old_price}', '${image_url}', '${product_data.gategory}', '${product_data.is_new_product}', '${product_data.about}', '${product_data.description}', '${product_data.attributes}', '${product_data.values_attributes}')`);
	}
	catch (e)
	{
		console.log(e);
		res.status(401).send({error: "Can't send data try again...."});
	}
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
		{
			const	token = await server.jwt.sign({email: email}, {expiresIn: "1h"});
			return ({token: token});
		}
	}
	res.status(401);
	return ({error: "Invalid email or password"});
});
server.get("/verfiy", {preHandler: async (req) => {await req.jwtVerify()}}, async (req) =>
{
	return { ok: true };
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
