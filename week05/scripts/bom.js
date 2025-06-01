const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list'); // The <ul> element

// Declare an array named chaptersArray and assign it to the results of getChapterList()
// Add a compound OR condition to assign it an empty array in case this is the user's first visit
let chaptersArray = getChapterList() || [];

// Populate the displayed list of chapters on page load
chaptersArray.forEach(chapter => {
    displayList(chapter);
});

// Event listener for the "Add Chapter" button
button.addEventListener('click', () => {
    if (input.value.trim() !== '') { // Make sure the input is not empty
        // 1. Call displayList with the input.value argument
        displayList(input.value);

        // 2. Push the input.value into the chaptersArray
        chaptersArray.push(input.value);

        // 3. Update localStorage with the new array by calling setChapterList
        setChapterList();

        // 4. Set the input.value to nothing
        input.value = '';

        // 5. Set the focus back to the input
        input.focus();
    }
});

// Function to build and display a list item with a delete button
function displayList(item) {
    let li = document.createElement('li');
    let deletebutton = document.createElement('button');

    li.textContent = item; // Note the use of the displayList parameter 'item'
    deletebutton.textContent = '❌';
    deletebutton.classList.add('delete'); // This references the CSS rule .delete{} to size the delete button

    li.append(deletebutton);
    list.append(li);

    // Add functionality to the delete button
    deletebutton.addEventListener('click', function () {
        list.removeChild(li); // Remove the list item from the display
        deleteChapter(li.textContent); // Call the function to remove the chapter from the array and localStorage
        input.focus(); // Set the focus back to the input
    });
}

// Function to set the localStorage item (stringify the array)
function setChapterList() {
    localStorage.setItem('myFavBOMList', JSON.stringify(chaptersArray));
}

// Function to get the localStorage item (parse the string into an array)
function getChapterList() {
    // This function returns null if the item doesn't exist, which is handled by the '|| []' in the declaration
    return JSON.parse(localStorage.getItem('myFavBOMList'));
}

// Function to delete a chapter from the array and update localStorage
function deleteChapter(chapter) {
    // Reformat the chapter parameter to get rid of the ❌ that is passed on the end of the chapter string
    chapter = chapter.slice(0, chapter.length - 1); // This slices off the last character (the '❌')

    // Redefine the chaptersArray using the array.filter method to return everything except the chapter to be removed
    chaptersArray = chaptersArray.filter(item => item !== chapter);

    // Call the setChapterList function to update the localStorage item
    setChapterList();
}