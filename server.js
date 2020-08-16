const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const auths = require('./routes/auths');

app.use(express.json());
app.use('/api/v1', auths);

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
