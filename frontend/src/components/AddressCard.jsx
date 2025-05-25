import React from 'react';
import { FaHome, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';

export const AddressCard = ({
	address,
	onEditClick,
	onDeleteClick,
	selectedId,
}) => {
	return (
		<div
			className={`flex items-center justify-between border rounded-lg p-2 text-neutral-700 text-sm ${
				selectedId && selectedId === address._id
					? 'border-orange-500'
					: 'border-zinc-300'
			}`}
		>
			<div>
				<div className="flex items-center gap-2">
					<FaHome className="text-xl" />
					<span className="font-semibold">{address.title}</span>
				</div>
				<span className="mt-0.5">{`${address.address}, ${address.buildingNo}/${address.apartmentNo}, ${address.district} / ${address.city} / ${address.country}, ${address.phoneNumber}`}</span>
			</div>
			{onEditClick && onDeleteClick && (
				<div className="flex">
					<button className="m-2 p-1" onClick={() => onEditClick(address)}>
						<MdModeEdit className="text-xl text-orange-500" />
					</button>
					<button className="m-2 p-1" onClick={() => onDeleteClick(address)}>
						<FaTrash className="text-base text-orange-500" />
					</button>
				</div>
			)}
		</div>
	);
};
