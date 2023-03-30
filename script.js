import { auth, ref, signOut } from "./firebase.js"
import { Course } from "./Course.js"
import { getAccentColorFor, getTextColorForBackground } from "./helperFunctions.js"
import { Confirm } from "./confirm.js"
import { AddEditCourse } from "./addEditCourse.js"
import { DueAsmt } from "./upcomingAsmt.js"

let dueAsmtList = [];

// add course
document.querySelector(`#addForCourse`).addEventListener('click', () => {
  AddEditCourse.open({
    Coursetitle: 'Add Course',
    onsave: () => saveCourse(),
    oncancel: () => console.log('cancel')
  })

  // show current course color(black border) & selected color(red border)    
  let courseColorOptions = ["lightPink", "pink", "red", "orange", "yellow", "lightYellow", "lightPurple", "purple", "darkPurple", "darkBlue", "blue", "lightBlue", "lightGreen", "green", "darkGreen", "darkGray"]

  let selectedColor = ''

  // make color buttons & border
  for (let color of courseColorOptions) {
    let colorButtonsContainer = document.getElementById('colorButtonsContainer')

    let colorOptionButton = document.createElement('button');

    colorOptionButton.style.backgroundColor = `var(--${color})`
    colorOptionButton.className = 'color__button'
    colorOptionButton.id = `${color}`
    colorButtonsContainer.appendChild(colorOptionButton);

    colorOptionButton.onclick = function () {
      updateBorder('.color__button', this.id);
      selectedColor = this.id
    }
  }

  function updateBorder(className, selectedId) {
    let colorButtons = document.querySelectorAll(className);
    colorButtons.forEach(colorButton => colorButton.style.border = 'none');
    document.getElementById(selectedId).style.border = 'solid 2px red';
  }

  if (selectedColor === "") {
    selectedColor = 'darkGray';
  }

  // silder GPA Scale
  document.querySelector('#showGpaScale').addEventListener('click', () => {
    let el = document.getElementById("gpaScale");
    if (el.className === 'inactive') {
      el.className = 'active';
    } else {
      el.className = 'inactive';
    }
  })

  // add course 
  function saveCourse() {

    let addRef = ref.child(userId);
    let newStoreRef = addRef.push();
    console.log(newStoreRef)

    // get values from input box
    let codebox = document.getElementById('codebox').value;
    let titlebox = document.getElementById('titlebox').value;
    let goalbox = document.getElementById('goalbox').value;
    let aPlus = document.getElementById('aPlusbox').value;
    let a = document.getElementById('abox').value;
    let aMinus = document.getElementById('aMinusbox').value;
    let bPlus = document.getElementById('bPlusbox').value;
    let b = document.getElementById('bbox').value;
    let bMinus = document.getElementById('bMinusbox').value;
    let cPlus = document.getElementById('cPlusbox').value;
    let c = document.getElementById('cbox').value;
    let cMinus = document.getElementById('cMinusbox').value;
    let dPlus = document.getElementById('dPlusbox').value;
    let d = document.getElementById('dbox').value;

    //validate course info
    if (codebox == null || codebox == "" || !(/^[A-Za-z0-9]*$/.test(codebox))) {
      alert("Course code input is not valid");
      return false;
    } else if (titlebox == null || titlebox == "") {
      alert("Course title input is not valid");
      return false;
    } else if (goalbox == null || goalbox == "" || isNaN(goalbox) || goalbox < 1 || goalbox > 100) {
      alert("Goal input is not valid");
      return false;
    }

    let gpaScaleObj = {
      "A+": aPlus,
      "A": a,
      "A-": aMinus,
      "B+": bPlus,
      "B": b,
      "B-": bMinus,
      "C+": cPlus,
      "C": c,
      "C-": cMinus,
      "D+": dPlus,
      "D": d
    };

    // GPA Scale input option & condition of save btn 
    let listGpaScales = Object.values(gpaScaleObj);

    let newListGpaScale = []

    for (let index in listGpaScales) {
      if (listGpaScales[index] !== '') {
        newListGpaScale.push(listGpaScales[index])
      }
    }

    if (newListGpaScale.length !== 0) {
      if (listGpaScales.length === newListGpaScale.length) {
        newListGpaScale.sort((a, b) => b - a);
        if (listGpaScales.toString() === newListGpaScale.toString()) {
          submitAddCourse();
        } else {
          alert('This number should be smaller than previous score!')
        }
      } else {
        alert('If you want to get the GPA, all the GPA scale should be entered.')
      }
    } else {
      submitAddCourse()
    }

    function submitAddCourse() {
      let courseObj = {
        "Course Code": codebox,
        "Course Title": titlebox,
        "Course Goal": goalbox,
        "Course Color": selectedColor,
        "GPA Scale": gpaScaleObj,
        "Grade Items": ""
      }
      console.log('save')
      newStoreRef.set(courseObj)
      location.reload()
    }
  }
}); // add course


