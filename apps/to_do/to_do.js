    class notification {
        constructor(type, title, message) {
            this.div = document.createElement("div");
            this.div.classList.add("hidden-notification");
            this.div.classList.add("notification");
            if (message) this.div.innerHTML = `<div class="notification-status-icon"></div><div><div class="notification-title" dir="auto">${title}</div><div class="notification-message" dir="auto">${message}</div></div>`;
            else this.div.innerHTML = `<div class="notification-status-icon"></div><div><div class="notification-title" dir="auto">${title}</div></div>`;
            switch (type) {
                case "success" :
                    this.div.style.borderLeftColor = "green";
                    this.div.style.borderRightColor = "green";
                    this.div.children[0].innerHTML = "<i class='fa fa-check-circle success-icon'></i>";
                    break;
                case "alert" :
                    this.div.style.borderLeftColor = "red";
                    this.div.style.borderRightColor = "red";
                    this.div.children[0].innerHTML = "<i class='fa fa-times-circle alert-icon'></i>";
                    break;
                case "message" :
                    this.div.style.borderLeftColor = "gold";
                    this.div.style.borderRightColor = "gold";
                    this.div.children[0].innerHTML = "<i class='fa fa-comment message-icon'></i>";
                    break;
            }
            this.div.onclick = () => {
                this.remove();
            }
            notification_div.appendChild(this.div);
            notifications.push(this.div);
            setTimeout(() => {
                this.div.classList.remove("hidden-notification")
            }, 10);
            this.timeout = setTimeout(() => {
                this.remove();
            }, 5000);
        }
        remove() {
            this.div.classList.add("hidden-notification");
            setTimeout(() => {
                notifications.splice(notifications.indexOf(this.div), 1);
                this.div.remove();
            }, 250);
        }
    }
    var notification_div = document.getElementById("notifications-div");
    var notifications = [];
    var program = {
        inputs: {
            az: document.getElementById("az-input"),
            ta: document.getElementById("ta-input"),
            kar: document.getElementById("kar-input")
        },
        output: {
            list: document.getElementById("list"),
            empty: document.getElementById("empty")
        },
        load() {},
        check(az, ta, kar) {
            return !(kar == "" || az == "" || ta == "");
        },
        add() {
            let [az_input, ta_input, kar_input] = [program.inputs.az, program.inputs.ta, program.inputs.kar];
            let [az, ta, kar] = [az_input.value.trim(), ta_input.value.trim(), kar_input.value.trim()];
            if (!this.check(az, ta, kar)) {
                new notification("alert", "خطا", "ورودی ها را کامل وارد کنید");
                return;
            }
            let list = program.output.list;
            list.style.display = "flex";
            let div = document.createElement("div");
            let time = document.createElement("div");
            time.classList.add("time-div");
            time.innerHTML += `<div class="az-div">${az}</div>`;
            time.innerHTML += `<div>-</div>`;
            time.innerHTML += `<div class="ta-div">${ta}</div>`;
            time.innerHTML += `<div>:</div>`;
            div.appendChild(time);
            div.innerHTML += `<div class="kar-div">${kar}</div>`;
            let options = document.createElement("div");
            options.classList.add("options");
            options.innerHTML += `<i class="fa fa-check fa-2x yes-button"></i>`;
            options.innerHTML += `<i class="fa fa-close fa-2x no-button"></i>`;
            options.innerHTML += `<i class="fa fa-pencil fa-2x edit-button"></i>`;
            options.innerHTML += `<i class="fa fa-trash fa-2x delete-button"></i>`;
            options.innerHTML += `<i class="fa fa-check-circle fa-2x confirm-edit-button" style="display: none;"></i>`;
            let az_div = time.querySelector(".az-div");
            let ta_div = time.querySelector(".ta-div");
            let kar_div = div.querySelector(".kar-div");
            let yes_button = options.querySelector(".yes-button");
            let no_button = options.querySelector(".no-button");
            let edit_button = options.querySelector(".edit-button");
            let delete_button = options.querySelector(".delete-button");
            let confirm_edit_button = options.querySelector(".confirm-edit-button");
            let option_buttons = options.querySelectorAll("i:not(.confirm-edit-button)");
            yes_button.onclick = function() {
                div.classList.remove("no");
                div.classList.toggle("yes");
            }
            yes_button.onclick = function() {
                div.classList.remove("no");
                div.classList.toggle("yes");
            }
            no_button.onclick = function() {
                div.classList.remove("yes");
                div.classList.toggle("no");
            }
            delete_button.onclick = function() {
                div.remove();
                new notification("message", "حذف شد")
            }
            edit_button.onclick = function() {
                console.log(az_div);
                console.log(kar_div);
                for (let button of option_buttons) button.style.visibility = "hidden";
                confirm_edit_button.style.display = "block";
                az_div.setAttribute("contenteditable", true);
                ta_div.setAttribute("contenteditable", true);
                kar_div.setAttribute("contenteditable", true);
                kar_div.focus();
            }
            confirm_edit_button.onclick = function() {
                let [edited_az, edited_ta, edited_kar] = [az_input.value.trim(), ta_input.value.trim(), kar_input.value.trim()];
                if (!this.check(edited_az, edited_ta, edited_kar)) {
                    new notification("alert", "خطا", "ورودی ها را کامل وارد کنید");
                    return;
                }
                az_div.removeAttribute("contenteditable");
                ta_div.removeAttribute("contenteditable");
                kar_div.removeAttribute("contenteditable");
                for (let button of option_buttons) button.style.visibility = "visible";
                confirm_edit_button.style.display = "none";
            }
            div.appendChild(options);
            list.appendChild(div);
            new notification("success", "ثبت شد");
            az_input.value = "";
            ta_input.value = "";
            kar_input.value = "";
            az_input.focus();
        }
    }
    window.onload = program.load();
    program.inputs.az.onkeydown = (event) => {if (event.key == "Enter") program.inputs.ta.focus();}
    program.inputs.ta.onkeydown = (event) => {if (event.key == "Enter") program.inputs.kar.focus();}
    program.inputs.kar.onkeydown = (event) => {if (event.key == "Enter") program.add();}