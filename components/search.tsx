export default function Search() {
	return (
		<label className="relative block">
			<span className="sr-only">Search</span>
			<span className="absolute inset-y-0 left-0 flex items-center pl-2">
				<svg xmlns="http://www.w3.org/2000/svg" className="absolute mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</span>
			<input className="placeholder:italic py-2 pl-9 input input-bordered w-full max-w-xs" placeholder="Search" type="text" name="search"/>
		</label>
	);
}