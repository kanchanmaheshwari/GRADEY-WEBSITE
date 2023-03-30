const Reset = {
    open(options) {
        options = Object.assign({}, {
            onok: function () { },
            oncancel: function () { }
        }, options);

        const html = `
            <div id='#reset'
 class="reset">
                <div class="reset__window">
                    <div class="reset__titlebar">
                        <span class="reset__title">Forgot Password?</span>
                       <button class="reset__close">&times;</button>
                    </div>
                    <div class="reset__content">Please enter your email address below and we'll send a password reset link to your email address.</div>
                    <label style="padding:20px; padding-top:0px">Email <input id="emailInput" type="email" placeholder="email@address.com" style="width:20em" ></input></label>
                    <div class="reset__buttons">
                        <button class="reset__button reset__button--ok reset__button--fill">Reset Password</button>
                        <button class="reset__button reset__button--cancel">Back to Login</button>
                    </div>
                </div>
            </div>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const resetEl = template.content.querySelector('.reset');
        const btnClose = template.content.querySelector('.reset__close');
        const btnOk = template.content.querySelector('.reset__button--ok');
        const btnCancel = template.content.querySelector('.reset__button--cancel');

        resetEl.addEventListener('click', e => {
            if (e.target === resetEl) {
                options.oncancel();
                this._close(resetEl);
            }
        });

        btnOk.addEventListener('click', () => {
            options.onok();
            this._close(resetEl);
        });

        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(resetEl);
            });
        });

        document.body.appendChild(template.content);
    },

    _close(resetEl) {
        resetEl.classList.add('reset--close');

        resetEl.addEventListener('animationend', () => {
            document.body.removeChild(resetEl);
        });
    }
};



export { Reset }