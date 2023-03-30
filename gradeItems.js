import { Confirm } from "./confirm.js"
import { AddEditGradeItem } from "./addEditGradeItem.js"
import { auth, ref, signOut } from "./firebase.js"

// (A) GET THE PARAMETERS
const params = new URLSearchParams(window.location.search)
const courseId = params.get("courseId")

// (A) GET FROM SESSION
let courseName = localStorage.getItem("courseName")
let courseCode = localStorage.getItem("courseCode")
let average = localStorage.getItem("average")
let potential = localStorage.getItem("potential")
let userId = localStorage.getItem("userId");
let gradeItemsList = JSON.parse(localStorage.getItem("gradeItemsList"));
let eachScale = JSON.parse(localStorage.getItem("eachScale"));

let scaleItemArr = [];
let grade = '';

//TO SORT EACHSCALE
eachScale.forEach((scaleItem) => {
  for (let grade in scaleItem) {
    if (scaleItem.hasOwnProperty(grade)) {
      scaleItemArr.push({
        'key': grade,
        'value': scaleItem[grade]
      });
    }
  }
  scaleItemArr.sort(function (a, b) { return b.value - a.value; });
})
let gradeItem = scaleItemArr.find(prop => prop.value <= average)

//ASSIGN GRADE VALUE
if (gradeItem == undefined) {
  grade = "F";
}
else if (!isNaN(average) && gradeItem.value) {
  grade = gradeItem.key
} else {
  grade = "N/A"
}

if (isNaN(average)) {
  average = "0.00"
}

let tableElement = document.getElementById('tableContainer')
if (gradeItemsList.length == 0) {
  tableElement.innerHTML = 'Click on "Add Item" button to the upper right of the screen to add items to course'
}


// (B) IT WORKS!
// MANUALLY OPENING 1B-SESSION.HTML WILL NOT WORK THOUGH
// SESSION DATA WILL PERISH ONCE TAB/WINDOW IS CLOSED

// (EXTRA) CLEAR SESSION STORAGE
// sessionStorage.removeItem("KEY");
// sessionStorage.clear();
// }

// parent
let gradeItemCard = document.getElementById('gradeItemCard')

let itemsListCard = document.createElement('div')
itemsListCard.className = 'itemsListCard'
itemsListCard.id = 'itemsListCard'
gradeItemCard.appendChild(itemsListCard)

let backBtn = document.createElement('button')
backBtn.className = 'backBtn'
backBtn.id = 'backBtn'
backBtn.textContent = '< Back'

itemsListCard.appendChild(backBtn)

let courseTitle = document.createElement('h2')
courseTitle.className = "courseName"
courseTitle.id = 'courseName'
courseTitle.textContent = `${courseCode}: ${courseName}`
itemsListCard.appendChild(courseTitle)

let addItemBtn = document.createElement('button')
addItemBtn.className = 'addItemBtn'
addItemBtn.id = 'addItemBtn'
addItemBtn.textContent = 'Add Item'
itemsListCard.appendChild(addItemBtn)

let itemsMiddle = document.createElement('div')
itemsMiddle.className = 'itemsMiddle'
itemsMiddle.id = 'itemsMiddle'
gradeItemCard.appendChild(itemsMiddle)

let courseAverageLabel = document.createElement('div')
courseAverageLabel.className = 'courseAverageLabel'
courseAverageLabel.id = 'courseAverageLabel'
courseAverageLabel.textContent = 'Average'
itemsMiddle.appendChild(courseAverageLabel)

let courseAverage = document.createElement('div')
courseAverage.className = 'courseAverage'
courseAverage.id = 'courseAverage'
courseAverage.textContent = average
courseAverageLabel.appendChild(courseAverage)

let CourseGrade = document.createElement('div')
CourseGrade.className = 'CourseGrade'
CourseGrade.id = 'CourseGrade'
CourseGrade.textContent = "Letter Grade"
itemsMiddle.appendChild(CourseGrade)

