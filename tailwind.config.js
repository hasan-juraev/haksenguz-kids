// Tailwind for index.html and the scripts in js/ (built by tools/build-assets.js).
module.exports = {
    content: ['./index.html', './js/**/*.js'],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Fredoka', 'Nunito', 'sans-serif'],
                body: ['Nunito', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#fff9ed',
                    100: '#ffefd4',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                },
                fairy: {
                    purple: '#8b5cf6',
                    pink: '#ec4899',
                    sky: '#0ea5e9',
                    mint: '#10b981',
                    indigo: '#6366f1',
                    rose: '#f43f5e',
                },
            },
        },
    },
};
