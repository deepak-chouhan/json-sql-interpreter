import {
    TokenType,
    type Expression,
    type SelectStatement,
    type Token,
} from "../types.ts";

export class Parser {
    private readonly tokens: Token[];
    private readonly operators = [
        TokenType.EQ,
        TokenType.GT,
        TokenType.GTE,
        TokenType.LT,
        TokenType.LTE,
        TokenType.NE,
    ];
    private position: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private peek() {
        return this.tokens[this.position];
    }

    private isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    private advance() {
        if (!this.isAtEnd()) this.position++;
        return this.tokens[this.position - 1];
    }

    private check(type: TokenType) {
        // Checks for a token type
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: TokenType, message: string) {
        if (this.check(type)) return this.advance();

        const token = this.peek();
        throw new Error(
            `[Parser Error] ${message} at position ${token.position}. Found '${token.value}' instead.`
        );
    }

    private parseExpression() {
        let expression = this.parseAnd();

        while (this.match(TokenType.OR)) {
            const operator = "OR";
            const right = this.parseAnd();

            expression = {
                type: "LogicalExpression",
                operator,
                left: expression,
                right,
            };
        }

        return expression;
    }

    private parseAnd(): Expression {
        let expression = this.parseComparison();

        while (this.match(TokenType.AND)) {
            const operator = "AND";
            const right = this.parseComparison();

            expression = {
                type: "LogicalExpression",
                operator,
                left: expression,
                right,
            };
        }

        return expression;
    }

    private parseComparison(): Expression {
        if (this.match(TokenType.L_PARENTHESIS)) {
            const expr = this.parseExpression(); // Recursive call
            this.consume(
                TokenType.R_PARENTHESIS,
                "Expect ')' after expression"
            );
            return expr;
        }

        const left = this.consume(
            TokenType.INDETIFIER,
            "Expect variable name"
        ).value;

        const token = this.peek();
        if (this.match(...this.operators)) {
            const operator = token.value as any;
            const rightToken = this.advance();

            let rightValue: number | string;
            if (rightToken.type === TokenType.NUMBER_LITERAL) {
                rightValue = Number(rightToken.value);
            } else {
                rightValue = rightToken.value;
            }

            return {
                type: "ComparisonExpression",
                operator,
                left,
                right: rightValue,
            };
        }

        throw new Error(`Expect comparison operator at ${token.position}`);
    }

    public parse(): SelectStatement {
        // Parse SELECT and Its identifiers
        this.consume(TokenType.SELECT, "Expect 'SELECT'");
        let fields: string[] | "*" = [];
        if (this.match(TokenType.STAR)) {
            fields = "*";
        } else {
            do {
                const field = this.advance();
                fields.push(field.value);
            } while (this.match(TokenType.COMMA));
        }
        // PARSE FROM and Its identifiers
        this.consume(TokenType.FROM, "Expect 'FROM'");
        const path = this.consume(
            TokenType.INDETIFIER,
            "Expect data source path"
        ).value;

        let alias = "";
        if (this.match(TokenType.AS)) {
            alias = this.consume(
                TokenType.INDETIFIER,
                "Expect alias after 'AS'"
            ).value;
        }

        // PARSE WHERE and Its identifiers
        let where = null;
        if (this.match(TokenType.WHERE)) {
            where = this.parseExpression();
        }

        return {
            type: "SELECT_STATEMENT",
            fields,
            from: { path, alias },
            where,
        };
    }
}
