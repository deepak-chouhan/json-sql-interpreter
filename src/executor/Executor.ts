import type { Expression, SelectStatement } from "../types.ts";

export class Executor {
    private resolvePath(data: any, path: string) {
        const parts = path.split(".");
        let current = data;

        for (const part of parts) {
            if (current && typeof current === "object" && part in current) {
                current = current[part];
            } else {
                throw new Error(
                    `PathNotFoundError: '${path}' does not exist in the provided JSON.`
                );
            }
        }

        return current;
    }

    public execute(data: any, ast: SelectStatement) {
        const dataSource = this.resolvePath(data, ast.from.path);

        return dataSource
            .filter((record) => {
                if (!ast.where) return true;

                return this.evaluateExpression(
                    record,
                    ast.where,
                    ast.from.alias
                );
            })
            .map((record) => {
                return this.projectFields(record, ast.fields, ast.from.alias);
            });
    }

    private evaluateExpression(
        record: any,
        expression: Expression,
        alias: string
    ) {
        if (expression.type === "LogicalExpression") {
            const left = this.evaluateExpression(
                record,
                expression.left,
                alias
            );
            const right = this.evaluateExpression(
                record,
                expression.right,
                alias
            );

            return expression.operator === "AND"
                ? left && right
                : left || right;
        }

        if (expression.type === "ComparisonExpression") {
            const actualValue = this.getValueFromRecord(
                record,
                expression.left,
                alias
            );
            const targetValue = expression.right;

            switch (expression.operator) {
                case "=":
                    return actualValue == targetValue;
                case "!=":
                    return actualValue != targetValue;
                case ">":
                    return actualValue > targetValue;
                case ">=":
                    return actualValue >= targetValue;
                case "<":
                    return actualValue < targetValue;
                case "<=":
                    return actualValue <= targetValue;
                default:
                    return false;
            }
        }

        return false;
    }

    private getValueFromRecord(record: any, path: string, alias: string) {
        let targetPath = path;

        // Strip alias
        if (alias && targetPath.startsWith(`${alias}.`)) {
            targetPath = path.slice(alias.length + 1);
        }

        // Resolve Nested Path
        try {
            return this.resolvePath(record, targetPath);
        } catch {
            return undefined;
        }
    }

    private projectFields(record: any, fields: string[] | "*", alias: string) {
        if (fields === "*") return record;

        const projected = {};

        for (const fieldPath of fields) {
            const value = this.getValueFromRecord(record, fieldPath, alias);

            const pathParts = fieldPath.split('.');
            const key = pathParts.at(-1);

            projected[key] = value;
        }

        return projected
    }
}
