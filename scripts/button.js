'use strict';


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

        button.classList.add(...this.classes);

        return button;
    }

    render() {
        this.element = this.get_body();
        this.parent_element.append(this.element);
    }
}

export default Button;
