'use strict';

function calc_AC() {
    document.getElementById('display').value = '';
}
function calc_plus() {
    document.getElementById('display').value += '+';
}
function calc_0() {
    document.getElementById('display').value += '0';
}
function calc_dot() {
    document.getElementById('display').value += '.';
}
function calc_equal() {
    document.getElementById('display').value = eval(document.getElementById('display').value);
}


const symbols = [
    {content: 'AC', classes: ['gray_btn', ],     fun: calc_AC},
    {content: 'C',  classes: ['gray_btn', ],     fun: calc_AC},
    {content: '<',  classes: ['gray_btn', ],     fun: calc_AC},
    {content: '÷',  classes: ['orange_btn', ],   fun: calc_AC},
    {content: '7',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '8',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '9',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '×',  classes: ['orange_btn', ],   fun: calc_AC},
    {content: '4',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '5',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '6',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '-',  classes: ['orange_btn', ],   fun: calc_AC},
    {content: '1',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '2',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '3',  classes: ['white_btn', ],    fun: calc_AC},
    {content: '+',  classes: ['orange_btn', ],   fun: calc_plus},
    {content: '0',  classes: ['zeroButton', 'white_btn'],   fun: calc_0},
    {content: '.',  classes: ['white_btn', ],    fun: calc_dot},
    {content: '=',  classes: ['orange_btn', ],   fun: calc_equal}
]; 

function visualize_click(button_object) {
    button_object.classList.add('pressed');
    button_object.addEventListener('mouseup', () => {
        button_object.classList.remove('pressed');
    });
    button_object.addEventListener('mouseleave', () => {
        button_object.classList.remove('pressed');
    });
}

// Create class Btn
class Button {
    constructor(content, classes, fun, parent_element) {
        this.content = content;
        this.classes = classes;
        this.element = null;
        this.fun = fun;
        this.parent_element = parent_element;
        this.render();
        
    }

    get_body() {
        const button = document.createElement('button');
        const span = document.createElement('span');
        span.innerText = this.content;
        button.append(span);
        // console.log('this classes = ', this.classes);

        this.classes.forEach(value => {
            button.classList.add(value);
        });

        return button;
    }

    render() {
        this.element = this.get_body();
        this.parent_element.append(this.element);
    }
}

class SmallDisplay {
    constructor(parent) {
        this.parent = parent;
        this.v1 = null;
        this.v2 = null;
        this.op = null;
        this.res = null;
        this.value1 = this.parent.querySelector('p.value1');
        this.value2 = this.parent.querySelector('p.value2');
        this.operation = this.parent.querySelector('p.operation');
        this.result = this.parent.querySelector('p.result');
        console.log(`SmallDisplay constructor`, this)
        this.refresh();
    }

    refresh() {
        this.value1.innerText = this.v1;
        this.value2.innerText = this.v2;
        this.operation.innerText = this.op;
        this.result = this.op ? ` = ${this.op}` : '';
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

    set set_result(value) {
        this.res = value;
        this.refresh();
    }
}

// class Display
class Display {
    /* Класс дисплея
    Предназначен для отобрахения числа
    Принимает на вход символы и отображает их.
    Может отдать значение выводимого числа
    Может биндить клавиши для удобного ввода
    */

    display_class = "big_display";
    result_class = "result";
    MAX_POS = 10;

    constructor(parent_element, calculator, bind_keys = true) {
        this.calculator = calculator;   // объект калькулятора
        this.parent_element = parent_element;
        this.p = document.createElement('p');
        this.number = '0';
        this.render();
        if (bind_keys) {
            this.bind_keys();
        }
    }

    show(string) {
        this.p.innerText = string;
    }

    bind_keys() {
        /*
        Связывает клавиатуру с дележащимимся элементамим
        */
        document.addEventListener('keydown', (event) => {

            visualize_click(event.target);
            
            if (event.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
                // this.add_character(event.key);
                this.calculator.dispatch('number_input', event.key);
                // console.log('event.key = ', event.key);
            }
            else if (event.code === 'Period') {
                // this.add_character('.');
                this.calculator.dispatch('number_input', event.key);
            }
            else if (event.key === 'Backspace') {
                this.calculator.dispatch('backspace');
            }
            // математические операции
            else if ("+-*/".includes(event.key)) {
                this.calculator.dispatch('operation_input', event.key);
            }
            // вывод результата
            else if (event.key === 'Enter' || event.key === '=') {
                this.calculator.dispatch('equal');
            }
            else if (event.key === 'Escape') {
                this.calculator.dispatch('ac');
            }
        });
    
    }

    del_symbol() {
        if (this.value !== '0') {
            if (this.value.length === 1) {
                this.number = 0;
            }
            else {
                this.value = this.value.slice(0, -1);    
            }
        }
    }

