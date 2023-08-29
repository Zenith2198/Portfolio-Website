import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { getSortedPostsData } from '@/lib/posts';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const allPostsData = await getSortedPostsData();

	return (
		<html lang="en">
			<body className="flex flex-col min-h-screen">
				{/* TODO: make background image zoom in on mobile */}
				<img src="/images/bg.jpg" className="fixed z-0"/>
				<Header allPostsData={allPostsData}/>
				<div className="flex justify-center z-40">
					{children}
				</div>
				<Footer/>
			</body>
		</html>
	)
}
