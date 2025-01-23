export const generateSlug = (name) => {
	name = name
		.toLowerCase()
		.normalize('NFD') // Unicode normalization
		.replace(/[\u0300-\u036f]/g, '') // Remove accent characters
		.replace(/[^a-z0-9\s-]/g, '') // Keep only letters, numbers and spaces
		.trim() // Remove leading and trailing spaces
		.replace(/\s+/g, '-') // Replace multiple spaces with a single hyphen
		.replace(/-+/g, '-'); // Convert multiple hyphens into a single hyphen
	return name;
};