function getUserIdFromURLParams() {
  // (A) GET THE PARAMETERS
  const params = new URLSearchParams(window.location.search)
  const userId = params.get("userId")
  // (B) IT WORKS!
  return userId
}

let userId = getUserIdFromURLParams()

async function getCoursesFor(userId) {
  let snapshot = await ref.child(userId).once('value')

  if (snapshot.exists()) {

    let courses = Object.values(snapshot.val())
    let courseIds = Object.keys(snapshot.val())

    for (let i = 0; i < courses.length; i++) {
      let course = courses[i]
      course.courseID = courseIds[i]
    }
    return courses
  }

  else {
    const container = document.getElementById('cardContainer')

    let noCourseContainer = document.createElement('div');
    noCourseContainer.className = 'noCourseContainer'
    noCourseContainer.id = 'noCourseContainer'
    container.appendChild(noCourseContainer)

    let thinkingImage = document.createElement('IMG');
    thinkingImage.className = "thinkingImage"
    thinkingImage.id = 'thinkingImage'
    thinkingImage.src = './picture/thinkingPic.png'
    thinkingImage.alt = 'Thinking Image'
    noCourseContainer.appendChild(thinkingImage)

    let noCourseInfo = document.createElement('div');
    noCourseInfo.className = 'noCourseInfo'
    noCourseInfo.id = 'noCourseInfo'
    noCourseInfo.textContent = 'You have no courses';
    noCourseContainer.appendChild(noCourseInfo)

    let addCourseGuide = document.createElement('div');
    addCourseGuide.className = 'addCourseGuide'
    addCourseGuide.id = 'addCourseGuide'
    addCourseGuide.textContent = 'To add courses, click on the "Add Course" button above'
    noCourseContainer.appendChild(addCourseGuide)
  }
  // return courses
}


