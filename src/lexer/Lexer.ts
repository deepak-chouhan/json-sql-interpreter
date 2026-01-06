import { type Token, TokenType } from "../types.js";

export class Lexer {
    private readonly KEYWORDS = {
        SELECT: TokenType.SELECT,
        FROM: TokenType.FROM,
        WHERE: TokenType.WHERE,
        AS: TokenType.AS,
        AND: TokenType.AND,
        OR: TokenType.OR,
    };
    private readonly input: string;
    private position: number = 0;

    constructor(input: string) {
        this.input = input.trim();
    }

    private advance() {
        // Get the current character and move to next position
        if (this.position >= this.input.length) {
            return null;
        }
        const char = this.input[this.position];
        this.position++;
        return char;
    }

    private peakChar() {
        // Return the character as current
        return this.position < this.input.length
            ? this.input[this.position]
            : null;
    }

    private readStringLiteral(): string {
        const quoteChar = this.advance();
        let value = "";

        while (this.peakChar() !== null && this.peakChar() !== quoteChar) {
            value += this.advance();
        }

        if (this.peakChar() === null) {
            throw new Error(
                `Syntax Error: Unterminated string literal starting at position ${
                    this.position - 1
                }`
            );
        }
        this.advance(); // Skip the closing quote
        return value;
    }

    private readNumberLiteral(): string {
        let value = "";
        let hasDecimal = false;

        while (true) {
            const char = this.peakChar();
            if (/[0-9]/.test(char || "")) {
                value += this.advance();
            } else if (char === "." && !hasDecimal) {
                hasDecimal = true;
                value += this.advance();
            } else {
                break;
            }
        }

        if (value.endsWith(".")) {
            throw new Error(
                `Syntax Error: Invalid number format ending with '.' at position ${
                    this.position - 1
                }`
            );
        }
        return value;
    }

    private readIdentifier(): string {
        let value = "";

        // Allow letters, numbers, DOTS (.) for nested path and underscore.
        while (/[a-zA-Z0-9._]/.test(this.peakChar() || "")) {
            value += this.advance();
        }

        return value;
    }

    private isKeyword(value: string): TokenType | undefined {
        return this.KEYWORDS[value.toUpperCase()];
    }

    private getNextToken(): Token {
        const char = this.peakChar();
        const startPos = this.position;

        if (char === null) {
            return { type: TokenType.EOF, value: "", position: startPos };
        }

        const nextChar = this.input[this.position + 1];
        // Handle OPERATORS AND PUNCTUATION.
        // 1. Check for Not Equals (!=)
        if (char === "!" && nextChar === "=") {
            this.advance(); // "!"
            this.advance(); // "="
            return { type: TokenType.NE, value: "!=", position: startPos };
        }
        // 2. Check for Greater Than or Equal (>=)
        if (char === ">" && nextChar === "=") {
            this.advance(); // ">"
            this.advance(); // "="
            return { type: TokenType.GTE, value: ">=", position: startPos };
        }
        // 3. Check of Less than or Equal (<=)
        if (char === "<" && nextChar === "=") {
            this.advance();
            this.advance();
            return { type: TokenType.LTE, value: "<=", position: startPos };
        }
        // 4. Check for Star (*)
        if (char === "*") {
            this.advance();
            return { type: TokenType.STAR, value: "*", position: startPos };
        }
        // 5. Check for Greater Than
        if (char === ">") {
            this.advance();
            return { type: TokenType.GT, value: ">", position: startPos };
        }
        // 6. Check for Less Than
        if (char === "<") {
            this.advance();
            return { type: TokenType.LT, value: "<", position: startPos };
        }
        // 7. Check of Equal
        if (char === "=") {
            this.advance();
            return { type: TokenType.EQ, value: "=", position: startPos };
        }
        // 8. Check for comma
        if (char === ",") {
            this.advance();
            return { type: TokenType.COMMA, value: ",", position: startPos };
        }
        // 9. Check for Left Parenthesis
        if (char === "(") {
            this.advance();
            return {
                type: TokenType.L_PARENTHESIS,
                value: "(",
                position: startPos,
            };
        }
        // 10. Check for Right Parenthesis
        if (char === ")") {
            this.advance();
            return {
                type: TokenType.R_PARENTHESIS,
                value: ")",
                position: startPos,
            };
        }
        // 11. String Literals
        if (char === '"' || char === "'") {
            const value = this.readStringLiteral();
            return {
                type: TokenType.STRING_LITERAL,
                value,
                position: startPos,
            };
        }
        // 12. Number Literals
        if (/[0-9]/.test(char)) {
            const value = this.readNumberLiteral();
            return {
                type: TokenType.NUMBER_LITERAL,
                value,
                position: startPos,
            };
        }

        // Handle KEYWORDS and IDENTFIERS
        if (/[a-zA-Z_]/.test(char)) {
            const value = this.readIdentifier();
            const type = this.isKeyword(value) || TokenType.INDETIFIER;
            return { type, value, position: startPos };
        }

        // if not match, throw an error
        this.advance();
        throw new Error(
            `Syntax Error: Unexpected character ${char} at position ${startPos}`
        );
    }

    private skipWhitespace() {
        // Loop and advace untill character is a space.
        while (/\s/.test(this.peakChar() || "")) {
            this.advance();
        }
    }

    public tokenize() {
        const tokens: Array<Token> = [];
        let token;

        do {
            this.skipWhitespace();
            token = this.getNextToken();
            tokens.push(token);
        } while (token.type !== TokenType.EOF);

        return tokens;
    }
}
