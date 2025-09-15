class Chronometer {
    constructor(minute_div, second_div) {
        this.minute_div = minute_div;
        this.second_div = second_div;
        this.Reset();
        this.check = 0;
    }
    Start() {
        this.check = 1;
        this.interval = setInterval(() => {
            this.second++;
            if (this.second > 59) {
                this.second = 0;
                this.minute++;
            }
            this.minute_div.textContent = this.minute.toString().padStart(2, '0');
            this.second_div.textContent = this.second.toString().padStart(2, '0');
        }, 1000);
    }
    Stop() {
        this.check = 0;
        clearInterval(this.interval);
    }
    Reset() {
        if (this.check) this.Stop();
        this.minute = 0;
        this.second = 0;
        this.minute_div.textContent = '00';
        this.second_div.textContent = '00';
    }
    To_string() {
        return this.minute.toString().padStart(2, '0') + " : " + this.second.toString().padStart(2, '0');
    }
}
export default Chronometer;