getCoursesFor(userId).then(courses => {
  let addRef = ref.child(userId);
  localStorage.setItem("userId", userId);
  console.log(`addRef ${addRef}`)


  let averageList = [];
  let courseTitles = [];
  let gpaGrades = [];

  courses.forEach((currentCourse) => {

    let testRef = ref.child(userId).child(currentCourse.courseID);
    console.log(`testRef ${testRef}`)

    let courseTitle = currentCourse["Course Title"];
    let color = currentCourse["Course Color"];
    let courseCode = currentCourse["Course Code"];
    let gradeItems = Object.values(currentCourse["Grade Items"])
    let targetGrade = currentCourse['Course Goal'];
    let courseID = currentCourse.courseID
    let eachScale = [currentCourse["GPA Scale"]];

    console.log(currentCourse)
    console.log(gradeItems)

    // get array of assignment details
    gradeItems.forEach((comp) => {
      const date = comp["Asmt Due Date"]
      const eachAsmt = { "Assignment": comp["Asmt Title"], "Course Code": courseCode, "Due Date": date }
      console.log(eachAsmt)
      dueAsmtList.push(eachAsmt)
    })



    let course = new Course(color, targetGrade, courseCode, courseTitle, courseID, gradeItems)

    courseTitles.push(courseTitle)

    // default color
    if (color === "") {
      let defaultColor = 'darkGray'
      color = defaultColor
    }
    let backgroundColor = color

    let el = document.querySelector('body');
    let style = window.getComputedStyle(el);
    let courseColorRGB = style.getPropertyValue(`--${color}`).match(/\d+/g)

    let accentColor = courseColorRGB !== null ? getAccentColorFor(courseColorRGB[0], courseColorRGB[1], courseColorRGB[2]) : getAccentColorFor(33, 30, 30)

    let courseAverageGrade = course.getWeightedGrade() / course.getTotalWeight()
    averageList.push(courseAverageGrade)

    let ratio = 0
    if (course.getSumWeight() !== 0) {
      ratio = course.getSumWeight() / course.getTotalWeight()
    }
    //get percentage
    let progressBar = (ratio * 100).toFixed(0)

    let dueDateItems = course.getDueDateItems()

    let potentialGrade = (course.getWeightedGrade() + (100 * (100 - course.getSumWeight()))) / 100

    // create cards DOM

    //reference, parent
    const container = document.getElementById('cardContainer')

    let card = document.createElement('div');
    card.className = 'card'
    card.id = `card_${course.courseID}`
    container.appendChild(card)
    // make left side/ Title, Average, progress bar, label
    let leftSide = document.createElement('div');
    leftSide.className = 'left_info'
    leftSide.id = `courseColor_${course.courseID}`
    leftSide.style.backgroundColor = `var(--${color})`;

    card.appendChild(leftSide)

    // // leftSide.style.backgroundColor = accentColor

    let newleftTitle = document.createElement('h4');
    newleftTitle.textContent = 'COURSE GRADE'
    newleftTitle.className = 'titleLabel'
    newleftTitle.style.margin = '0 12px'
    newleftTitle.style.color = accentColor
    leftSide.appendChild(newleftTitle)

    let newAverage = document.createElement('h1');
    newAverage.id = 'average'
    newAverage.style.color = courseColorRGB !== null ? getTextColorForBackground(courseColorRGB[0], courseColorRGB[1], courseColorRGB[2]) : getTextColorForBackground(200, 200, 200)
    newAverage.textContent = courseAverageGrade ? courseAverageGrade.toFixed(2) + '%' : "N/A"
    leftSide.appendChild(newAverage)

    let newMyProgress = document.createElement('div');
    newMyProgress.id = 'myProgress'
    leftSide.appendChild(newMyProgress)

    let newMyBar = document.createElement('div');
    newMyBar.id = 'myBar'
    newMyBar.style.backgroundColor = accentColor
    newMyBar.style.width = (ratio * 100) + '%';
    newMyProgress.appendChild(newMyBar)

    let newLabel = document.createElement('p');
    newLabel.className = 'titleLabel'
    newLabel.textContent = progressBar + '% COMPLETE'
    newLabel.style.color = accentColor
    leftSide.appendChild(newLabel)

    // make right side / text, code:title, dueDate, goal, potential

    let rightSide = document.createElement('div');
    rightSide.className = 'right_info'
    card.appendChild(rightSide);

    let rightTop = document.createElement('div');
    rightTop.className = 'rightTop'
    rightSide.appendChild(rightTop)

    let newRightTitle = document.createElement('h4');
    newRightTitle.textContent = 'COURSE SUMMARY'
    newRightTitle.className = 'titleLabel'
    newRightTitle.id = 'rightTitle'
    newRightTitle.style.marginBottom = '5px'
    newRightTitle.style.color = accentColor
    rightTop.appendChild(newRightTitle)

    let editDelete = document.createElement('div');
    editDelete.className = 'editDelete'
    rightTop.appendChild(editDelete)

    let newEdit = document.createElement('button');
    newEdit.className = 'manageEdit'
    newEdit.id = `edit_${course.courseID}`
    newEdit.textContent = 'Edit'
    editDelete.appendChild(newEdit)

    let newDelete = document.createElement('button');
    newDelete.className = 'manageDelete'
    newDelete.id = `delete_${course.courseID}`
    newDelete.textContent = 'Delete'
    editDelete.appendChild(newDelete)

    let newCodeTitle = document.createElement('h3');
    newCodeTitle.id = 'cardTitle'
    newCodeTitle.textContent = `${course.courseCode}: ${course.courseTitle}`
    rightSide.appendChild(newCodeTitle)

    let newDueDate = document.createElement('div');
    newDueDate.id = 'dueDate'
    newDueDate.className = 'courseInfo'
    rightSide.appendChild(newDueDate)

    let newIconDueDate = document.createElement('IMG');
    newIconDueDate.className = "img-responsive"
    newIconDueDate.src = './picture/calender.png'
    newIconDueDate.alt = 'icon'
    newDueDate.appendChild(newIconDueDate)

    let newTextDueDate = document.createElement('span');

    newTextDueDate.textContent = dueDateItems + ' items due in the next 5 days'
    newTextDueDate.className = 'courseDetail'
    newDueDate.appendChild(newTextDueDate)

    let newTarget = document.createElement('div');
    newTarget.className = 'courseInfo'
    rightSide.appendChild(newTarget)

    let newIconTarget = document.createElement('IMG');
    newIconTarget.className = "img-responsive"
    newIconTarget.src = './picture/arrow.png'
    newIconTarget.alt = 'icon'
    newTarget.appendChild(newIconTarget)

    let newTextTarget = document.createElement('span');
    newTextTarget.className = 'courseDetail'
    newTextTarget.textContent = 'Target Grade: ' + (course.targetGrade).toFixed(2) + '%'
    newTarget.appendChild(newTextTarget)

    let newPotential = document.createElement('div');
    newPotential.className = 'courseInfo'
    rightSide.appendChild(newPotential)

    let newIconPotential = document.createElement('IMG');
    newIconPotential.className = "img-responsive"
    newIconPotential.src = './picture/think.png'
    newIconPotential.alt = 'icon'
    newPotential.appendChild(newIconPotential)

    let newTextPotential = document.createElement('span');
    newTextPotential.className = 'courseDetail'
    newTextPotential.textContent = 'Potential Grade: ' + potentialGrade.toFixed(2) + '%'
    newPotential.appendChild(newTextPotential)

    let targetScoreNeeded = document.createElement('div');
    targetScoreNeeded.id = 'dueDate'
    targetScoreNeeded.className = 'courseInfo'
    rightSide.appendChild(targetScoreNeeded)

    let newIconTargetNeeded = document.createElement('IMG');
    newIconTargetNeeded.className = "img-responsive"
    newIconTargetNeeded.src = './picture/target.png'
    newIconTargetNeeded.alt = 'icon'
    targetScoreNeeded.appendChild(newIconTargetNeeded)

    let newTextTargetNeeded = document.createElement('span');
    const initialAverage = course.getWeightedGrade() / course.getTotalWeight()
    const subtractGrade = targetGrade - initialAverage
    const percentageAssigned = (course.getTotalWeight() - course.getSumWeight()) / course.getTotalWeight()
    const scoreNeeded = (subtractGrade / percentageAssigned).toFixed(2)
    if (percentageAssigned == 0 && subtractGrade > 0) {
      newTextTargetNeeded.textContent = 'Target grade not achieved'
    }
    else if (subtractGrade <= 0) {
      newTextTargetNeeded.textContent = 'Target achieved'
    }
    else if (isNaN(percentageAssigned)) {
      newTextTargetNeeded.textContent = targetGrade + '% needed to achieve target grade'
    }
    else {
      newTextTargetNeeded.textContent = scoreNeeded + '% needed to achieve target grade'
    }

    newTextTargetNeeded.className = 'courseDetail'
    targetScoreNeeded.appendChild(newTextTargetNeeded)

    // GPA Scale
    let aPlus = currentCourse["GPA Scale"]["A+"];
    let a = currentCourse["GPA Scale"]["A"];
    let aMinus = currentCourse["GPA Scale"]["A-"];
    let bPlus = currentCourse["GPA Scale"]["B+"];
    let b = currentCourse["GPA Scale"]["B"];
    let bMinus = currentCourse["GPA Scale"]["B-"];
    let cPlus = currentCourse["GPA Scale"]["C+"];
    let c = currentCourse["GPA Scale"]["C"];
    let cMinus = currentCourse["GPA Scale"]["C-"];
    let dPlus = currentCourse["GPA Scale"]["D+"];
    let d = currentCourse["GPA Scale"]["D"];

    let editRef = ref.child(userId).child(course.courseID);


    //SEARCH FUNCTION
    const searchItem = document.getElementById("searchBox");

    searchItem.addEventListener('keyup', handleSearch);

    function handleSearch() {
      let filter = searchItem.value.toUpperCase();
      let cards = document.getElementsByClassName("card")
      for (let i = 0; i < cards.length; i++) {
        let txtValue = cards[i].textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          cards[i].style.display = "";
        } else {
          cards[i].style.display = "none";
        }
      }
    }


    // click the delete button
    document.querySelector(`#delete_${course.courseID}`).addEventListener('click', (event) => {
      console.log("The delete button is active but not working")
      Confirm.open({
        title: 'Course Delete',
        message: 'The course will be removed. Are you sure you which to continue?',
        okText: 'Yes, Delete',
        cancelText: 'Cancel',
        onok: () => removeCourse(),
        oncancel: () => console.log('cancel')
      })
      event.stopPropagation();
    });

    // delete course info
    function removeCourse() {
      editRef.remove()
      console.log('Delete successfully')
      location.reload()
    }

    // edit course info
    document.querySelector(`#edit_${course.courseID}`).addEventListener('click', (event) => {
      AddEditCourse.open({
        Coursetitle: 'Edit Course',
        onsave: () => updateCourseInfo(),
        oncancel: () => console.log('cancel')
      })

      // display slider as active if user entered gpa scale values
      if (aPlus) {
        const checkBox = document.querySelector('input[type="checkbox"]')
        const elemt = document.getElementById("gpaScale");
        checkBox.checked = true;
        elemt.className = 'active';
      } else {
        console.log("GPA scale not selected")
      }

      document.getElementById('codebox').value = course.courseCode
      document.getElementById('titlebox').value = course.courseTitle
      document.getElementById('goalbox').value = course.targetGrade
      document.getElementById('aPlusbox').value = aPlus
      document.getElementById('abox').value = a
      document.getElementById('aMinusbox').value = aMinus
      document.getElementById('bPlusbox').value = bPlus
      document.getElementById('bbox').value = b
      document.getElementById('bMinusbox').value = bMinus
      document.getElementById('cPlusbox').value = cPlus
      document.getElementById('cbox').value = c
      document.getElementById('cMinusbox').value = cMinus
      document.getElementById('dPlusbox').value = dPlus
      document.getElementById('dbox').value = d

      // show current course color(black border) & selected color(red border)    
      let courseColorOptions = ["lightPink", "pink", "red", "orange", "yellow", "lightYellow", "lightPurple", "purple", "darkPurple", "darkBlue", "blue", "lightBlue", "lightGreen", "green", "darkGreen", "darkGray"]

      let selectedColor = ''

      // make color buttons & border
      for (color of courseColorOptions) {
        let colorButtonsContainer = document.getElementById('colorButtonsContainer')

        let colorOptionButton = document.createElement('button');

        colorOptionButton.style.backgroundColor = `var(--${color})`
        colorOptionButton.className = 'color__button'
        colorOptionButton.id = `${color}`
        colorButtonsContainer.appendChild(colorOptionButton);

        colorOptionButton.onclick = function () {
          updateBorder('.color__button', this.id);
          selectedColor = this.id
        }
        if (backgroundColor === colorOptionButton.id) {
          console.log(backgroundColor)
          document.getElementById(`${color}`).style.border = 'solid'
        }
      }

      function updateBorder(className, selectedId) {
        let colorButtons = document.querySelectorAll(className);
        colorButtons.forEach(colorButton => colorButton.style.border = 'none');
        document.getElementById(selectedId).style.border = 'solid 2px red';
      }

      if (selectedColor === "") {
        selectedColor = backgroundColor
      }

      // silder GPA Scale
      document.querySelector('#showGpaScale').addEventListener('click', () => {
        let el = document.getElementById("gpaScale");
        if (el.className === 'inactive') {
          el.className = 'active';
        } else {
          el.className = 'inactive';
        }
      })

      // update course 
      function updateCourseInfo() {
        // get values from input box
        let codebox = document.getElementById('codebox').value;
        let titlebox = document.getElementById('titlebox').value;
        let goalbox = document.getElementById('goalbox').value;
        let aPlus = document.getElementById('aPlusbox').value;
        let a = document.getElementById('abox').value;
        let aMinus = document.getElementById('aMinusbox').value;
        let bPlus = document.getElementById('bPlusbox').value;
        let b = document.getElementById('bbox').value;
        let bMinus = document.getElementById('bMinusbox').value;
        let cPlus = document.getElementById('cPlusbox').value;
        let c = document.getElementById('cbox').value;
        let cMinus = document.getElementById('cMinusbox').value;
        let dPlus = document.getElementById('dPlusbox').value;
        let d = document.getElementById('dbox').value;


        //validate course info
        if (codebox == null || codebox == "" || !(/^[A-Za-z0-9]*$/.test(codebox))) {
          alert("Course code input is not valid");
          return false;
        } else if (titlebox == null || titlebox == "") {
          alert("Course title input is not valid");
          return false;
        } else if (goalbox == null || goalbox == "" || isNaN(goalbox) || goalbox < 1 || goalbox > 100) {
          alert("Goal input is not valid");
          return false;
        }

        let gpaScaleObj;
        if (document.querySelector('input[type="checkbox"]').checked == false) {
          gpaScaleObj = {
            "A+": "",
            "A": "",
            "A-": "",
            "B+": "",
            "B": "",
            "B-": "",
            "C+": "",
            "C": "",
            "C-": "",
            "D+": "",
            "D": ""
          }
        } else {
          gpaScaleObj = {
            "A+": aPlus,
            "A": a,
            "A-": aMinus,
            "B+": bPlus,
            "B": b,
            "B-": bMinus,
            "C+": cPlus,
            "C": c,
            "C-": cMinus,
            "D+": dPlus,
            "D": d
          };
        }
        // GPA Scale input option & condition of save btn 
        let listGpaScales = Object.values(gpaScaleObj);

        let newListGpaScale = []

        for (let index in listGpaScales) {
          if (listGpaScales[index] !== '') {
            newListGpaScale.push(listGpaScales[index])
          }
        }

        if (aPlus) {
          const checkBox = document.querySelector('input[type="checkbox"]')
          const elemt = document.getElementById("gpaScale");
          checkBox.checked = true;
          elemt.className = 'active';
        } else {
          console.log("GPA scale not selected")
        }

        if (newListGpaScale.length !== 0) {
          if (listGpaScales.length === newListGpaScale.length) {
            newListGpaScale.sort((a, b) => b - a);
            if (listGpaScales.toString() === newListGpaScale.toString()) {
              submitEditCourse();
            } else {
              alert('This number should be smaller than previous score!')
            }
          } else {
            alert('If you want to get the GPA, all the GPA scale should be entered.')
          }
        }
        else {
          submitEditCourse();
        }

        function submitEditCourse() {
          let courseObj = {
            "Course Code": codebox,
            "Course Title": titlebox,
            "Course Goal": goalbox,
            "Course Color": selectedColor,
            "GPA Scale": gpaScaleObj
          }
          editRef.update(courseObj)
          location.reload()
        }
      }

      event.stopPropagation();
    }); //edit course

    // move to gradeItemsList.html
    document.getElementById(`card_${course.courseID}`).addEventListener('click', openGradeItemsList);

    function openGradeItemsList(e) {
      e.preventDefault();

      let asmtIds = Object.keys(currentCourse["Grade Items"])

      for (let i = 0; i < gradeItems.length; i++) {
        let gradeItem = gradeItems[i]
        gradeItem.asmtID = asmtIds[i]
      }
      // }


      //(A) variables to pass
      let courseId = course.courseID;
      let gradeItemsList = gradeItems;
      let courseName = courseTitle
      let courseCodeItem = courseCode
      let average = courseAverageGrade.toFixed(2)
      let potential = potentialGrade.toFixed(2);
      let itemsRef = testRef

      //(B) URL parameters
      let params = new URLSearchParams();
      params.append("courseId", courseId);
      // (C) go!
      let url = "gradeItemsList.html?" + params.toString();
      console.log(url)
      location.href = url;


      // (B) SAVE TO LOCAL STORAGE
      // (B1) FLAT STRING OR NUMBER
      // LOCALSTORAGE.SETITEM("KEY", "VALUE");
      localStorage.setItem("courseCode", courseCodeItem)
      localStorage.setItem("courseName", courseName)
      localStorage.setItem("average", average)
      localStorage.setItem("potential", potential)
      localStorage.setItem("itemsRef", itemsRef)


      // (B2) ARRAY OR OBJECT
      // LOCAL STORAGE CANNOT STORE ARRAY AND OBJECTS
      // JSON ENCODE BEFORE STORING, CONVERT TO STRING
      localStorage.setItem("gradeItemsList", JSON.stringify(gradeItemsList));
      localStorage.setItem("eachScale", JSON.stringify(eachScale));
      localStorage.setItem("test", JSON.stringify(test));


      // (C) REDIRECT OR OPEN NEW WINDOW IF YOU WANT
      // location.href = "2b-local-storage.html";
      // window.open("2b-local-storage.html");
    }

    /// get gpa////
    let gradeScale = currentCourse['GPA Scale'];
    let courseLetterGrade = ""

    function sortObject(obj) {
      var arr = [];
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          arr.push({
            'key': prop,
            'value': obj[prop]
          });
        }
      }
      arr.sort(function (a, b) { return b.value - a.value; });
      return arr; // returns array
    }

    if (courseAverageGrade) {
      let sortedGradesScale = sortObject(gradeScale);
      let getLetterGrade = sortedGradesScale.find(g => g.value <= courseAverageGrade)
      if (getLetterGrade == undefined) {
        courseLetterGrade = "F"
      }
      else if (getLetterGrade.value) {
        courseLetterGrade = getLetterGrade.key;
      }
      else {
        courseLetterGrade = ""
        console.log("gpa scale not selected");
      }

      let letterAsGpa = {
        "A+": 4.00,
        "A": 4.00,
        "A-": 3.70,
        "B+": 3.30,
        "B": 3.00,
        "B-": 2.70,
        "C+": 2.30,
        "C": 2.00,
        "C-": 1.70,
        "D+": 1.30,
        "D": 1.00,
        "F": 0
      };

      for (const [key, value] of Object.entries(letterAsGpa)) {
        if (key === courseLetterGrade) {
          let getCourseLetterGradeValue = value
          gpaGrades.push(getCourseLetterGradeValue)
        }
      }
    }
    else {
      courseLetterGrade = "N/A"
      console.log("N/A")
    }
    ////get gpa end

  }) // courses.forEach

  ///function too calculate average of an array list
  function getAverage(list) {
    return (list.reduce((prev, curr) => prev + curr, 0) / list.length).toFixed(2);
  }

  ///////calculate overall gpa///////////
  const gpaTotal = getAverage(gpaGrades);
  isNaN(gpaTotal) ? document.getElementById('gpaTotal').innerHTML = "N/A" : document.getElementById('gpaTotal').innerHTML = gpaTotal;

  ///////calculate average of all courses///////////
  let filteredAveList = averageList.filter(function (value) {
    return !isNaN(value);
  })
  const averageTotal = getAverage(filteredAveList)
  isNaN(averageTotal) ? document.getElementById('averageTotal').innerHTML = 0 : document.getElementById('averageTotal').innerHTML = averageTotal;
})

