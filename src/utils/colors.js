export const randomizeColor = () => Math.floor(Math.random() * 1000000);

export const invertHex = (hex) => {
	return (Number(`0x1${hex}`) ^ 0xffffff)
		.toString(16)
		.substring(1)
		.toUpperCase();
};
