
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

// Unique storage key for the PROJECT L.A.K.A.S. F1 draft.
const F1_STORAGE_KEY = "project_lakas_f1_draft_v1";

// Creates an empty response record.
function createEmptyF1Draft() {
    return {
        respondentCode: "",
        evaluationDate: "",
        designs: {}
    };
}

// Retrieves previously saved responses from this browser.
function loadF1Draft() {
    try {
        const saved = localStorage.getItem(F1_STORAGE_KEY);

        if (!saved) {
            return createEmptyF1Draft();
        }

        const parsed = JSON.parse(saved);

        return {
            respondentCode:
                typeof parsed.respondentCode === "string"
                    ? parsed.respondentCode
                    : "",

            evaluationDate:
                typeof parsed.evaluationDate === "string"
                    ? parsed.evaluationDate
                    : "",

            designs:
                parsed.designs &&
                typeof parsed.designs === "object" &&
                !Array.isArray(parsed.designs)
                    ? parsed.designs
                    : {}
        };

    } catch (error) {
        return createEmptyF1Draft();
    }
}

// Keeps a working copy of the responses while the page is open.
let f1Draft = loadF1Draft();

// Saves the working copy to browser storage.
function saveF1DraftToStorage() {
    try {
        localStorage.setItem(
            F1_STORAGE_KEY,
            JSON.stringify(f1Draft)
        );

        return true;

    } catch (error) {
        return false;
    }
}

// Saves the currently displayed questionnaire.
function saveCurrentF1Answers(sketchCode, position) {
    const root = document.getElementById("questionnaire");

    if (!root) return;

    const respondentCodeField =
        root.querySelector("#respondentCode");

    const evaluationDateField =
        root.querySelector("#evaluationDate");

    // Respondent information is shared across all five designs.
    f1Draft.respondentCode = respondentCodeField
        ? respondentCodeField.value
        : "";

    f1Draft.evaluationDate = evaluationDateField
        ? evaluationDateField.value
        : "";

    // Each design receives its own separate set of answers.
    const designAnswers = {};

    F1_ITEMS.forEach((item, index) => {
        const itemNumber = String(index + 1).padStart(2, "0");

        const selectedAnswer = root.querySelector(
            `input[name="item_${itemNumber}"]:checked`
        );

        designAnswers[`item_${itemNumber}`] =
            selectedAnswer ? selectedAnswer.value : "";
    });

    designAnswers.worksWell =
        root.querySelector("#worksWell")?.value || "";

    designAnswers.improvements =
        root.querySelector("#improvements")?.value || "";

    designAnswers.presentationPosition = position;

    f1Draft.designs[sketchCode] = designAnswers;

    const saved = saveF1DraftToStorage();

    const saveStatus = root.querySelector("#saveStatus");

    if (saveStatus) {
        saveStatus.textContent = saved
            ? "Draft saved automatically on this device."
            : "This browser could not save permanently. Answers are only kept while this page remains open.";
    }
}

// Generates the questionnaire for the selected design.
function renderF1Questionnaire(sketchCode, position) {
    const root = document.getElementById("questionnaire");

    if (!root) return;

    const material = EVALUATION_CONFIG.materials[sketchCode];

    if (!material) return;

    // Retrieve previously saved answers for this particular design.
    const savedDesignAnswers =
        f1Draft.designs[sketchCode] || {};

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

        <hr>

        <p
            id="saveStatus"
            role="status"
            aria-live="polite"
        >
            Your answers are saved automatically on this device.
        </p>
    `;

    const questions = document.getElementById("f1Questions");

    // Generate all 12 questions.
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

    // Restore respondent information.
    root.querySelector("#respondentCode").value =
        f1Draft.respondentCode;

    root.querySelector("#evaluationDate").value =
        f1Draft.evaluationDate;

    // Restore the previously selected answers.
    F1_ITEMS.forEach((item, index) => {
        const itemNumber = String(index + 1).padStart(2, "0");

        const savedValue =
            savedDesignAnswers[`item_${itemNumber}`];

        if (!savedValue) return;

        const radioOptions = root.querySelectorAll(
            `input[name="item_${itemNumber}"]`
        );

        radioOptions.forEach(radio => {
            if (radio.value === savedValue) {
                radio.checked = true;
            }
        });
    });

    // Restore written comments.
    root.querySelector("#worksWell").value =
        savedDesignAnswers.worksWell || "";

    root.querySelector("#improvements").value =
        savedDesignAnswers.improvements || "";

    // Show whether this design already had saved answers.
    const saveStatus = root.querySelector("#saveStatus");

    if (Object.keys(savedDesignAnswers).length > 0) {
        saveStatus.textContent =
            "Previously saved answers restored from this browser.";
    }

    // Automatically save whenever a respondent makes a change.
    root.oninput = function () {
        saveCurrentF1Answers(sketchCode, position);
    };

    root.onchange = function () {
        saveCurrentF1Answers(sketchCode, position);
    };
}
