import fastify from 'fastify';
import cors from '@fastify/cors';
import { Pool } from 'pg';

const	server = fastify({logger: true});
server.register(cors, {origin: "https://my-react-projects-e-commerce.vercel.app"});

const	pool = new Pool
({
	connectionString: "postgresql://postgres:uTcpdbCfpKtpSlQYNYtIBMMRRRIIMSPB@ballast.proxy.rlwy.net:20026/railway",
	ssl: {rejectUnauthorized: false},
});

server.get("/products", async () =>
{
	const	{rows} = await pool.query("SELECT title, price, old_price, image, gategory, is_new_product FROM products");
	return (rows);
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
