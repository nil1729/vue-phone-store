const { program } = require('commander');
const { prompt, questions } = require('./routes/admin/question');
const firebaseAdmin = require('./config/admin');
const photoURL =
	'https://www.logolynx.com/images/logolynx/23/23938578fb8d88c02bc59906d12230f3.png';
const adminClaim = {
	siteAdmin: true,
};

const main = async () => {
	program.version('1.0.0').description('VueJS Phone Buying Store');
	program
		.command('add')
		.alias('a')
		.action(async () => {
			const answers = await prompt(questions);
			console.log('\n\nNew Admin is Creating ....\n');
			const newAdmin = await firebaseAdmin
				.auth()
				.createUser({ ...answers, photoURL });
			await firebaseAdmin.auth().createCustomToken(newAdmin.uid, adminClaim);
			console.log('Admin Created');
			process.exit(1);
		});
	program.parseAsync(process.argv);
};

main();
