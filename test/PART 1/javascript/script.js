const list = document.querySelector("ul")
const input = document.querySelector("input")
const button = document.querySelector("button")

button.addEventListener("click", (event) => {
  event.preventDefault();

  const myItem = input.value;
  input.value = "";

  const listItem = document.createElement("li");
  const listText = document.createTextNode("span");
  const listBtn = document.createElement("button");

  listItem.appendChild(listText);
  listItem.appendChild(listBtn);
  listText.textContent = myItem;
  listBtn.textContent = "Delete"
  list.appendChild(listItem)

  listBtn.addEventListener("click", () => {
    listItem.remove()
  })

})

