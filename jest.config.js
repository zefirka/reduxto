module.exports = {
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    },
    moduleDirectories: ['node_modules', 'dist'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    automock: false,
    collectCoverage: false,
    collectCoverageFrom: ['./index.js'],
    coverageReporters: ['text'],
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
    notify: true,
}
