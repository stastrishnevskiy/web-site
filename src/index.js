import './styles.scss';
import { invertHex, randomizeColor } from './utils/colors';

const button = document.querySelector('.bg-color-button');
const title = document.querySelector('.title');

button.addEventListener('click', () => {
	const body = document.querySelector('body');
	const randColor = randomizeColor();
	const invertedColor = invertHex(randColor);
	body.style.backgroundColor = `#${randColor}`;
	title.style.color = `#${invertedColor}`;
	button.style.backgroundColor = `#${invertedColor}`;
	button.style.color = `#${randColor}`;
});
