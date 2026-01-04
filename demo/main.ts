import queryJson from "../src/index";

const runBtn = document.getElementById("runBtn");
const jsonInput = document.getElementById("jsonInput") as HTMLTextAreaElement;
const sqlInput = document.getElementById("sqlInput") as HTMLInputElement;
const output = document.getElementById("output");

runBtn?.addEventListener("click", () => {
    try {
        const data = JSON.parse(jsonInput.value);
        const query = sqlInput.value;

        // Execute the engine
        const results = queryJson(data, query);

        output!.innerHTML = JSON.stringify(results, null, 2);
        output!.className = "";
    } catch (e: any) {
        output!.innerHTML = `Error: ${e.message}`;
        output!.className = "error";
    }
});
