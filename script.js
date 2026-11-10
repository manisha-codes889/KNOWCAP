
let projectCount = 0;
let interviewCount = 0;
let reportCount = 0;

let projectData = JSON.parse(localStorage.getItem("projectData")) || {};
let answers = JSON.parse(localStorage.getItem("answers")) || [];
let currentQuestion = Number(localStorage.getItem("currentQuestion")) || 0;

let questions = [
    "What is the main purpose of your project?",
    "What are your main responsibilities?",
    "Which tools and technologies are used?",
    "What tasks are currently pending?",
    "What challenges or issues should the next employee know about?",
    "What are the next steps for this project?"
];
// Update Dashboard Readiness Score
function updateReadinessDisplay() {
    const unclearWords = [
        "not sure", "don't know", "unknown",
        "n/a", "nothing", "no idea", "idk"
    ];

    const vagueWords = [
        "good", "fine", "okay", "ok",
        "yes", "no", "nothing", "same", "done"
    ];

    const weakAnswers = answers.filter(item => {
        const answer = item.answer.trim().toLowerCase();

        return answer.length < 5 ||
            unclearWords.includes(answer) ||
            vagueWords.includes(answer);
    });
    const score = Math.max(
        0,
        Math.round(
            ((questions.length - weakAnswers.length) /
            questions.length) * 100
        )
    );

    document.getElementById("readinessScore").textContent =
        score + "%";

    document.querySelector(".readiness-circle").style.background =
        `conic-gradient(#6257e8 ${score * 3.6}deg, #e9eaf3 ${score * 3.6}deg)`;

    const status = document.querySelector(".readiness-status");

    if (score >= 80) {
        status.textContent = "Ready for Handover";
    } else if (score >= 50) {
        status.textContent = "Needs Review";
    } else {
        status.textContent = "Not Ready";
    }
}

// Restore saved dashboard data
function updateDashboard() {
    document.getElementById("weakAnswerCount").textContent =
    localStorage.getItem("weakAnswerCount") || 0;
    projectCount = projectData.employee ? 1 : 0;
    interviewCount = localStorage.getItem("interviewCount") || 0;
    reportCount = localStorage.getItem("reportCount") || 0;

    document.querySelector(".cards .card:nth-child(1) h2").textContent = projectCount;
    document.querySelector(".cards .card:nth-child(2) h2").textContent = interviewCount;
    document.querySelector(".cards .card:nth-child(3) h2").textContent = reportCount;
    document.getElementById("knowledgeGapCount").textContent =
    localStorage.getItem("knowledgeGapCount") || 0;
}

// Restore employee details
window.addEventListener("DOMContentLoaded", function() {
    if (projectData.employee) {
        document.getElementById("employeeName").value = projectData.employee;
        document.getElementById("employeeRole").value = projectData.role;
        document.getElementById("projectName").value = projectData.project;
        document.getElementById("projectDescription").value = projectData.description;
    }

    updateDashboard();
    updateReadinessDisplay();
    if (localStorage.getItem("interviewStarted") === "true") {
    showQuestion();
}
});

// Save employee details
document.getElementById("employeeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    projectData = {
        employee: document.getElementById("employeeName").value,
        role: document.getElementById("employeeRole").value,
        project: document.getElementById("projectName").value,
        description: document.getElementById("projectDescription").value
    };

    localStorage.setItem("projectData", JSON.stringify(projectData));

    updateDashboard();
    alert("Project details saved successfully!");
});

// Start interview
function startInterview() {
    if (!projectData.employee) {
        alert("Please save employee and project details first.");
        return;
    }

    currentQuestion = 0;
    localStorage.setItem("currentQuestion", "0");
localStorage.setItem("interviewStarted", "true");
    answers = [];

    localStorage.setItem("answers", JSON.stringify(answers));

    interviewCount = Number(localStorage.getItem("interviewCount") || 0) + 1;
    localStorage.setItem("interviewCount", interviewCount);

    updateDashboard();
    showQuestion();
}

// Display questions
function showQuestion() {
    const area = document.getElementById("interviewArea");

    if (currentQuestion < questions.length) {
        area.innerHTML = `
            <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
            <p>${questions[currentQuestion]}</p>
            <textarea id="answerInput" placeholder="Enter your answer..."></textarea>
            <button onclick="saveAnswer()">Save Answer & Continue</button>
        `;
    } else {
        area.innerHTML = `
            <h3>Interview Completed!</h3>
            <p>All answers have been recorded.</p>
            <button onclick="generateReport()">Generate Handover Report</button>
        `;
    }
}

// Save answers
function saveAnswer() {
    const answer = document.getElementById("answerInput").value.trim();

    if (!answer) {
        alert("Please enter your answer.");
        return;
    }

    answers.push({
        question: questions[currentQuestion],
        answer: answer
    });

    localStorage.setItem("answers", JSON.stringify(answers));
    updateReadinessDisplay();

    currentQuestion++;
    localStorage.setItem("currentQuestion", currentQuestion);
    showQuestion();
}

