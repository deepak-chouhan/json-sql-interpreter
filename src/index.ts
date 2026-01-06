import { Executor } from "./executor/Executor.js";
import { Lexer } from "./lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";

console.log("JSON Query Tool Initialized...");

const queryJson = (jsonSource: object, sqlQuery: string, debug = false) => {
    const lexer = new Lexer(sqlQuery);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const executor = new Executor();
    const result = executor.execute(jsonSource, ast);

    return result
};

export default queryJson;
