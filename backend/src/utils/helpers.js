module.exports = {
    generateToken: (user) => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    },
    
    handleError: (res, error) => {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    },

    paginate: (data, page, limit) => {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (endIndex < data.length) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.results = data.slice(startIndex, endIndex);
        return results;
    }
};