// Generate report
function generateReport() {
    const getAnswer = (index) =>
        answers[index]?.answer?.trim() || "Not provided";

    const purpose = getAnswer(0);
    const responsibilities = getAnswer(1);
    const technologies = getAnswer(2);
    const pendingTasks = getAnswer(3);
    const challenges = getAnswer(4);
    const nextSteps = getAnswer(5);

    const unclearWords = [
    "not sure",
    "don't know",
    "unknown",
    "n/a",
    "nothing",
    "no idea",
    "idk"
];
const vagueWords = [
    "good",
    "fine",
    "okay",
    "ok",
    "yes",
    "no",
    "nothing",
    "same",
    "done"
];

const vagueAnswers = answers.filter(item => {
    const answer = item.answer.trim().toLowerCase();

    return vagueWords.includes(answer);
});
const weakAnswers = answers.filter(item => {
    const answer = item.answer.trim().toLowerCase();

    return answer.length < 5 ||
        ["good", "fine", "okay", "ok", "yes", "no", "nothing", "same", "done", "idk"].includes(answer);
});

const readinessScore = Math.max(
    0,
    Math.round(
        ((questions.length - weakAnswers.length) / questions.length) * 100
    )
);

let readinessStatus;

if (readinessScore >= 80) {
    readinessStatus = "Ready for Handover";
} else if (readinessScore >= 50) {
    readinessStatus = "Needs Review";
} else {
    readinessStatus = "Not Ready";
}
updateReadinessDisplay();
const missing = answers
    .filter(item => {
        const answer = item.answer.trim().toLowerCase();

        return answer.length < 5 ||
               unclearWords.some(word => answer === word);
    })
    .map(item => item.question);
        const followUpQuestions = [];
        const knowledgeGaps = [];
        

if (purpose.length < 40) {
    knowledgeGaps.push("Project purpose is incomplete.");
}

if (responsibilities.length < 40) {
    knowledgeGaps.push("Employee responsibilities need more details.");
}

if (technologies.length < 40) {
    knowledgeGaps.push("Technology and tools documentation is incomplete.");
}

if (pendingTasks.length < 40) {
    knowledgeGaps.push("Pending task details are missing or incomplete.");
}

if (challenges.length < 40) {
    knowledgeGaps.push("Project challenges need documentation.");
}

if (nextSteps.length < 40) {
    knowledgeGaps.push("Next steps are not clearly documented.");
}

if (purpose.length < 40) {
    followUpQuestions.push("Can you explain the main purpose and expected outcome of this project?");
}

if (responsibilities.length < 40) {
    followUpQuestions.push("What are your daily responsibilities and important tasks?");
}

if (technologies.length < 40) {
    followUpQuestions.push("Which tools, technologies and software versions are used?");
}

if (pendingTasks.length < 40) {
    followUpQuestions.push("What tasks are still pending, and what are their deadlines?");
}

if (challenges.length < 40) {
    followUpQuestions.push("What problems occurred, and how can the next employee solve them?");
}

if (nextSteps.length < 40) {
    followUpQuestions.push("What should the next employee do first?");
}
document.getElementById("knowledgeGapCount").textContent =
    knowledgeGaps.length;
   

localStorage.setItem(
    "knowledgeGapCount",
    knowledgeGaps.length
);
    const recommendations = [];
    if (knowledgeGaps.length > 0) {
    recommendations.push(
        `${knowledgeGaps.length} knowledge gap(s) detected. Review the missing information before handover.`
    );
} else {
    recommendations.push(
        "All six knowledge areas have sufficient answer length. Manual verification is still recommended."
    );
}
    const projectRisks = [];

    const pendingTaskCount = tasks.filter(
    task => task.status === "Pending"
).length;

if (pendingTaskCount > 0) {
    projectRisks.push(
        `HIGH RISK: ${pendingTaskCount} task(s) are still pending.`
    );
} else if (tasks.length === 0 || pendingTasks.length < 40) {
    projectRisks.push(
        "MEDIUM RISK: Pending task information needs manual review."
    );
}

if (challenges.length < 40) {
    projectRisks.push("MEDIUM RISK: Project challenges are not fully documented.");
}

if (technologies.length < 40) {
    projectRisks.push("MEDIUM RISK: Technical tools and documentation details are incomplete.");
}

if (nextSteps.length < 40) {
    projectRisks.push("HIGH RISK: Next actions are not clearly defined.");
}

if (projectRisks.length === 0) {
    projectRisks.push("No major risks detected by the basic rule-based checks. Manual review is recommended.");
}

if (pendingTaskCount > 0 ||
    (tasks.length === 0 && pendingTasks.length < 40)) {
    recommendations.push(
        "Clearly document pending tasks, owners and deadlines."
    );
}

    if (challenges.length < 40)
        recommendations.push("Record project challenges and their possible solutions.");

    if (nextSteps.length < 40)
        recommendations.push("Define clear next steps and priorities.");

    if (technologies.length < 40)
        recommendations.push("Document tools, software versions and access requirements.");

    if (missing.length > 0)
        recommendations.push("Conduct a follow-up interview to fill missing knowledge.");

    if (recommendations.length === 0)
        recommendations.push("Review all information and confirm a complete handover.");

    const report = `
KNOWCAP - HANDOVER REPORT
================================

EMPLOYEE DETAILS
Employee: ${projectData.employee}
Role: ${projectData.role}
Project: ${projectData.project}
HANDOVER READINESS SCORE
Score: ${readinessScore}%
Status: ${readinessStatus}

PROJECT OVERVIEW
${purpose}

RESPONSIBILITIES
${responsibilities}

TOOLS AND TECHNOLOGIES
${technologies}

PENDING TASKS (INTERVIEW)
${pendingTasks}

PENDING TASK TRACKER DETAILS
${tasks.length
    ? tasks.map((task, i) =>
        `${i + 1}. ${task.name}
   Owner: ${task.owner}
   Deadline: ${task.deadline}
   Priority: ${task.priority}
   Status: ${task.status}`
    ).join("\n\n")
    : "No tasks added in Task Tracker."}

KNOWN CHALLENGES
${challenges}
EMPLOYEE HANDOVER CHECKLIST
${[...handoverChecks].map((checkbox, index) =>
    `${index + 1}. ${checkbox.checked ? "[COMPLETED]" : "[PENDING]"} ${checkbox.parentElement.textContent.trim()}`
).join("\n")}

CHECKLIST PROGRESS
${[...handoverChecks].filter(checkbox => checkbox.checked).length} of ${handoverChecks.length} completed

NEXT STEPS
${nextSteps}

KNOWLEDGE GAPS
${missing.length ? missing.join("\n") : "No short answers detected. Manual review is recommended."}
VAGUE ANSWERS
${vagueAnswers.length
    ? vagueAnswers.map(item => `${item.question}\nAnswer: ${item.answer}\nPlease provide more specific details.`).join("\n\n")
    : "No vague answers detected."}

IMPROVEMENT RECOMMENDATIONS
${recommendations.map((item, i) => `${i + 1}. ${item}`).join("\n")}
FOLLOW-UP QUESTIONS
${followUpQuestions.length
    ? followUpQuestions.map((item, i) => `${i + 1}. ${item}`).join("\n")
    : "No follow-up questions required."}
    KNOWLEDGE GAP DETECTION
${knowledgeGaps.length
    ? knowledgeGaps.map((item, i) => `${i + 1}. ${item}`).join("\n")
    : "No major knowledge gaps detected by basic checks."}
    PROJECT RISK ANALYSIS
${projectRisks.map((item, i) => `${i + 1}. ${item}`).join("\n")}

================================
Generated by KNOWCAP
`;

    document.getElementById("reportArea").innerHTML = `
        <h3>Handover Report Generated!</h3>
        <button onclick="downloadReport()">Download Report</button>
        <pre id="reportText"></pre>
    `;

    document.getElementById("reportText").textContent = report;

    reportCount = Number(localStorage.getItem("reportCount") || 0) + 1;
    localStorage.setItem("reportCount", reportCount);

    updateDashboard();
    localStorage.setItem("reportContent", report);
    window.reportContent = report;
}
// Download report
function downloadReport() {
    const report = localStorage.getItem("reportContent");

    if (!report) {
        alert("Please generate the report first.");
        return;
    }

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "KNOWCAP-Handover-Report.txt";
    link.click();

    URL.revokeObjectURL(url);
}
// Pending Task Tracker

