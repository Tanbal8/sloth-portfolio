class notification {
    constructor(type, title, message) {
        this.div = document.createElement('div');
        this.div.classList.add('hidden-notification');
        this.div.classList.add('notification');
        let icon_div = document.createElement('div');
        icon_div.classList.add('notification-status-icon');
        let template = document.createElement('div');
        let title_div = document.createElement('div');
        title_div.classList.add('notification-title');
        title_div.textContent = title;
        template.appendChild(title_div);
        if (message) {
            let message_div = document.createElement('div');
            message_div.classList.add('notification-message');
            message_div.textContent = message;
            message_div.dir = 'auto';
            template.appendChild(message_div);
        }
        this.div.appendChild(icon_div);
        this.div.appendChild(template);
        switch (type) {
            case 'success' :
                this.div.style.borderLeftColor = 'green';
                this.div.style.borderRightColor = 'green';
                icon_div.innerHTML = '<i class="fa fa-check-circle success-icon"></i>';
                break;
            case 'alert' :
                this.div.style.borderLeftColor = 'red';
                this.div.style.borderRightColor = 'red';
                icon_div.innerHTML = '<i class="fa fa-times-circle alert-icon"></i>';
                break;
            case 'message' :
                this.div.style.borderLeftColor = 'gold';
                this.div.style.borderRightColor = 'gold';
                icon_div.innerHTML = '<i class="fa fa-comment message-icon"></i>';
                break;
        }
        this.div.onclick = () => {
            this.Remove();
        }
        notification_div.appendChild(this.div);
        notifications.push(this.div);
        setTimeout(() => {
            this.div.classList.remove('hidden-notification')
        }, 10);
        this.timeout = setTimeout(() => {
            this.Remove();
        }, 5000);
    }
    Remove() {
        this.div.classList.add('hidden-notification');
        setTimeout(() => {
            notifications.splice(notifications.indexOf(this.div), 1);
            this.div.remove();
        }, 250);
    }
}
const notification_div = document.createElement('div');
notification_div.setAttribute('id', 'notifications-div');
document.body.appendChild(notification_div);
const notifications = [];
export default notification;