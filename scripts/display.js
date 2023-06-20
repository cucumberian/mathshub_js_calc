'use strict';

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

    constructor(parent_element) {
        this.parent_element = parent_element;
        this.p = document.createElement('p');
        this.number = '0';
        this.render();
    }

    show(string) {
        this.p.innerText = string;
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
            }
            else {
                this.value = `${ this.value }${ character }`; // записываем число
            }
        }
        else if (character === '.') { // если добаяляется точка
            if (this.value.includes('.')) { // если уже введеное число целое, то
                console.warn(`Вторую десятичную точку нельзя добавить`);
            }
            else { // если точки ещё нет, то добавляем её
                this.value = `${this.value}.`;
            }
        }
        else {
            console.warn(`Передан символ не из диапазона 0-9 или .`);
        }
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

export default Display;
