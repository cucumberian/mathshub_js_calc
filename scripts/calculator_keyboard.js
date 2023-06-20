'use strict';

class CalculatorKeyboard {
    symbols = [
        {
            content: 'AC',
            classes: ['gray_btn', ],   
            fun: ['ac']
        },
        {content: 'C',  classes: ['gray_btn', ],     fun: ['ac']},
        {content: '<',  classes: ['gray_btn', ],     fun: ['backspace']},
        {content: '÷',  classes: ['orange_btn', ],   fun: ['operation_input', '/']},
        {content: '7',  classes: ['white_btn', ],    fun: ['number_input', '7']},
        {content: '8',  classes: ['white_btn', ],    fun: ['number_input', '8']},
        {content: '9',  classes: ['white_btn', ],    fun: ['number_input', '9']},
        {content: '×',  classes: ['orange_btn', ],   fun: ['operation_input', '*']},
        {content: '4',  classes: ['white_btn', ],    fun: ['number_input', '4']},
        {content: '5',  classes: ['white_btn', ],    fun: ['number_input', '5']},
        {content: '6',  classes: ['white_btn', ],    fun: ['number_input', '6']},
        {content: '-',  classes: ['orange_btn', ],   fun: ['operation_input', '-']},
        {content: '1',  classes: ['white_btn', ],    fun: ['number_input', '1']},
        {content: '2',  classes: ['white_btn', ],    fun: ['number_input', '2']},
        {content: '3',  classes: ['white_btn', ],    fun: ['number_input', '3']},
        {content: '+',  classes: ['orange_btn', ],   fun: ['operation_input', '+']},
        {content: '0',  classes: ['zeroButton', 'white_btn'],   fun: ['number_input', '0']},
        {content: '.',  classes: ['white_btn', ],    fun: ['number_input', '.']},
        {content: '=',  classes: ['orange_btn', ],   fun: ['equal']}
    ];

    constructor(parent) {
        this.parent = parent;
        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add('btns_wrapper');
        this.parent.append(this.element);
    }
}

export default CalculatorKeyboard;