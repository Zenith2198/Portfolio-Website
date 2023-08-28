import Header from './header';
import Footer from './footer';

export default function Layout({ children, allPostsData }) {
	return (
		<div className='flex flex-col min-h-screen'>
			{/* TODO: make background image zoom in on mobile */}
			<img src="/images/bg.jpg" className="fixed z-0"/>
			<Header allPostsData={allPostsData}/>
			<main className='flex justify-center z-40'>
				{children}
			</main>
			<Footer/>
		</div>
  	);
}
