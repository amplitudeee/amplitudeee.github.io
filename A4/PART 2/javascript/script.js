const displayedImage = document.querySelector(".displayed-img");
const thumbBar = document.querySelector(".thumb-bar");

const btn = document.querySelector("button");
const overlay = document.querySelector(".overlay");

const images = [
    {
        filename: "pic1.jpg",
        alt: "Closeup of human eye."
    },
    {
        filename: "pic2.jpg",
        alt: "Rock that looks like a wave."
    },
    {
        filename: "pic3.jpg",
        alt: "Purple and white pansies."
    },
    {
        filename: "pic4.jpg",
        alt: "Section of wall from a pharoahs tomb."
    },
    {
        filename: "pic5.jpg",
        alt: "Large moth on a leaf"
    }
];

// Create a constant called baseURL containing the base URL of each image 
// file (all of the URL not including the filename).
const baseURL = "./img/"

// Create a for ... of loop to loop through the images.
for (const image of images)
    {   
        // For each image, create a new <img> element.
        const newImage = document.createElement("img");
        // Set the <img> source to equal the URL of the image, which should be a 
        // combination of the baseURL and the filename, and the alt attribute equal to the alt text.
        newImage.src = baseURL + image.filename;
        newImage.alt = image.alt

        // Add another attribute to the <img> to make it focusable via the keyword.
        newImage.tabIndex = 0;

        // Append the <img> to the thumbBar.
        thumbBar.appendChild(newImage)

        // Add a click event handler to the <img> so that when it is clicked, 
        // a function called updateDisplayedImage() is run, 
        // which displays the clicked image at full size. You'll create this function later on.
        newImage.addEventListener("click", updateDisplayedImage)

        // Add another event handler to the <img> so that once it is focused via the keyboard, 
        // the clicked image can be displayed at full size by pressing the Enter/Return key (and no other key). 
        // This is a stretch goal that will take a bit of research to figure out.
        newImage.addEventListener("keydown", (event) => {
        // Inside the event handler, use an if statement to check whether the key pressed was the Enter/Return key.
        if (event.code === "Enter") {
            updateDisplayedImage(event);
    }});
    }

// Define the function updateDisplayedImage().
function updateDisplayedImage(event) {
    // This function should take a single parameter called event.
    // Inside the function, set the src and alt attributes of the displayedImage <img> 
    // to be the same as those of the image that was clicked (which can be found via event.target).
    displayedImage.src = event.target.src;
    displayedImage.alt = event.target.alt;
}


// Add a click event handler to the button so that when it is clicked,
// a function is run that darkens or lightens the image by changing the overlay <div>.
btn.addEventListener("click", () => {
    // Inside the function, check the current class of the button.
    const btnClass = btn.getAttribute("class");
    // If the class is "dark":
    if (btnClass == "dark") {
        // Change the class to "light".
        btn.setAttribute("class", "light");
        // Change the button text to "Lighten".
        btn.textContent = "Lighten";
        // Change the overlay <div> to be partially transparent.
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
        // If the class is not "dark":
    } else {
        // Change the class to "dark".
        btn.setAttribute("class", "dark");
        // Change the button text to "Darken".
        btn.textContent = "Darken";
        // Change the overlay <div> to be fully transparent.
        overlay.style.backgroundColor = "rgba(0,0,0,0)";
    }
})