    get number() {
        /*
        Отдает значение с экрана в виде числа
        */
        const value = +this.p.innerText;
        // const value = this.calculator.get_value()
        // если значение получени о число, то возвразаем иначе ошибка
        if (Number.isFinite(value)) {
            return Number(value.toPrecision(this.MAX_POS-3));
        }
        else {
            throw new Error(`Ошибка: при извлечении числа с экрана оно не оказалось числом: \"${value}\" - тип ${typeof(value)}`);
        }
    }

    set number(value) {
        /*
        Устанавливает переданное значнеие в дисплей
        */
        const str = Number(value).toPrecision(this.MAX_POS-3);
        this.value = `${ Number(str) }`;
    }

    get value() {
        return this.p.innerText;
    }
    set value(value) {
        if (Number.isFinite(+value)) {
            this.p.innerText = value;
        }
        else if (value === '-') {
            this.number = 0;
        }
        else {
            throw new Error(`Ошибка: переданное значение в дисплей не является конечным числом \"${ value }\"`);
        }
    }

    /**
     * 
     * @param {String} character символ [0-9] или .
     * @returns {String} текущее представление числа с дисплея
     */
    add_character(character) {
        // console.log(`add_character:`, character);
        // this.number = this.calculator.get_value(); // получаем текущее число из калькулятора

        if (this.value.length > this.MAX_POS) {
            return this.value;
        }
        
        if (isNaN(this.number)) {
            console.warn(`calc return NaN`);
            return;
        }

        // если это число, то дописываем в строку
        // console.log(`add_character : "${ character }"`);
        if (character in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
            if (character === '0' && this.value === '0') {
                console.warn(`Не добавляем незначащий ноль к 0`);
            }
            else if (this.value === '0') {
                this.value = `${ character }`; // записываем число
                // this.calculator.dispatch("number_input", this.number); // записываем в калькулятор
            }
            else {
                this.value = `${ this.value }${ character }`; // записываем число
                // this.calculator.dispatch("number_input", this.number); // записываем число в калькулятор
            }
        }
        else if (character === '.') { // если добаяляется точка
            if (this.value.includes('.')) { // если уже введеное число целое, то
                console.warn(`Вторую десятичную точку нельзя добавить`);
            }
            else { // если точки ещё нет, то добавляем её
                this.value = `${this.value}.`;
                // this.calculator.dispatch("number_input", this.number); // записываем число в калькулятор
                console.log(this.value);
            }
        }
        else {
            console.warn(`Передан символ не из диапазона 0-9 или .`);
        }
        // this.value = this.number;
        return this.number; // вернем текущее число
    }

    render() {
        const display = document.createElement('div');
        display.classList.add(this.display_class);

        this.p.classList.add(this.result_class);
        
        display.append(this.p);
        
        this.parent_element.append(display);
    }
}


'use strict';

class Calc {
    constructor(element, small_display) {
        this.big_display = new Display(
            document.querySelector('div.monitor'),
            this,
            true,
        );

        this.small_display = small_display;
        this.element = element;
        this.ac();
        this.result = null;

        console.log(this);
    }

    // get_value () {
    //     switch (this.state) {
    //         case "v1":
    //             return this.v1 || 0;
    //             break;
    //         case "v2":
    //             return this.v2 || 0;
    //             break;
    //         case "wait":
    //             return this.v2 || 0;
    //         default:
    //             return NaN;
    //     }
    // }

    dispatch(actionName, ...payload) {
        const actions = this.transitions[this.state];
        const action = actions[actionName];
        if (action) {
            action.call(this, payload);
        }
        else {
            console.warn(`No action "${actionName}" in state "${this.state}"`);
        }   
    }

    change_state(newStateName) {
        
        if (newStateName in this.transitions) {
            if (this.state === newStateName) {
                console.warn(`Change state to itself: "${this.state}" -> "${newStateName}"`);
                // return;
            }
            this.dispatch('leave');
            this.state = newStateName;
            this.dispatch('init');
        }
        else {
            console.warn(`Cannot change state to "${newStateName}", no such state.`);
        }
    }

    toString() {
        return `Calc: ${this.state}, "${this.v1}" "${this.op}" "${this.v2}", res=${this.result}`
    }

