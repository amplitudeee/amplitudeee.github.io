const displayedImage = document.querySelector(".displayed-img");
const thumbBar = document.querySelector(".thumb-bar");

const btn = document.querySelector("button");
const overlay = document.querySelector(".overlay");

const images = [
    {
        filename: ["pic1.jpg"],
        alt: "Closeup of human eye."
    },
    {
        filename: ["pic2.jpg"],
        alt: "Rock that looks like a wave."
    },
    {
        filename: ["pic3.jpg"],
        alt: "Purple and white pansies."
    },
    {
        filename: ["pic4.jpg"],
        alt: "Section of wall from a pharoahs tomb."
    },
    {
        filename: ["pic5.jpg"],
        alt: "Large moth on a leaf"
    }
];

// Create a constant called baseURL containing the base URL of each image file (all of the URL not including the filename).
const baseURL = "./img/"

// Create a for ... of loop to loop through the images.
for (image in images);
    {
        // For each image, create a new <img> element.
        const newImage = document.createElement("img");
        // Set the <img> source to equal the URL of the image, which should be a combination of the baseURL and the filename, and the alt attribute equal to the alt text.
        newImage.src = baseURL + image.filename;
        newImage.alt = image.alt

        // Add another attribute to the <img> to make it focusable via the keyword.
        image.setAttribute("tabindex", "0");

        // Append the <img> to the thumbBar.
        document.body.appendChild(img)

    }

// Add a click event handler to the <img> so that when it is clicked, a function called updateDisplayedImage() is run, which displays the clicked image at full size. You'll create this function later on.
// Add another event handler to the <img> so that once it is focused via the keyboard, the clicked image can be displayed at full size by pressing the Enter/Return key (and no other key). This is a stretch goal that will take a bit of research to figure out.