let CourseGrade1 = document.createElement('div')
CourseGrade1.className = 'CourseGrade1'
CourseGrade1.id = 'CourseGrade1'
CourseGrade1.textContent = grade
CourseGrade.appendChild(CourseGrade1)

let coursePotential = document.createElement('div')
coursePotential.className = 'coursePotential'
coursePotential.id = 'coursePotential'
coursePotential.textContent = 'Potential'
itemsMiddle.appendChild(coursePotential)

let potentialGrade = document.createElement('div')
potentialGrade.className = 'potentialGrade'
potentialGrade.id = 'potentialGrade'
potentialGrade.textContent = potential
coursePotential.appendChild(potentialGrade)

let itemContainers = document.createElement('div')
itemContainers.className = `itemContainers`
gradeItemCard.appendChild(itemContainers)

//SORT TABLE FUNCTION
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("itemsTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//CREATE TABLE
const newTable = document.createElement("table");
newTable.className = "itemsTable"
newTable.id = "itemsTable"
newTable.innerHTML = "<thead><th id='th0'>Item Title &#x2B0D;</th><th id='th1'>Category &#x2B0D;</th><th id='th2'>Weight &#x2B0D;</th><th id='th3'>Due Date &#x2B0D;</th><th id='th4'>Grade &#x2B0D;</th></thead>";

gradeItemsList.forEach(gradeItem => {
  console.log(gradeItemsList)
  let gradeCategory = gradeItem["Asmt Category"]
  let gradeItemTitle = gradeItem["Asmt Title"]
  let gradeItemGrade = gradeItem["Asmt Grade"]
  let gradeItemWeight = gradeItem['Asmt Weight']
  let gradeDueDate = gradeItem['Asmt Due Date']
  let asmtID = gradeItem.asmtID

  const newRow = document.createElement("tr");
  const tdItemTitle = document.createElement("td");
  const tdCategory = document.createElement("td");
  const tdWeight = document.createElement("td");
  const tdDueDate = document.createElement("td");
  const tdGrade = document.createElement("td");
  const editDelete = document.createElement('span');

  tdItemTitle.textContent = gradeItemTitle;
  tdCategory.textContent = gradeCategory;
  tdWeight.textContent = gradeItemWeight;
  tdDueDate.textContent = gradeDueDate;
  tdGrade.textContent = gradeItemGrade;

  newRow.appendChild(tdItemTitle);
  newRow.appendChild(tdCategory);
  newRow.appendChild(tdWeight);
  newRow.appendChild(tdDueDate);
  newRow.appendChild(tdGrade);
  newRow.appendChild(editDelete)
  newTable.appendChild(newRow);

  editDelete.className = 'editDelete'
  let newEdit = document.createElement('button');
  newEdit.className = 'manageEdit'
  newEdit.textContent = 'Edit'
  newEdit.id = `edit_${asmtID}`
  editDelete.appendChild(newEdit)

  let newDelete = document.createElement('button');
  newDelete.className = 'manageDelete'
  newDelete.textContent = 'Delete'
  newDelete.id = `delete_${asmtID}`
  editDelete.appendChild(newDelete)

  const target = document.getElementById('tableContainer');
  target.appendChild(newTable);

  //sort table columns
  document.getElementById('th0').addEventListener('click', (event) => sortTable(0))
  document.getElementById('th1').addEventListener('click', (event) => sortTable(1))
  document.getElementById('th2').addEventListener('click', (event) => sortTable(2))
  document.getElementById('th3').addEventListener('click', (event) => sortTable(3))
  document.getElementById('th4').addEventListener('click', (event) => sortTable(4))

  // Get ref for grade items in database
  let editRef = ref.child(userId).child(courseId).child("Grade Items").child(asmtID)

  //edit Grade
  document.querySelector(`#edit_${asmtID}`).addEventListener('click', (event) => {
    AddEditGradeItem.open({
      title: 'Edit Item',
      onsave: () => updateGradeInfo(),
      oncancel: () => console.log('cancel')
    })

    document.getElementById('titlebox').value = gradeItemTitle
    document.getElementById('categorybox').value = gradeCategory
    document.getElementById('gradebox').value = gradeItemGrade
    document.getElementById('weightbox').value = gradeItemWeight
    document.getElementById('datebox').value = gradeDueDate

    // update Grade
    function updateGradeInfo() {
      // get values from input box
      let titlebox = document.getElementById('titlebox').value;
      let categorybox = document.getElementById('categorybox').value;
      let gradebox = document.getElementById('gradebox').value;
      let weightbox = document.getElementById('weightbox').value;
      let datebox = document.getElementById('datebox').value;


      // condition of save btn 
      if (titlebox.length !== 0 && categorybox.length !== 0 && weightbox.length !== 0 && datebox.length !== 0) {
        if (gradebox.length == 0 || gradebox >= 0) {
          submitEditGrade();
        } else {
          alert('Incorrect input')
        }
      } else {
        alert('You have missed a required field marked *!')
      }

      function submitEditGrade() {
        let gradeObj = {
          "Asmt Title": titlebox,
          "Asmt Category": categorybox,
          "Asmt Grade": gradebox,
          "Asmt Weight": parseInt(weightbox),
          "Asmt Due Date": datebox
        }
        editRef.update(gradeObj)
        window.history.back();
      }
    }
    event.stopPropagation();
  })

  // click the delete button 
  document.querySelector(`#delete_${asmtID}`).addEventListener('click', (event) => {
    Confirm.open({
      title: 'Delete Grade Item',
      message: 'The Grade Item will be removed. Are you sure you which to continue?',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      onok: () => removeGrade(),
      oncancel: () => console.log('cancel')
    })
    event.stopPropagation();
  });

  // delete grade item info
  function removeGrade() {
    editRef.remove()
    console.log('Delete successfully')
    window.history.back();
  }

}) // gradeItemList forEach

// add grade item
document.querySelector(`#addItemBtn`).addEventListener('click', () => {
  AddEditGradeItem.open({
    title: 'Add Item',
    onsave: () => saveItem(),
    oncancel: () => console.log('cancel')
  })


  // add item
  function saveItem() {
    let addRef = ref.child(userId).child(courseId).child("Grade Items")
    let newStoreRef = addRef.push();


    // get values from input box
    let titlebox = document.getElementById('titlebox').value;
    let categoryboxElement = document.getElementById("categorybox").selectedIndex;
    let categorybox = document.getElementsByTagName("option")[categoryboxElement].value;
    let gradebox = document.getElementById('gradebox').value;
    let weightbox = document.getElementById('weightbox').value;
    let datebox = document.getElementById('datebox').value;



    // condition of save btn 
    if (titlebox.length !== 0 && categorybox.length !== 0 && weightbox.length !== 0 && datebox.length !== 0) {
      if (gradebox.length == 0 || gradebox >= 0) {
        submitAddItem();
      } else {
        alert('Incorrect input')
      }
    } else {
      alert('You have missed a required field marked *!')
    }


    function submitAddItem() {
      let gradeObj = {
        "Asmt Title": titlebox,
        "Asmt Category": categorybox,
        "Asmt Grade": gradebox,
        "Asmt Weight": parseInt(weightbox),
        "Asmt Due Date": datebox
      }
      console.log('save')
      newStoreRef.set(gradeObj)
      window.history.back();
    }
  }
}); // add grade item


document.getElementById('backBtn').addEventListener('click', (event) => goBack())

function goBack() {
  window.history.back();
}

document.querySelector(`.logoutButton`).addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      window.location.href = "/Landing Page + Login/index.html";
    })
    .catch((error) => {
      console.log(error);
    });
})