    transitions = {
        'null': {
            init() {
                this.v1 = 0;
                this.v2 = null;
                this.big_display.number = this.v1;
                this.change_state('v1');
            },
            leave() {},
        },

        'v1': {
            init() {
                this.render();
            },
            leave() {},
            number_input(chars) {
                console.log(`v1 number input`);
                const [char, ] = [...chars];
                this.v1 = this.big_display.add_character(char);
                this.render();
            },
            operation_input(operation) {
                [this.op, ] = [...operation];
                this.v1 = this.big_display.number;
                this.result = this.v1;
                this.change_state('wait');
            },
            equal() {
                console.warn(`v1 = нечего делать`)
                // ничего не делаем
            },
            ac() {
                this.ac();
            }, 
            backspace() {
                this.big_display.del_symbol();
                this.v1 = this.big_display.number;
                this.render();
            },
        },

        'v2': {
            init() {
                this.render();
            },
            leave() {},
            number_input(chars) {
                const [char, ] = [...chars];
                this.v2 = this.big_display.add_character(char);
                this.render();
            },
            operation_input(operation) {
                [this.op, ] = [...operation];
                this.render();
                this.change_state('calculation');
            },
            equal() {
                if (this.op) {
                    if (Number.isFinite(this.v2)) {
                        // если есть второй аргумент
                        this.change_state('calculation');
                    }
                    else {
                        // если второго аргумента нет
                        if (this.op === '+' || this.op === '-') {
                            this.v2 = 0;
                        }
                        else if (this.op === '/' || this.op === '*') {
                            this.v2 = 1;    // 
                        }
                        else {
                            console.warn(`Unknown operation "${this.op}"`);
                            return;
                        }
                        this.change_state('calculation');
                    }
                }
                else {
                    // если нет операции ничего не делаем
                }
            },
            ac() {
                this.ac();
            },
            backspace () {
                this.big_display.del_symbol();
                this.v2 = this.big_display.number;
                this.render();
            }
        },

        'calculation': {
            init() {
                this.render();
                // console.log(this);
                if (Number.isFinite(this.v1) && this.op && Number.isFinite(this.v2)) {
                    switch (this.op) {
                        case "+":
                            this.result = this.v1 + this.v2;
                            break;
                        case "-":
                            this.result = this.v1 - this.v2;
                            break;
                        case "*":
                            this.result = this.v1 * this.v2;
                            break;
                        case "/":
                            this.result = this.v1 / this.v2;
                            break;
                        default:
                            this.result = NaN;
                    }
                    if (Number.isFinite(this.result)) {
                        this.dispatch('result');
                    }
                    else {
                        this.dispatch('to_error', [`Unknown operation: "${this.op}" during calculation!`]);
                    }
                }
                else if (this.v2 === null) {
                        this.dispatch('fix_empty_v2');
                }
            },
            fix_empty_v2() {
                if (this.v2 === null) {
                    switch (this.op) {
                        case "+":
                            [this.v1, this.v2] = [0, this.v1];
                            break;
                        case "-":
                            [this.v1, this.v2] = [0, this.v1];
                            break;
                        case "*":
                            this.v2 = this.v1;
                            break;
                        case "/":
                            [this.v1, this.v2] = [1, this.v1];
                            this.v1 = 1;
                            break;
                    }
                    this.change_state('calculation');
                }
            },
            leave() {
                this.render();
            },
            result() {
                this.v1 = this.result;
                this.change_state('wait');
            },
            to_error(error) {
                this.error = error;
                this.change_state('error');
            }
        },

        'wait': {
            init() {
                this.big_display.number = this.result;
                // this.v2 = null;
                this.render();
            },
            leave() {},
            number_input (chars) {
                const [char, ] = [...chars];
                this.big_display.value = '';
                this.v2 = this.big_display.add_character(char);
                this.change_state('v2');
            },
            operation_input(operation) {
                [this.op, ] = [...operation];
                this.render();
            },
            equal() {
                this.change_state('calculation');
            },
            ac() {
                this.ac();
            },
            backspace() {
                this.big_display.del_symbol();
                this.v2 = this.big_display.number;
                this.change_state('v2');
            },
        },

        'error': {
            init() {
                this.big_display.show("ERROR");
                this.render();
                console.warn(...this.error);
            },
            ac() {
                this.ac();
            },
        },
    };

    ac() {
        this.v1 = null;
        this.v2 = null;
        this.op = null;
        this.result = null;
        this.error = null;

        this.state = 'null';
        this.dispatch('init');
    }

    render() {
        this.small_display.set_value1 = this.v1;
        this.small_display.set_value2 = this.v2;
        this.small_display.set_operation = this.op;
        this.small_display.set_result = this.result;

        this.element.querySelector(`p.v1`).innerText = this.v1;
        this.element.querySelector(`p.op`).innerText = this.op;
        this.element.querySelector(`p.v2`).innerText = this.v2;
        this.element.querySelector(`p.result`).innerText = this.error ? this.error : this.result;
        this.element.querySelector(`p.text`).innerText = `${this}`; // add info
    }
}


const sd = new SmallDisplay(document.querySelector(`div.small_display`));

const elem = document.querySelector(`div.calculator`);
const c = new Calc(elem, sd);
console.log(`Создан объект калькулятора:`, c);

const btnsWrapper = document.querySelector('.btns_wrapper');
// console.log(btnsWrapper);

const btns = []
// const btn = new Button("AC", ['gray_btn', ], calc_AC, btnsWrapper);
symbols.forEach(symbol => {
    const btn = new Button(symbol.content, symbol.classes, symbol.fun, btnsWrapper);
    btns.push(btn);
    btn.element.addEventListener('mousedown', (e) => {
        console.log('click');
        visualize_click(e.currentTarget);
    });
});


// const monitor = document.querySelector('div.monitor');
// const d = new Display(monitor, c, true);
