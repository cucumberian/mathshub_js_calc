'use strict';

import Display from './display.js';
import SmallDisplay from './small_display.js';
import CalculatorKeyboard from './calculator_keyboard.js';
import Button from './button.js';

/**
 * 
 */
class Calculator {
    constructor(element, debug=false) {
        this.element = element;
        this.is_debug = debug;
        this.bind_keys();

        this.render();
        this.ac();
        this.result = null;
    }

    render() {
        if (this.is_debug) {
            this.debug = document.createElement('div');
            this.debug.classList.add('debug');

            this.debug_v1 = document.createElement('p');
            this.debug_v1.classList.add('v1');

            this.debug_op = document.createElement('p');
            this.debug_op.classList.add('op');

            this.debug_v2 = document.createElement('p');
            this.debug_v2.classList.add('v2');

            this.debug_result = document.createElement('p');
            this.debug_result.classList.add('result');

            this.debug_text = document.createElement('p');
            this.debug_text.classList.add('text');

            this.debug.append(
                this.debug_v1,
                this.debug_op,
                this.debug_v2,
                this.debug_result,
                this.debug_text,
            );
            this.element.append(this.debug);
        }
        const monitor = document.createElement('div');
        monitor.classList.add('monitor');

        // добавляем маленький дисплей
        this.small_display = new SmallDisplay(monitor);
        // добавляем большой дисплей
        this.big_display = new Display(monitor, true);
        // добавляем клавиатуру
        this.element.append(monitor);

        // вставляем клавиатуру
        this.keyboard = new CalculatorKeyboard(this.element);
        // создаем клавиши
        this.keyboard.symbols.forEach(
            symbol => {
                const btn = new Button(
                    ...Object.values(symbol), this.keyboard.element,
                );
                btn.element.addEventListener('mousedown', event => {
                    this.visualize_click(event.currentTarget);
                    const [command, arg] = [...symbol.fun];
                    this.dispatch(command, arg);
                });
            },  
        );
    }

    bind_keys() {
        /*
        Связывает клавиатуру с действиями калькулятора
        */
        document.addEventListener('keydown', (event) => {
            if (event.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
                this.dispatch('number_input', event.key);
            }
            else if (event.code === 'Period') {
                this.dispatch('number_input', event.key);
            }
            else if (event.key === 'Backspace') {
                this.dispatch('backspace');
            }
            // математические операции
            else if ("+-*/".includes(event.key)) {
                this.dispatch('operation_input', event.key);
            }
            // вывод результата
            else if (event.key === 'Enter' || event.key === '=') {
                this.dispatch('equal');
            }
            else if (event.key === 'Escape') {
                this.dispatch('ac');
            }
        });
    
    }

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
                this.refresh();
            },
            leave() {},
            number_input(chars) {
                const [char, ] = [...chars];
                this.v1 = this.big_display.add_character(char);
                this.refresh();
            },
            operation_input(operation) {
                [this.op, ] = [...operation];
                this.v1 = this.big_display.number;
                this.result = this.v1;
                this.change_state('wait');
            },  
            ac() {
                this.ac();
            }, 
            backspace() {
                this.big_display.del_symbol();
                this.v1 = this.big_display.number;
                this.refresh();
            },
        },

        'v2': {
            init() {
                this.refresh();
            },
            leave() {},
            number_input(chars) {
                const [char, ] = [...chars];
                this.v2 = this.big_display.add_character(char);
                this.refresh();
            },
            operation_input(operation) {
                [this.op, ] = [...operation];
                this.refresh();
                this.change_state('calculation');
            },
            equal() {
                this.change_state('calculation');
            },
            ac() {
                this.ac();
            },
            backspace () {
                this.big_display.del_symbol();
                this.v2 = this.big_display.number;
                this.refresh();
            }
        },

        'calculation': {
            init() {
                this.refresh();
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
                this.refresh();
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
                this.refresh();
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
                this.refresh();
            },
            equal() {
                this.change_state('calculation');
            },
            ac() {
                this.ac();
            },
            backspace() {
                // this.big_display.del_symbol();
                this.big_display.number = 0;
                this.v2 = this.big_display.number;
                this.change_state('v2');
            },
        },

        'error': {
            init() {
                this.big_display.show("ERROR");
                this.refresh();
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

    refresh() {
        this.small_display.set_value1 = this.v1;
        this.small_display.set_value2 = this.v2;
        this.small_display.set_operation = this.op;
        this.small_display.set_result = this.result;

        if(this.is_debug){
            this.debug_v1.innerText = this.v1;
            this.debug_v1.innerText = this.op;
            this.debug_v1.innerText = this.v2;
            this.debug_v1.innerText = this.error ? this.error : this.result;
            this.debug_v1.innerText = `${this}`; // add info
        }
        
    }

    visualize_click(button_object) {
        function remove_pressed() {
            button_object.classList.remove('pressed');
        }

        button_object.classList.add('pressed');
        button_object.addEventListener('mouseup', remove_pressed);
        button_object.addEventListener('mouseleave', remove_pressed);
        // через 2 секунды удаляем обработчики и отжимаем кноаку
        setTimeout(() => {
            button_object.classList.remove('pressed');
            button_object.removeEventListener('mouseup', remove_pressed);
            button_object.removeEventListener('mouseleave', remove_pressed);
        }, 2000);
    }
}

export default Calculator;
