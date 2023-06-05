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

// Create class Btn
class Button {
    constructor(content, classes, fun, parent_element) {
        this.content = content;
        this.classes = classes;
        this.fun = fun;
        this.parent_element = parent_element;
        this.render();
    }
    
    get_body() {
        const button = document.createElement('button');
        const span = document.createElement('span');
        span.innerText = this.content;
        button.append(span);
        console.log('this classes = ', this.classes);

        this.classes.forEach(value => {
            button.classList.add(value);
        });

        return button;
    }

    render() {
        this.parent_element.append(this.get_body());
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

    constructor(parent_element, bind_keys = true) {
        this.parent_element = parent_element;
        this.p = document.createElement('p');
        this.number = '0';
        this.render();
        if (bind_keys) {
            this.bind_keys();
        }
    }

    bind_keys() {
        /*
        Связывает клавиатуру с дележащимимся элементамим
        */
        document.addEventListener('keydown', (event) => {
            
            if (event.key in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
                this.add_character(event.key);
                console.log('event.key = ', event.key);
            }
            else if (event.code === 'Period') {
                this.add_character('.');
            }
            else if (event.key === 'Backspace') {
                this.del_symbol();
            }
            else if (event.key in ['+', '-', '*', '/', 'Enter', 'Escape', 'Tab']) {
                this.send_symbol(event.key);
                console.log('event.key symbol = ', event.key);
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
        // если значение получени о число, то возвразаем иначе ошибка
        if (Number.isFinite(value)) {
            return value;
        }
        else {
            throw new Error(`Ошибка: при извлечении числа с экрана оно не оказалось числом: \"${value}\" - тип ${typeof(value)}`);
        }
    }

    set number(value) {
        /*
        Устанавливает переданное значнеие в дисплей
        */
        this.value = `${ value }`;
    }

    get value() {
        return this.p.innerText;
    }
    set value(value) {
        if (Number.isFinite(+value)) {
            this.p.innerText = value;
        }
        else {
            throw new Error(`Ошибка: переданное значение в дисплей не является конечным числом \"${ value }\"`);
        }
    }

    add_character(character) {
        if (this.value.length > this.MAX_POS) {
            return this.value;
        }
        // если это число, то дописываем в строку
        console.log(`send_character : "${character}"`);
        if (character in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) {
            if (character === '0' && this.value === '0') {
                console.warn(`Не добавляем незначащий ноль к 0`);
            }
            else if (this.value === '0') {
                this.value = `${character}`;
            }
            else {
                this.value = `${ this.value }${ character }`;
            }
        }
        else if (character === '.') { // если добаяляется точка
            if (this.value.includes('.')) { // если уже введеное число целое, то
                console.warn(`Вторую десятичную точку нельзя добавить`);
            }
            else { // если точки ещё нет, то добавляем её
                
                this.value = `${this.value}.`;
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


const btnsWrapper = document.querySelector('.btns_wrapper');
console.log(btnsWrapper);

const btns = []
// const btn = new Button("AC", ['gray_btn', ], calc_AC, btnsWrapper);
symbols.forEach(symbol => {
    const btn = new Button(symbol.content, symbol.classes, symbol.fun, btnsWrapper);
    btns.push(btn);
});

const monitor = document.querySelector('div.monitor');
const d = new Display(monitor);