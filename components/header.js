import Link from 'next/link';
import Search from './search';

export default function Header({ allPostsData }) {
	let shortStories = [];
	let longStories = [];
	let blogs = [];
	allPostsData.forEach((post) => {
		switch(post.postType) {
			case "shortStory":
				shortStories.push(post);
				break;
			case "longStory":
				longStories.push(post);
				break;
			default:
				blogs.push(post);
		}
	});

	return (
		<header className='sticky top-0 z-50'>
			<div className="justify-between navbar bg-base-100">
				<div className="navbar-start">
					<div className="dropdown">
						<label tabIndex="0" className="btn btn-ghost lg:hidden">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
						</label>
						<ul tabIndex="0" className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box">
							<Search/>
							<li>
								<a>Short Works</a>
								<ul className="p-2">
									{shortStories.map(({ title, path }) => (
										<li key={path}>
											<Link href={`/posts/${path}`} className='break-words'>{title}</Link>
										</li>
									))}
								</ul>
							</li>
							<li>
								<a>Long Works</a>
								<ul className="p-2">
									{longStories.map(({ title, path }) => (
										<li key={path}>
											<Link href={`/posts/${path}`} className='break-words'>{title}</Link>
										</li>
									))}
								</ul>
							</li>
							<li>
								<a>Blogs</a>
								<ul className="p-2">
									{blogs.map(({ title, path }) => (
										<li key={path}>
											<Link href={`/posts/${path}`} className='break-words'>{title}</Link>
										</li>
									))}
								</ul>
							</li>
						</ul>
					</div>
					<Link className="normal-case text-xl" href="/">
						<div className="avatar">
							<div className="w-20 rounded-full m-3">
								<img src="/images/profile.png" height={200} width={200}/>
							</div>
						</div>
					</Link>
					<div className='hidden lg:block'>
						<Search/>
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal">
						<li tabIndex="0" className="dropdown">
							<label tabIndex={0} className="btn m-1 flex flex-col text-2xl">Short Works</label>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{shortStories.map(({ title, path }) => (
									<li key={path}>
										<Link href={`/posts/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
						<li tabIndex="0" className="dropdown">
							<label tabIndex={0} className="btn m-1 flex flex-col text-2xl">Long Works</label>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{longStories.map(({ title, path }) => (
									<li key={path}>
										<Link href={`/posts/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
						<li tabIndex="0" className="dropdown">
							<label tabIndex={0} className="btn m-1 flex flex-col text-2xl">Blogs</label>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
								{blogs.map(({ title, path }) => (
									<li key={path}>
										<Link href={`/posts/${path}`}>{title}</Link>
									</li>
								))}
							</ul>
						</li>
					</ul>
				</div>
				<div className="navbar-end">

				</div>
			</div>
		</header>
	);
}