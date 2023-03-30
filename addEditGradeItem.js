const AddEditGradeItem = {
    open(options) {
        options = Object.assign({}, {
            title: '',
            onsave: function () { },
            oncancel: function () { },
        }, options);

        const html = `
            <div id='addItem'  class="addItem">
                <div class="addItem__window">
                  <div class="addItem__titlebar">
                    <span class="addItem__title">${options.title}</span>
                    <button class="addItem__close ">&times;</button>
                  </div>
                  
                  <div id='gradeInfo' class='info'>
                    <div id='form_container'>
                    <label class='addItem__content'>Assignment Title *
                    <input  type='text' class="addItem__input" id='titlebox' placeholder='Chapter 1 Reading Quiz'> </input></label>
                    <label class='addItem__content' for="category">Category *
                    <select name="category" class="addItem__input" id="categorybox" placeholder='Quizzes'>
                        <option value="Final Exam">Final Exam</option>
                        <option value="Labs">Labs</option>
                        <option value="Midterms">Midterms</option>
                        <option value="Quizzes">Quizzes</option>
                        <option value="Tests">Tests</option>
                    </select></label>
                    <label class='addItem__content'>Grade
                    <input  type='text' class="addItem__input" id='gradebox' placeholder='%'/></label>
                    <label class='addItem__content'>Weight *
                    <input  type='text' class="addItem__input" id='weightbox' placeholder='%'/></label>
                    <label class='addItem__content'>Due Date *
                    <input  type='date' class="addItem__input" id='datebox' placeholder='October 24, 2020'/></label>
                    </div>
                  </div>
                  
               
                  
                <div class="addItem__buttons">
                  <button class="addItem__button addItem__button--save addItem__button--fill">Save</button>
                  <button class="addItem__button addItem__button--cancel">Cancel</button>
              </div>
               </div>
            </div>`;



        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const addItemEl = template.content.querySelector('.addItem');
        const btnClose = template.content.querySelector('.addItem__close');
        const btnSave = template.content.querySelector('.addItem__button--save');
        const btnCancel = template.content.querySelector('.addItem__button--cancel');

        addItemEl.addEventListener('click', e => {
            if (e.target === addItemEl) {
                options.oncancel();
                this._close(addItemEl);
            }
        });

        btnSave.addEventListener('click', () => {
            options.onsave();
            if (window.alert) {
                console.log("user to make corrections")
              } else {
                this._close(addItemEl);
            }
            // this._close(addItemEl);
        });

        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(addItemEl);
            });
        });

        document.body.appendChild(template.content);
    },

    _close(addItemEl) {
        addItemEl.classList.add('addItem--close');

        addItemEl.addEventListener('animationend', () => {
            document.body.removeChild(addItemEl);
            // location.reload()
        });
    },
};




export { AddEditGradeItem }