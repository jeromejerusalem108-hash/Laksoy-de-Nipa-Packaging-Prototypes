
const F1_ITEMS = [
    "The sketch shows a connection with nipa.",
    "The cultural presentation seems respectful to me.",
    "The name or logo is easy to identify.",
    "The text shown is readable.",
    "The colours and lettering work well together.",
    "The information identifies the intended product as Laksoy.",
    "The intended package shape is clear.",
    "The layout of the package parts is easy to understand.",
    "The intended opening or access is clear in the drawing.",
    "The planned label placement is clear.",
    "The drawing is clear enough for me to judge the visible design.",
    "The visible design elements look consistent with one another."
];

const F1_SCALE = [
    { value: "1", label: "1 - Strongly disagree" },
    { value: "2", label: "2 - Disagree" },
    { value: "3", label: "3 - Neither agree nor disagree" },
    { value: "4", label: "4 - Agree" },
    { value: "5", label: "5 - Strongly agree" },
    { value: "CJ", label: "CJ - Cannot judge or not assessable" }
];

// Generates the questionnaire for the selected design.
function renderF1Questionnaire(sketchCode, position) {
    const root = document.getElementById("questionnaire");

    if (!root) return;

    const material = EVALUATION_CONFIG.materials[sketchCode];

    if (!material) return;

    root.innerHTML = `
        <h2>F1 - Sketch Evaluation</h2>

        <p>
            Evaluate the displayed design.
            Select one answer for each statement.
            You may skip an item or select CJ
            when you cannot judge.
        </p>

        <p><strong>Design:</strong> ${material.name}</p>
        <p><strong>Sketch code:</strong> ${sketchCode}</p>
        <p><strong>Presentation position:</strong> ${position}</p>

        <hr>

        <label for="respondentCode">Respondent code</label>
        <input
            id="respondentCode"
            name="respondentCode"
            type="text"
            placeholder="Enter your assigned code"
        >

        <label for="evaluationDate">Date</label>
        <input
            id="evaluationDate"
            name="evaluationDate"
            type="date"
        >

        <hr>

        <div id="f1Questions"></div>

        <h3>Comments</h3>

        <label for="worksWell">What works well?</label>
        <textarea
            id="worksWell"
            name="worksWell"
            rows="3"
        ></textarea>

        <label for="improvements">What should be improved?</label>
        <textarea
            id="improvements"
            name="improvements"
            rows="3"
        ></textarea>
    `;

    const questions = document.getElementById("f1Questions");

    F1_ITEMS.forEach((item, index) => {
        const itemNumber = String(index + 1).padStart(2, "0");

        const section = document.createElement("fieldset");

        section.innerHTML = `
            <legend>
                ${itemNumber}. ${item}
            </legend>

            <div class="answer-options">
                ${F1_SCALE.map(option => `
                    <label>
                        <input
                            type="radio"
                            name="item_${itemNumber}"
                            value="${option.value}"
                        >
                        ${option.label}
                    </label>
                `).join("")}
            </div>
        `;

        questions.appendChild(section);
    });
}
