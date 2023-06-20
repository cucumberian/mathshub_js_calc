'use strict';

class SmallDisplay {
    constructor(parent) {
        this.MAX_POS = 5;
        this.parent = parent;
        this.v1 = null;
        this.v2 = null;
        this.op = null;
        this.render();
        this.refresh();
    }

    trunc_number(number) {
        if (Number.isFinite(number)) {
            const str = number.toPrecision(this.MAX_POS);
            return Number(str);
        }
        return number
    }

    refresh() {
        this.value1.innerText = this.trunc_number(this.v1);
        this.value2.innerText = this.trunc_number(this.v2);
        this.operation.innerText = this.op;
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add('small_display');

        this.value1 = document.createElement('p');
        this.value1.classList.add('value1');

        this.operation = document.createElement('p');
        this.operation.classList.add('operation');

        this.value2 = document.createElement('p');
        this.value2.classList.add('value2');

        this.element.append(
            this.value1, 
            this.operation, 
            this.value2
        );
        this.parent.append(this.element);
    }

    /**
     * @param {Number} value
     */
    set set_value1(value) {
        this.v1 = value;
        this.refresh();
    }

    /**
     * @param {Number} value
     */
    set set_value2(value) {
        this.v2 = value;
        this.refresh();
    }

    /**
     * @param {string} value
     */
    set set_operation(value) {
        this.op = value;
        this.refresh();
    }
}

export default SmallDisplay;
