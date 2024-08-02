import { FaPrint } from "react-icons/fa";

export const Logo = () => {
	return (
		<div className="flex relative z-20 items-center text-lg font-medium space-x-3">
			<FaPrint />
			<p>Administrador de Consumibles</p>
		</div>
	);
};
