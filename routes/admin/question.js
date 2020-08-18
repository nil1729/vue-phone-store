const inquirer = require('inquirer');
const questions = [
	{
		type: 'input',
		name: 'displayName',
		message: 'Admin Display Name',
	},
	{
		type: 'input',
		name: 'email',
		message: 'Admin Email Address',
	},
	{
		type: 'password',
		name: 'password',
		message: 'Admin Password',
	},
];

const prompt = inquirer.createPromptModule();

module.exports = {
	prompt,
	questions,
};
