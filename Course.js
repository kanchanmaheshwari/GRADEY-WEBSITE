class Course {
  constructor(color, targetGrade, courseCode, courseTitle, courseID, gradeItems) {
    this.color = color;
    this.targetGrade = parseInt(targetGrade);
    // can make another class  
    this.courseCode = courseCode;
    this.courseTitle = courseTitle;
    this.courseID = courseID;
    this.gradeItems = gradeItems
  }

  getWeightedGrade() {
    let weightedGrade = 0
    this.gradeItems.forEach(gradeItem => {
      if ((doesExist(gradeItem['Asmt Grade'])) && (doesExist(gradeItem['Asmt Weight']))) {
        weightedGrade += (gradeItem['Asmt Grade'] * gradeItem['Asmt Weight']);
        return weightedGrade
      }
    })
    return weightedGrade
  }

  getSumWeight() {
    let sumWeight = 0
    this.gradeItems.forEach(gradeItem => {
      if (doesExist(gradeItem['Asmt Weight']) && (gradeItem['Asmt Grade'] != "")) {
        sumWeight += gradeItem['Asmt Weight']
        return sumWeight
      }
    })
    return sumWeight
  }
  
  getTotalWeight() {
    let sumWeight = 0
    this.gradeItems.forEach(gradeItem => {
      if (doesExist(gradeItem['Asmt Weight'])) {
        sumWeight += gradeItem['Asmt Weight']
        return sumWeight
      }
    })
    return sumWeight
  }

  getDueDateItems() {
    let dueDateItems = []
    let todayDate = new Date();

    this.gradeItems.forEach(gradeItem => {
      if (doesExist(gradeItem['Asmt Due Date'])) {
        let asmtDueDate = Date.parse(gradeItem['Asmt Due Date']) - Date.parse(todayDate)
        if ((asmtDueDate <= (1000 * 3600 * 24 * 5)) && (asmtDueDate > 0)) {
          dueDateItems.push(asmtDueDate);
          return dueDateItems.length
        }
      }
    })
    return dueDateItems.length
  }
}


function doesExist(argument) {
  return (argument !== undefined) && (argument !== null)
}



export { Course }