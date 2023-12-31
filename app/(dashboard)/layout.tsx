import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen">
			<Image src={`/images/bg.jpg`} alt="" className="fixed z-0 object-cover min-h-full w-full" width={1920} height={1000}/>
			<Header/>
			<div className="flex justify-center z-30 flex-1">
				{children}
			</div>
			<Footer/>
		</div>
	);
}

export async function generateMetadata() {
	return {
		title: "Paig's Bog"
	};
}