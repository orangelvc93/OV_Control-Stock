import React from "react";
import { CreateUpdateItemForm } from "./CreateUpdateItemForm";

const ProductItems = () => {
	return (
		<>
			<div className="flex justify-between items-center m-4 mb-8">
				<h1 className="text-2xl ml-1">Mis Productos</h1>
				<CreateUpdateItemForm />
			</div>
		</>
	);
};

export default ProductItems;
