import express, {Request, Response} from 'express';

const	PORT = process.env.PORT || 5000;
const	app = express();
app.get("/api", (req: Request, res: Response) =>
{
	res.json(
	{
		name: "youbella",
		age: 19,
		scholl: "1337",
	});
});

app.listen(PORT, () => (console.log(`Is listen in port ${PORT}`)))
