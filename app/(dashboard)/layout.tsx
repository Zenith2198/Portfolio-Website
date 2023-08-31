import Footer from "@/components/footer";
import Header from "@/components/header";
import { getSortedPostsDataNoChapters } from '@/lib/db';
import type { Post } from "@/types/types"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const allPostsData = await getSortedPostsDataNoChapters();

	return (
		<div className="flex flex-col min-h-screen">
			<img src="/images/bg.jpg" className="fixed z-0 object-cover min-h-full max-w-full"/>
			<Header allPostsData={allPostsData}/>
			<div className="flex justify-center z-30 flex-1">
				{children}
			</div>
			<Footer/>
		</div>
	)
}
