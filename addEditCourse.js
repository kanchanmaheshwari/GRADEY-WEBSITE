const AddEditCourse = {
    open (options) {
        options = Object.assign({}, {
            Coursetitle: '',
            onsave: function () {},
            oncancel: function () {},
        }, options);
      
        const html = `
          <div id='add' class="course">
            <div class="course__window">
              <div class="course__titlebar">
                  <span class="course__title">${options.Coursetitle}</span>
                  <button class="course__close ">&times;</button>
              </div>

              <div id='courseInfo' class='info'>
                  <div id='form_container'>
                      <label class="course__content">Course Code
                        <input type='text' class="course__input" id='codebox' placeholder='CPSC235'> </input>
                        <div id="error"></div>
                      </label>

                      <label class='course__content'>Course Name
                        <input type='text' class="course__input" id='titlebox' placeholder='Introduction to Data Structures'/>
                        <div id="error"></div>
                      </label>

                      <label class='course__content'>Goal
                        <input type='text' class="course__input" id='goalbox' placeholder='%'/>
                        <div id="error"></div>
                      </label>


                      <div class="course__content">
                          <div>GPA Based Course</div>
                          <label class="switch" for='showGpaScale'>
                              <input type="checkbox" id='showGpaScale'>
                              <span class="slider round"></span>
                          </label>
                      </div>

                      <div class='inactive' id='gpaScale'>
                          <div class="course__content" id='gpaLabel'>GPA Scale</div>

                          <div class="course__content">Enter the mininmun grade required to achieve each letter grade for
                              this course. For courses that do not have a gpa scale, you may leave this section blank.
                          </div>

                          <div class='enter__gpaScales'>
                              <div class='input__a'>
                                  <label class='input__gpa'>A+<input type='text' class="input__gpaScale" id='aPlusbox' /></label>
                                  <label class='input__gpa'>A<input type='text' class="input__gpaScale" id='abox' /></label>
                                  <label class='input__gpa'>A-<input type='text' class="input__gpaScale" id='aMinusbox' /></label>
                              </div>
                              <div class='input__b'>
                                  <label class='input__gpa'>B+<input type='text' class="input__gpaScale" id='bPlusbox' /></label>
                                  <label class='input__gpa'>B<input type='text' class="input__gpaScale" id='bbox' /></label>
                                  <label class='input__gpa'>B-<input type='text' class="input__gpaScale" id='bMinusbox' /></label>
                              </div>
                              <div class='input__c'>
                                  <label class='input__gpa'>C+<input type='text' class="input__gpaScale" id='cPlusbox' /></label>
                                  <label class='input__gpa'>C<input type='text' class="input__gpaScale" id='cbox' /></label>
                                  <label class='input__gpa'>C-<input type='text' class="input__gpaScale" id='cMinusbox' /></label>
                              </div>
                              <div class='input__d'>
                                  <label class='input__gpa'>D+<input type='text' class="input__gpaScale" id='dPlusbox' /></label>
                                  <label class='input__gpa'>D<input type='text' class="input__gpaScale" id='dbox' /></label>
                              </div>
                          </div>
                      </div>
                      <div class='selectColor'>
                          <div class='course__content'>Select A Course Color</div>
                          <div id='colorButtonsContainer' class="color__buttons"></div>
                      </div>
                  </div>
              </div>
              <div class="course__buttons">
                  <button class="course__button course__button--save course__button--fill">Save</button>
                  <button class="course__button course__button--cancel">Cancel</button>
              </div>
            </div>
          </div>`
  

  
  
        const template = document.createElement('template');
        template.innerHTML = html;
  
        // Elements
        const addCourseEl = template.content.querySelector('.course');
        const btnClose = template.content.querySelector('.course__close');
        const btnSave = template.content.querySelector('.course__button--save');
        const btnCancel = template.content.querySelector('.course__button--cancel');
  
        addCourseEl.addEventListener('click', e => {
            if (e.target === addCourseEl) {
                options.oncancel();
                this._close(addCourseEl);
            }
        });
  
        btnSave.addEventListener('click', () => {
            options.onsave();
            if (window.alert) {
              console.log("user to make corrections")
            } else {
              this._close(addCourseEl);
            }
        });
  
        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(addCourseEl);
            });
        });
  
        document.body.appendChild(template.content);
    },
  
    _close (addCourseEl) {
        addCourseEl.classList.add('course--close');
  
        addCourseEl.addEventListener('animationend', () => {
            document.body.removeChild(addCourseEl);
          // location.reload()
        });
       
    },
  };
  
  export { AddEditCourse }