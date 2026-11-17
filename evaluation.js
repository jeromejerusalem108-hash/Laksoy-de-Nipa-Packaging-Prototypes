
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
    { value: "CJ", label: "CJ - Cannot judge" }
];

// Draft storage is limited to the current browser tab session.
const F1_STORAGE_KEY =
    "project_lakas_f1_session_draft_v2";

// Remove the old persistent draft, which could contain
// respondent codes or other information from earlier tests.
try {
    localStorage.removeItem("project_lakas_f1_draft_v1");
} catch (error) {
    // Continue if browser storage is unavailable.
}

// Create an empty draft.
function createEmptyF1Draft() {
    return {
        designs: {}
    };
}

// Load the current session's draft.
function loadF1Draft() {
    try {
        const saved =
            sessionStorage.getItem(F1_STORAGE_KEY);

        if (!saved) {
            return createEmptyF1Draft();
        }

        const parsed = JSON.parse(saved);

        return {
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

// Working copy of the responses.
let f1Draft = loadF1Draft();

// Track which designs have been viewed during this session.
const F1_VISITED_KEY =
    "project_lakas_f1_visited_v1";

// Load previously viewed designs.
function loadF1VisitedDesigns() {
    try {
        const saved = JSON.parse(
            sessionStorage.getItem(F1_VISITED_KEY) || "[]"
        );

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved.filter(code =>
            EVALUATION_CONFIG.sketchOrder.includes(code)
        );

    } catch (error) {
        return [];
    }
}

// Working list of viewed designs.
let f1VisitedDesigns = loadF1VisitedDesigns();

// Update the final submission section.

function updateF1SubmissionStatus() {
    const section =
        document.getElementById("submissionSection");

    const status =
        document.getElementById("completionStatus");

    const reviewButton =
        document.getElementById("reviewResponsesButton");

    const total =
        EVALUATION_CONFIG.sketchOrder.length;

    const visited =
        EVALUATION_CONFIG.sketchOrder.filter(
            code => f1VisitedDesigns.includes(code)
        ).length;

    const allViewed = visited === total;

    if (section) {
        section.hidden = !allViewed;
    }

    if (status) {
        status.textContent = allViewed
            ? "All five design presentations have been viewed. You may now review your responses."
            : `${visited} of ${total} design presentations viewed.`;
    }

    if (reviewButton) {
        reviewButton.disabled = !allViewed;
    }
}


// Record a design as viewed.
function markF1DesignVisited(sketchCode) {
    if (
        !EVALUATION_CONFIG.sketchOrder.includes(sketchCode)
    ) {
        return;
    }

    if (!f1VisitedDesigns.includes(sketchCode)) {
        f1VisitedDesigns.push(sketchCode);

        try {
            sessionStorage.setItem(
                F1_VISITED_KEY,
                JSON.stringify(f1VisitedDesigns)
            );
        } catch (error) {
            // Continue without session tracking if storage fails.
        }
    }

    updateF1SubmissionStatus();
}

// Save the current draft to session storage.
function saveF1DraftToStorage() {
    try {
        sessionStorage.setItem(
            F1_STORAGE_KEY,
            JSON.stringify(f1Draft)
        );

        return true;

    } catch (error) {
        return false;
    }
}

// Update the progress indicator.
function updateF1Progress(root) {
    if (!root) return;

    const answered = F1_ITEMS.filter((item, index) => {
        const itemNumber =
            String(index + 1).padStart(2, "0");

        return root.querySelector(
            `input[name="item_${itemNumber}"]:checked`
        );
    }).length;

    const progressFill =
        root.querySelector("#progressFill");

    const progressText =
        root.querySelector("#progressText");

    if (progressFill) {
        progressFill.style.width =
            (answered / F1_ITEMS.length * 100) + "%";
    }

    if (progressText) {
        progressText.textContent =
            `${answered} of ${F1_ITEMS.length} answered`;
    }
}

// Save the currently displayed design.
function saveCurrentF1Answers(sketchCode, position) {
    const root =
        document.getElementById("questionnaire");

    if (!root) return;

    const designAnswers = {};

    F1_ITEMS.forEach((item, index) => {
        const itemNumber =
            String(index + 1).padStart(2, "0");

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

    const saveStatus =
        root.querySelector("#saveStatus");

    if (saveStatus) {
        saveStatus.textContent = saved
            ? "Draft saved for this browser tab session."
            : "Unable to save this draft. Your current answers remain available while this page stays open.";
    }

    updateF1Progress(root);
}

// Generate the questionnaire.
function renderF1Questionnaire(sketchCode, position) {
    const root =
        document.getElementById("questionnaire");

    if (!root) return;

    const material =
        EVALUATION_CONFIG.materials[sketchCode];

    if (!material) return;
markF1DesignVisited(sketchCode);
    const savedDesignAnswers =
        f1Draft.designs[sketchCode] || {};

    root.innerHTML = `
        <div class="panel-heading">
            <h2>F1 Packaging Design Evaluation</h2>

            <p>
                Examine the displayed packaging sketch and
                provide your assessment using the rating
                scale below.
            </p>
        </div>

        <div class="design-summary">
            <div class="design-name">
                ${material.name}
            </div>

            <div class="design-position">
                Design ${position} of 5 · ${sketchCode}
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-label">
                <span>Questionnaire progress</span>
                <span id="progressText">0 of 12 answered</span>
            </div>

            <div
                class="progress-track"
                role="progressbar"
                aria-label="Questionnaire completion"
                aria-valuemin="0"
                aria-valuemax="12"
                aria-valuenow="0"
                id="progressTrack"
            >
                <div
                    class="progress-fill"
                    id="progressFill"
                ></div>
            </div>
        </div>

        <h3 class="section-heading">
            Evaluation Statements
        </h3>

        <p class="section-description">
            Select one response for each statement.
            You may leave an item unanswered or select
            CJ when you cannot judge.
        </p>

        <div id="f1Questions"></div>

        <h3 class="section-heading">
            Written Feedback
        </h3>

        <p class="section-description">
            Share your observations and suggestions
            about the displayed design.
        </p>

        <div class="comment-card">
            <label for="worksWell">
                What Works Well?
            </label>

            <textarea
                id="worksWell"
                name="worksWell"
                placeholder="Describe the strengths or features you appreciate in this design."
            ></textarea>
        </div>

        <div class="comment-card">
            <label for="improvements">
                Suggested Improvements
            </label>

            <textarea
                id="improvements"
                name="improvements"
                placeholder="Describe any changes or improvements you would recommend."
            ></textarea>
        </div>

        <div
            class="save-status"
            id="saveStatus"
            role="status"
            aria-live="polite"
        >
            Your answers will be saved during this browser tab session.
        </div>
    `;

    const questions =
        root.querySelector("#f1Questions");

    // Generate the 12 evaluation statements.
    F1_ITEMS.forEach((item, index) => {
        const itemNumber =
            String(index + 1).padStart(2, "0");

        const section =
            document.createElement("fieldset");

        section.className = "question-card";

        const legend =
            document.createElement("legend");

        const number =
            document.createElement("span");

        number.className = "question-number";
        number.textContent = itemNumber + ".";

        legend.appendChild(number);
        legend.appendChild(
            document.createTextNode(" " + item)
        );

        section.appendChild(legend);

        const options =
            document.createElement("div");

        options.className = "answer-options";

        F1_SCALE.forEach(option => {
            const label =
                document.createElement("label");

            const radio =
                document.createElement("input");

            radio.type = "radio";
            radio.name = `item_${itemNumber}`;
            radio.value = option.value;

            const text =
                document.createElement("span");

            text.textContent = option.label;

            label.appendChild(radio);
            label.appendChild(text);

            options.appendChild(label);
        });

        section.appendChild(options);
        questions.appendChild(section);
    });

    // Restore saved answers for this design.
    F1_ITEMS.forEach((item, index) => {
        const itemNumber =
            String(index + 1).padStart(2, "0");

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

    // Restore the progress indicator.
    updateF1Progress(root);

    // Display the current save state.
    const saveStatus =
        root.querySelector("#saveStatus");

    if (Object.keys(savedDesignAnswers).length > 0) {
        saveStatus.textContent =
            "Previously saved answers restored for this browser tab session.";
    }

    // Save whenever a participant changes an answer.
    root.oninput = function () {
        saveCurrentF1Answers(sketchCode, position);
    };

    root.onchange = function () {
        saveCurrentF1Answers(sketchCode, position);
    };
}

// Display a review of all five design responses.
function showF1ResponseReview() {
    const submissionSection =
        document.getElementById("submissionSection");

    if (!submissionSection) return null;

    let reviewPanel =
        document.getElementById("responseReviewPanel");

    if (!reviewPanel) {
        reviewPanel = document.createElement("div");
        reviewPanel.id = "responseReviewPanel";
        reviewPanel.className = "response-review-panel";

        submissionSection.appendChild(reviewPanel);
    }

    // Clear the previous review.
    reviewPanel.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = "Response Review";
    reviewPanel.appendChild(heading);

    const description = document.createElement("p");
    description.textContent =
        "Please check your responses for each design before submitting.";
    reviewPanel.appendChild(description);

    // Sort designs according to their presentation positions.
    const designs = EVALUATION_CONFIG.sketchOrder
        .map(code => ({
            code,
            answers: f1Draft.designs[code] || {}
        }))
        .sort((a, b) =>
            (a.answers.presentationPosition || 0) -
            (b.answers.presentationPosition || 0)
        );

    designs.forEach(({ code, answers }) => {
        const material =
            EVALUATION_CONFIG.materials[code];

        const designHeading =
            document.createElement("h4");

        designHeading.textContent =
            `${answers.presentationPosition || "-"} of 5 - ${material.name} (${code})`;

        reviewPanel.appendChild(designHeading);

        const answerList =
            document.createElement("ol");

        F1_ITEMS.forEach((item, index) => {
            const itemNumber =
                String(index + 1).padStart(2, "0");

            const value =
                answers[`item_${itemNumber}`] || "";

            const option =
                F1_SCALE.find(entry => entry.value === value);

            const listItem =
                document.createElement("li");

            listItem.textContent =
                `${item} — ${option ? option.label : "Not answered"}`;

            answerList.appendChild(listItem);
        });

        reviewPanel.appendChild(answerList);

        const worksWell =
            document.createElement("p");

        worksWell.textContent =
            "What Works Well? " +
            (answers.worksWell || "No comment provided.");

        reviewPanel.appendChild(worksWell);

        const improvements =
            document.createElement("p");

        improvements.textContent =
            "Suggested Improvements: " +
            (answers.improvements || "No comment provided.");

        reviewPanel.appendChild(improvements);
    });

    reviewPanel.hidden = false;

    return reviewPanel;
}

// Connect the Review Responses button.
const reviewResponsesButton =
    document.getElementById("reviewResponsesButton");


if (reviewResponsesButton) {
    reviewResponsesButton.addEventListener("click", () => {
        const reviewPanel =
            document.getElementById("responseReviewPanel");

        if (reviewPanel && !reviewPanel.hidden) {
            reviewPanel.hidden = true;

            reviewResponsesButton.textContent =
                "Review Responses";

            return;
        }

        const newReviewPanel = showF1ResponseReview();

        if (newReviewPanel) {
            reviewResponsesButton.textContent =
                "Hide Response Review";

            newReviewPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}
