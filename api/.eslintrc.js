export default {
    "parser": "@typescript-eslint/parser",
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    "plugins": ["@typescript-eslint", "prettier"],
    "env": {
        "node": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module",
        "tsconfigRootDir": "./"
    },
    "rules": {
        "prettier/prettier": [
            "error",
            {},
            {
                "usePrettierrc": true
            }
        ],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "ignoreRestSiblings": true
            }
        ],
        "max-len": ["error", { "code": 140, "ignoreTrailingComments": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }]
    }
}
