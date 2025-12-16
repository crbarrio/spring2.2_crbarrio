"use strict";
const regExLetters 	= /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
const regExNumbers 	= /^\d+$/;
const regExEmail 	= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regExPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

const validate = (id, value) => {
	let error = 0;

	if (!value || value.length < 3) return {id, error: 1}

	switch (id) {
		case 'fName':
		case 'fLastN':
			if (!regExLetters.test(value)) error = 1
			break;
		case 'fPhone':
			if (!regExNumbers.test(value)) error = 1
			break;
		case 'fPassword':
			if (!regExPassword.test(value)) error = 1
			break;
		case 'fEmail':
			if (!regExEmail.test(value)) error = 1
			break;
	}

	return {id, error}
}

document.getElementById('form-checkout').addEventListener('submit', function(e) {
	e.preventDefault();

	let error = 0;

	const formInputs = document.getElementById('form-checkout').querySelectorAll('input');
	formInputs.forEach(element => {
		let validation = validate(element.id, element.value.trim());
		if (validation.error == 1) {
			document.getElementById(element.id).classList.remove('is-valid')
			document.getElementById(element.id).classList.add('is-invalid')
		} else {
			document.getElementById(element.id).classList.add('is-valid')
			document.getElementById(element.id).classList.remove('is-invalid')
		}
		error += validation.error
	});

	error > 0 ? alert('Review the errors in the form') : alert('Form submitted successfully');

});