//////display upcoming assignment////////
document.querySelector(`#upcomingAssignments`).addEventListener('click', () => {
  DueAsmt.open({
    Coursetitle: 'Upcoming Assignments',
    onsave: () => saveCourse(),
    oncancel: () => console.log('close')
  })
  // sort list by date
  dueAsmtList.sort(function (a, b) {
    var c = new Date(a["Due Date"]);
    var d = new Date(b["Due Date"]);
    return c - d;
  });

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const today = now.getFullYear() + "-" + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

  const dueTomorrow1 = new Date(now.setDate(now.getDate() + 1));
  const m2 = dueTomorrow1.getMonth() + 1;
  const d2 = dueTomorrow1.getDate();
  const dueTomorrow = dueTomorrow1.getFullYear() + "-" + (m2 < 10 ? '0' : '') + m2 + '-' + (d2 < 10 ? '0' : '') + d2;

  const dueWeek1 = new Date(now.setDate(now.getDate() + 7));
  const m3 = dueWeek1.getMonth() + 1;
  const d3 = dueWeek1.getDate();
  const dueWeek = dueWeek1.getFullYear() + "-" + (m3 < 10 ? '0' : '') + m3 + '-' + (d3 < 10 ? '0' : '') + d3;


  let todayList = [];
  let tomorrowList = [];
  let thisWeekList = [];
  let laterList = [];

  dueAsmtList.forEach((v) => {
    let d = v["Due Date"];

    if (d == today) {
      todayList = dueAsmtList.filter(obj => { return obj["Due Date"] == d })
    }
    else if (d == dueTomorrow) {
      tomorrowList = dueAsmtList.filter(obj => { return obj["Due Date"] == d })
    }
    else if ((d > dueTomorrow) && (d < dueWeek)) {
      thisWeekList = dueAsmtList.filter(obj => { return obj["Due Date"] == d })
    }
    else if (d >= dueWeek) {
      laterList = dueAsmtList.filter(obj => { return obj["Due Date"] == d })
    }
    else {
      console.log("Due date has passed")
    }

  })


  // create table //
  const newTable = document.createElement("table");
  newTable.innerHTML = `<thead style='background-color: #05379B; color:#fff'><th>Assignment</th><th>Course Code</th><th>Due Date</th></thead>`;

  //function to get items from list to display table data
  const getTableDetails = (list) => {
    for (const item of list) {
      const newRow = document.createElement("tr");
      const tdAssignment = document.createElement("td");
      const tdCourseCode = document.createElement("td");
      const tdDueDate = document.createElement("td");

      tdAssignment.textContent = item["Assignment"];
      tdCourseCode.textContent = item["Course Code"];
      tdDueDate.textContent = item["Due Date"];

      newRow.appendChild(tdAssignment);
      newRow.appendChild(tdCourseCode);
      newRow.appendChild(tdDueDate);
      newTable.appendChild(newRow);
    }
  }

  if (todayList.length !== 0) {
    const newRow = document.createElement("tr");
    const thSubHeading1 = document.createElement("th");
    const thSubHeading2 = document.createElement("th");
    const thSubHeading3 = document.createElement("th");
    thSubHeading1.textContent = "Due Today";
    newRow.style.backgroundColor = '#E5E4E2'
    newRow.appendChild(thSubHeading1);
    newRow.appendChild(thSubHeading2);
    newRow.appendChild(thSubHeading3);
    newTable.appendChild(newRow);

    getTableDetails(todayList)
  }
  if (tomorrowList.length !== 0) {
    const newRow = document.createElement("tr");
    const thSubHeading1 = document.createElement("th");
    const thSubHeading2 = document.createElement("th");
    const thSubHeading3 = document.createElement("th");
    thSubHeading1.textContent = "Due Tomorrow";
    newRow.style.backgroundColor = '#E5E4E2'
    newRow.appendChild(thSubHeading1);
    newRow.appendChild(thSubHeading2);
    newRow.appendChild(thSubHeading3);
    newTable.appendChild(newRow);

    getTableDetails(tomorrowList)
  }
  if (thisWeekList.length !== 0) {
    const newRow = document.createElement("tr");
    const thSubHeading1 = document.createElement("th");
    const thSubHeading2 = document.createElement("th");
    const thSubHeading3 = document.createElement("th");
    thSubHeading1.textContent = "Due in a Week";
    newRow.style.backgroundColor = '#E5E4E2'
    newRow.appendChild(thSubHeading1);
    newRow.appendChild(thSubHeading2);
    newRow.appendChild(thSubHeading3);
    newTable.appendChild(newRow);

    getTableDetails(thisWeekList)
  }
  if (laterList.length !== 0) {
    const newRow = document.createElement("tr");
    const thSubHeading1 = document.createElement("th");
    const thSubHeading2 = document.createElement("th");
    const thSubHeading3 = document.createElement("th");
    thSubHeading1.textContent = "Due Later";
    newRow.style.backgroundColor = '#E5E4E2'
    newRow.appendChild(thSubHeading1);
    newRow.appendChild(thSubHeading2);
    newRow.appendChild(thSubHeading3);
    newTable.appendChild(newRow);

    getTableDetails(laterList)
  }

  const target = document.getElementById('tableWrap');
  target.appendChild(newTable);

})

document.querySelector(`.logoutButton`).addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      window.location.href = "/Landing Page + Login/index.html";
    })
    .catch((error) => {
      console.log(error);
    });
})
