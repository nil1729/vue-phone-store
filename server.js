const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const auths = require('./routes/auths');
const products = require('./routes/products');

app.use(express.json());
app.use('/api/v1', auths);
app.use('/api/v1', products);

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
