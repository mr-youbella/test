export default function Home() 
{
	fetch("http://localhost:4000/api").then(response => (response.json())).then(response => (console.log(response))).catch(err => (console.log("Error in fetch data api " + err)));
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
		</div>
	);
}
