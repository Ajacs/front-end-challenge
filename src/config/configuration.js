const config = {
    baseHost: 'https://api-dev.bitso.com/v3/',
    api: {
        endpoints: {
            public: {
                'books': '/available_books/',
                'trades': '/trades/?book={book}',
                'ticker': '/ticker/?book={book}'
            },
            private: {
                'account_status': '/account_status/'
            }
        }
    }
};

export default config;