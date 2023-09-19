import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen">
			<img src={`${process.env.PUBLIC_URL_DEV}/images/bg.jpg`} className="fixed z-0 object-cover min-h-full max-w-full"/>
			<Header/>
			<div className="flex justify-center z-30 flex-1">
				{children}
			</div>
			<Footer/>
		</div>
	);
}
