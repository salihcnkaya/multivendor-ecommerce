import React from 'react';
import { AddressCard } from './AddressCard';

export const AddressList = ({
	addresses,
	onEditClick,
	onDeleteClick,
	onSelectAddress,
	selectedAddressId,
}) => {
	if (!addresses || addresses.length === 0) {
		return <div>Kayıtlı adres bulunamadı.</div>;
	}

	return (
		<div className="max-w-xs">
			{addresses.map((address) => (
				<div
					key={address._id}
					onClick={() => {
						onSelectAddress(address);
						console.log(address);
					}}
					className={`cursor-pointer ${
						selectedAddressId === address._id
							? 'border-2 border-orange-500'
							: ''
					}`}
				>
					<AddressCard
						address={address}
						onEditClick={onEditClick}
						onDeleteClick={onDeleteClick}
					/>
				</div>
			))}
		</div>
	);
};