let tasks = JSON.parse(localStorage.getItem("knowcapTasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        const name = document.createElement("h3");
        name.textContent = task.name;

        const details = document.createElement("p");
        details.textContent =
            `Owner: ${task.owner} | Deadline: ${task.deadline} | Priority: ${task.priority}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${task.status}`;

        const statusButton = document.createElement("button");
        statusButton.textContent = "Mark Completed";
        statusButton.onclick = () => {
            tasks[index].status = "Completed";
            saveTasks();
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
        };

        taskItem.append(name, details, status, statusButton, deleteButton);
        taskList.appendChild(taskItem);
    });
}

function saveTasks() {
    localStorage.setItem("knowcapTasks", JSON.stringify(tasks));
    displayTasks();
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const task = {
        name: document.getElementById("taskName").value,
        owner: document.getElementById("taskOwner").value,
        deadline: document.getElementById("taskDeadline").value,
        priority: document.getElementById("taskPriority").value,
        status: "Pending"
    };

    tasks.push(task);
    saveTasks();
    taskForm.reset();
});

displayTasks();
// Employee Handover Checklist

const handoverChecks = document.querySelectorAll(".handover-check");

let savedChecklist = JSON.parse(
    localStorage.getItem("knowcapChecklist")
) || [];

handoverChecks.forEach((checkbox, index) => {

    checkbox.checked = savedChecklist[index] || false;

    checkbox.addEventListener("change", function() {

        savedChecklist[index] = checkbox.checked;

        localStorage.setItem(
            "knowcapChecklist",
            JSON.stringify(savedChecklist)
        );

        updateHandoverChecklist();
    });
});

function updateHandoverChecklist() {

    const completed = [...handoverChecks]
        .filter(checkbox => checkbox.checked).length;

    document.getElementById("checklistProgress").textContent =
        `${completed} of ${handoverChecks.length} completed`;
}

updateHandoverChecklist();
