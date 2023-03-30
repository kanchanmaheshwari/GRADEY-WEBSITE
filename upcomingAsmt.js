const DueAsmt = {
    open(options) {
        options = Object.assign({}, {
            Coursetitle: '',
            oncancel: function () { },
        }, options);

        const html = `
                        <div id='add' class="course">
                            <div class="course__window">
                                <div class="course__titlebar">
                                    <span class="course__title">${options.Coursetitle}</span>
                                    <button class="course__close ">&times;</button>
                                </div>

                                <div id='asmtInfo' class='asmtInfo'>
                                    <table id="tableWrap" class='tableWrap'></table>
                                </div>

                                <div class="course__buttons">
                                    <button class="course__button course__button--cancel">Close</button>
                                </div>
                            </div>
                        </div>
                    `;

        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const courseEl = template.content.querySelector('.course');
        const btnClose = template.content.querySelector('.course__close');
        const btnCancel = template.content.querySelector('.course__button--cancel');

        courseEl.addEventListener('click', e => {
            if (e.target === courseEl) {
                options.oncancel();
                this._close(courseEl);
            }
        });

        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(courseEl);
            });
        });

        document.body.appendChild(template.content);
    },

    _close(courseEl) {
        courseEl.classList.add('course--close');

        courseEl.addEventListener('animationend', () => {
            document.body.removeChild(courseEl);
        });

    },
};

export { DueAsmt }