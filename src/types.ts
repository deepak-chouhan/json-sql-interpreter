export const TokenType = {
    // KEYWORDS
    SELECT: "SELECT",
    FROM: "FROM",
    WHERE: "WHERE",
    AS: "AS",
    AND: "AND",
    OR: "OR",

    // DATA TYPES
    INDETIFIER: "IDENTIFIER",
    STRING_LITERAL: "STRING_LITERAL",
    NUMBER_LITERAL: "NUMER_LITERAL",

    // OPERATORS
    STAR: "*",
    GT: ">",
    LT: "<",
    EQ: "=",
    NE: "!=",
    GTE: ">=",
    LTE: "<=",

    // PUNCTUATION
    COMMA: ",",
    L_PARENTHESIS: "(",
    R_PARENTHESIS: ")",
    EOF: "EOF",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export interface Token {
    type: TokenType;
    value: string;
    position: number;
}

export type Expression =
    | {
          type: "LogicalExpression";
          operator: "AND" | "OR";
          left: Expression;
          right: Expression;
      }
    | {
          type: "ComparisonExpression";
          operator: ">" | "<" | "=" | "!=" | ">=" | "<=";
          left: string;
          right: string | number;
      }
    | { type: "Literal"; value: string | number };

export interface FromClause {
    path: string;
    alias: string;
}

export interface SelectStatement {
    type: "SELECT_STATEMENT";
    fields: string[] | "*";
    from: FromClause;
    where: Expression | null;
}
