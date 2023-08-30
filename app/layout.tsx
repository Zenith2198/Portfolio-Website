import "./globals.css";
import AuthProvider from "./context/AuthProvider"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="min-w-screen min-h-screen overflow-x-hidden m-0 p-0">
			<body className="min-w-screen min-h-screen overflow-x-hidden m-0 p-0">
				<AuthProvider>
					{children}
				</AuthProvider>
			</body>
		</html>
	)
}