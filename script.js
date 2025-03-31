// Dom Elements
const form = document.querySelector("#form");
const editForm = document.querySelector("#edit-form");
const editFormContainer = document.querySelector("#edit-form-container");
const editFormCloseBtn = document.querySelector("#edit-form-close-btn");
const tableBody = document.querySelector("#table-body");

// Locally Saved List in Local Storage
let locallySavedList = JSON.parse(localStorage.getItem("local-list")) || [];

// Functions
(() => {
    if (locallySavedList) {
        locallySavedList.forEach((l, idx) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${l.name}</td>
                <td>${l.id}</td>
                <td>${l.email}</td>
                <td>${l.number}</td>
                <td>
                    <button data-index="${idx}" class="edit-btn">✏️</button>
                </td>
                <td>
            <button data-index="${idx}" class="delete-btn">🗑️</button>
        </td>
            `;
            row.setAttribute("data-index", idx);
            tableBody.appendChild(row);
        });
    }
})();
function saveListToLocalStorage(newList) {
    localStorage.setItem("local-list", JSON.stringify(newList));
    locallySavedList = newList;
}

function openEditForm(dataIndex) {
    if (editFormContainer.classList.contains("hidden")) {
        editFormContainer.classList.remove("hidden");
        editForm.setAttribute("data-index", dataIndex);

        editForm.querySelector("input#name").value =
            locallySavedList[dataIndex].name;
        editForm.querySelector("input#id").value =
            locallySavedList[dataIndex].id;
        editForm.querySelector("input#email").value =
            locallySavedList[dataIndex].email;
        editForm.querySelector("input#number").value =
            locallySavedList[dataIndex].number;
    }
}

function updateRowIndices() {
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row, index) => {
        row.setAttribute("data-index", index);
        const editBtn = row.querySelector(".edit-btn");
        const deleteBtn = row.querySelector(".delete-btn");
        if (editBtn) editBtn.setAttribute("data-index", index);
        if (deleteBtn) deleteBtn.setAttribute("data-index", index);
    });
}

// Event Listeners
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const dataIndex = editForm.getAttribute("data-index");
    if (!dataIndex) return;
    // console.log(dataIndex)

    const formData = new FormData(editForm);

    const name = formData.get("name");
    const id = formData.get("id");
    const email = formData.get("email");
    const number = formData.get("number");

    if (!name || !id || !email || !number) return;

    locallySavedList.splice(dataIndex, 1, {
        name,
        id,
        email,
        number,
    });

    const row = document.querySelector(`tr[data-index="${dataIndex}"]`);

    row.innerHTML = `
        <td>${name}</td>
        <td>${id}</td>
        <td>${email}</td>
        <td>${number}</td>
        <td>
            <button data-index="${dataIndex}" class="edit-btn">✏️</button>
        </td>
        <td>
            <button data-index="${dataIndex}" class="delete-btn">🗑️</button>
        </td>
    `;

    saveListToLocalStorage(locallySavedList);

    editFormContainer.classList.add("hidden");
});

editFormCloseBtn.addEventListener("click", () => {
    if (!editFormContainer.classList.contains("hidden")) {
        editFormContainer.classList.add("hidden");
    }
});

tableBody.addEventListener(
    "click",
    (e) => {
        if (
            e.target ===
            document.querySelector(
                `.edit-btn[data-index="${e.target.getAttribute("data-index")}"]`
            )
        ) {
            // console.log(e.target)
            // console.log(e.target.getAttribute("data-index"));
            const attr = e.target.getAttribute("data-index");
            openEditForm(attr);
        }

        if (
            e.target ===
            document.querySelector(
                `.delete-btn[data-index="${e.target.getAttribute(
                    "data-index"
                )}"]`
            )
        ) {
            const attr = e.target.getAttribute("data-index");
            const row = document.querySelector(`tr[data-index="${attr}"]`);
            row.remove();
            locallySavedList.splice(attr, 1);
            saveListToLocalStorage(locallySavedList);
            updateRowIndices();
        }
    },
    false
);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const name = formData.get("name");
    const id = formData.get("id");
    const email = formData.get("email");
    const number = formData.get("number");

    if (!name || !id || !email || !number) return;

    const row = document.createElement("tr");
    const newList = [
        ...locallySavedList,
        {
            name,
            id,
            email,
            number,
        },
    ];
    saveListToLocalStorage(newList);
    row.setAttribute("data-index", locallySavedList.length - 1);
    row.innerHTML = `
        <td>${name}</td>
        <td>${id}</td>
        <td>${email}</td>
        <td>${number}</td>
        <td>
            <button data-index="${
                locallySavedList.length - 1
            }" class="edit-btn">✏️</button>
        </td>
        <td>
            <button data-index="${
                locallySavedList.length - 1
            }" class="delete-btn">🗑️</button>
        </td>
    `;

    tableBody.appendChild(row);
});
