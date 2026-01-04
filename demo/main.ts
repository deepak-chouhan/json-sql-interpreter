import queryJson from "../src/index";

const runBtn = document.getElementById("runBtn");
const jsonInput = document.getElementById("jsonInput") as HTMLTextAreaElement;
const jsonSize = document.getElementById("jsonSize") as HTMLSpanElement;
const sqlInput = document.getElementById("sqlInput") as HTMLInputElement;
const output = document.getElementById("output");
const rowCount = document.getElementById("rowCount") as HTMLSpanElement;

window.onload = (e) => {
    e.preventDefault();
    setInitialInput();
};

runBtn?.addEventListener("click", () => {
    try {
        const data = JSON.parse(jsonInput.value);
        const query = sqlInput.value;

        // Execute the engine
        const results = queryJson(data, query);
        const resultsString = JSON.stringify(results, null, 2);

        output!.innerHTML = resultsString;
        rowCount.innerHTML = `${getRowCount(resultsString) || 0}`;
    } catch (e: any) {
        output!.innerHTML = `Error: ${e.message}`;
        output!.classList.remove("text-slate-700");
        output!.className += " text-red-500";
    }
});

jsonInput.addEventListener("input", () => {
    const size = calculateJsonSize(jsonInput.value);
    jsonSize.innerHTML = `${size || 0.0} KB`;
});

const calculateJsonSize = (data: any) => {
    const bytes = new TextEncoder().encode(jsonInput.value).length;
    return (bytes / 1024).toFixed(1);
};

const getRowCount = (text: string): number => {
    if (!text) return 1;
    return text.split(/\r\n|\r|\n/).length;
};

const setInitialInput = () => {
    const data = {
        users: [
            { id: 1, name: "Alice", meta: { age: 25, city: "Pune" } },
            { id: 2, name: "Bob", meta: { age: 30, city: "Mumbai" } },
            { id: 3, name: "Charlie", meta: { age: 35, city: "Pune" } },
        ],
    };
    const dataString = JSON.stringify(data, null, 2);

    jsonInput.innerHTML = dataString;
    jsonSize.innerHTML = `${calculateJsonSize(dataString) || 0.0} KB`;
};
