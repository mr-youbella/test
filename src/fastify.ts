import fastify from 'fastify';
import cors from '@fastify/cors';
import { products } from "./products";

const	server = fastify({logger: true});
server.register(cors,
{
	origin: ["https://my-react-projects-e-commerce.vercel.com", "http://localhost:3000"],
});

interface	params
{
	id: string;
}

const	schema =
{
	schema:
	{
		response:
		{
			200:
			{
				type: "array",
				items:
				{
					type: "object",
					required: ["id", "title", "price", "old_price", "image", "gategory", "is_new_product"],
					properties:
					{
						id: {type: "number"},
						title: {type: "string"},
						price: {type: "number"},
						old_price: {type: ["number", "null"], default: null},
						image: {type: "string"},
						gategory: {type: "string"},
						is_new_product: {type: "boolean"},
					}
				}
			},
			400:
			{
				type: "object",
				items:
				{
					required: ["error"],
					properties:
					{
						error: {type: "string"},
					}
				}
			},
		}
	}
}

server.get("/", (req, res) =>
{
	res.send({name: "youbella"});
});

server.get<{Params: params}>("/products", schema, async (req, res) =>
{
	res.send(products);
});
server.get<{Params: params}>("/products/:id", schema, async (req, res) =>
{
	let	{id} = req.params;
	let	product = products.filter((value) => (value.id === Number(id)));
	if (product.length)
		res.send(product);
	else
		res.status(404).send({error: "InValid id product"});
});

server.listen({port: Number(process.env.PORT) || 3001, host: "0.0.0.0"}, (err, address) =>
{
	if (err)
	{
		console.log(err);
		process.exit(1);
	}
	console.log(address);
});
