import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import ProductItems from "./components/ProductItems";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Gestiona tus productos",
};

const Dashboard = () => {
	return (
		<>
			<Navbar />
			<div className="md:border border-solid border-gray-300 rounded-3xl p-3 md:m-6 lg:mx-36">
				<ProductItems />
			</div>
		</>
	);
};

export default Dashboard;
