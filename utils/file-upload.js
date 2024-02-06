/**
 * The function `validateImages` checks if the given files have allowed extensions and are within the
 * maximum file size limit.
 * @param files - An array of file objects that represent the images to be validated.
 * @returns The function `validateImages` returns an empty string if all the files pass the validation
 * checks. Otherwise, it returns a string indicating the reason for the validation failure.
 */
export const validateImages = (files) => {
	const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
	const maxSize = 5 * 1024 * 1024; // 5MB

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (!allowedExtensions.test(file.name)) {
			return "Only JPG, JPEG, and PNG files are allowed.";
		}
		if (file.size > maxSize) {
			return "File size exceeds the maximum limit of 5MB.";
		}
	}

	return "";
};

/**
 * The function `getUniqueNewFiles` takes in two arrays of files (existingFiles and newFiles) and
 * returns an array of unique new files by filtering out duplicates based on file name and size.
 * @param [existingFiles] - An array of objects representing the existing files. Each object should
 * have properties "name" and "size" to identify the file.
 * @param [newFiles] - An array of new files that need to be checked for uniqueness. Each file object
 * in the array should have a "name" property and a "size" property.
 * @returns an array of unique new files.
 */
export const getUniqueNewFiles = (existingFiles = [], newFiles = []) => {
	if (existingFiles.length === 0) {
		return newFiles;
	}
	// Filter out duplicates from new files
	const newUniqueFiles = newFiles.filter((file) => {
		const fileExists = existingFiles.some(
			(existingFile) =>
				existingFile.name === file.name && existingFile.size === file.size
		);
		return !fileExists;
	});

	return newUniqueFiles;
};

/**
 * The function `getUniqueUpdatedFiles` takes in two arrays of files and returns a new array that
 * combines the existing files with any unique new files.
 * @param [existingFiles] - An array of existing files.
 * @param [newFiles] - The `newFiles` parameter is an array that contains the new files that need to be
 * added to the existing files.
 * @returns an array that contains all the existing files and any new unique files that were not
 * already in the existing files array.
 */

export const getUniqueUpdatedFiles = (existingFiles = [], newFiles = []) => {
	const newUniqueFiles = getUniqueNewFiles(existingFiles, newFiles);
	return [...existingFiles, ...newUniqueFiles];
};
