
function TypingEffect(typeChar, newLine) {
    const DEFAULT_SPEED = 0;
    const MAX_SPEED = 5;

    this.CHAR_QUEUE = [];
    this.looping = false;
    this.loop;
    this.forcedFull = false;
    const insertFromQueue = () => {
        const newChar = this.CHAR_QUEUE[0];
        this.CHAR_QUEUE = this.CHAR_QUEUE.slice(1);
        if (newChar === "\n") {
            newLine();
        } else {
            typeChar(newChar);
        }

        if (this.CHAR_QUEUE.length === 0) {
            this.looping = false;

            //Call onFinish if it exists
            this?.onFinish?.();
        } else {
            let speed = DEFAULT_SPEED;
            speed += 500 / this.CHAR_QUEUE.length;

            speed = Math.min(speed, MAX_SPEED);

            if (this.forcedFull) speed = 0;

            setTimeout(() => {
                insertFromQueue();
            }, speed);
        }
    }
    this.forceFullSpeed = (bool) => {
        this.forcedFull = bool;
    }
    this.addWord = (text) => {
        if (text === "\n") {
            this.CHAR_QUEUE.push(text);
        } else {
            text.split("").forEach((char) => {
                this.CHAR_QUEUE.push(char);
            });
        }
        if (!this.looping) {
            this.looping = true;
            console.log("before insert", this.CHAR_QUEUE);
            insertFromQueue();
        }
    }
}

module.exports = TypingEffect;