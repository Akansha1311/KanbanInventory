const startEdit__a = document.querySelectorAll(".start-edit");
const startDivContainer = document.querySelector(".start__div");
let id = document.querySelector(".idHidden").innerText.trim();
let lengthHidden = document.querySelector(".lengthHidden").innerText.trim();
//creating the form
let form = document.createElement("form");
form.method = "post";
form.action = "/fabric-sourcing/startTask";

//form length value
let lengthInput = document.createElement("input");
lengthInput.type = "number";
lengthInput.name = "length";
lengthInput.min = "1";
lengthInput.required = true;
if (lengthHidden) {
  lengthInput.max = lengthHidden;
}

//Date of Rec
let date = document.createElement("input");
date.type = "date";
date.name = "date";
//submit button
let submit = document.createElement("input");
submit.type = "submit";
submit.value = "Start";

let div1 = document.createElement("div");
let div2 = document.createElement("div");

div1.classList.add("formgroup");
div2.classList.add("formgroup");

let labelLength = document.createElement("label");
labelLength.innerText = "Length";
labelLength.htmlFor = "length";

let labelDate = document.createElement("label");
labelDate.innerText = "Date of Inspection";
labelDate.htmlFor = "date";

let cancel = document.createElement("button");
cancel.innerText = "Cancel";
cancel.type = "button";
cancel.classList.add("cancel");

cancel.addEventListener("click", function (e) {
  e.preventDefault();
  e.parentElement.children[3].style.display = "none";
  startEdit__a.style.display = "block";
});

div1.appendChild(labelLength);
div1.appendChild(lengthInput);

div2.appendChild(labelDate);
div2.appendChild(date);

//id hidden field
let idFormField = document.createElement("input");
idFormField.innerText = id;
idFormField.name = "id";
idFormField.value = id;
idFormField.type = "hidden";

form.appendChild(idFormField);
form.appendChild(div1);
form.appendChild(div2);
form.appendChild(submit);
form.appendChild(cancel);

form.classList.add("prod__form");

// startEdit__a.addEventListener("click", () => {
//   startEdit__a.style.display = "none";
//   startDivContainer.appendChild(form);
//   form.style.display = "block";
// });

startEdit__a.forEach((e) => {
  e.addEventListener("click", () => {
    e.style.display = "none";
    e.parentElement.appendChild(form);
    e.parentElement.children[3].style.display = "block";
  });
});
