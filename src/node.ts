import express, {Request, Response} from 'express';

const	PORT = process.env.PORT || 5000;
const	KEY: string = "1337";
const	app = express();
app.get("/api", (req: Request, res: Response) =>
{
	const	key = req.headers["x-api-key"];
	if (key === KEY)
	{
		res.json(
		{
			name: "youbella",
			age: 19,
			scholl: "1337",
		});
	}
	else
	{
		res.status(401);
		res.json(
		{
			error: "wrong APi KEY",
		});
	}
});

app.listen(PORT, () => (console.log(`Is listen in port ${PORT}`)))
