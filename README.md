# Калькулятор на JavaScript

[Figma](https://www.figma.com/file/odLAP1PL5atEFGZKbvnxCx/Neumorphism-Calculator-(Community)?type=design&node-id=1-2&t=l8IuWI3zvyrMLBrN-0)

## Команды

number_input(value)
operation_input(operation)
equal()
ac()
render()


## Состояния
- __null__
    - `init`
        `v1 = 0; state = 'v1';`
- __v1__
    Состояние после вкючения калькулятора, в котором еще нет первого числа.
    - `number_input`
        вводим первое число
    - `operation_input`
        запоминаем операцию и переходим
        __v1__ => __wait__

- __v2__
    Состояние в котое попадаем если есть операция, первое число и начинаем вводить второе число
    - `number_imput`
        запоминаем второе число
    - `operation_input`
        вводим операцию
        переходим __v2__ => __calculation__
    - `equal`
        переходим __v2__ => __calculation__

- __calculation__
    выполняет дейстаия над v1 op v2. Результат выводится на дисплей и присваивается в переменную v1.
    - `init`
        проверяем крайние случаи и выполняем расчет
    - `result`
        присваиваем первому числу результат расчета
        переход __calculatrion__ => __wait__
    - `to_error`
        если результата нет или он не конечное число
        переход __calculation__ => __error__

- __wait__
    состояние в котором ожидается ввод второго числа, чтобы убрать с дисалея результат
    - `number_input`
        пользователь начал вводить второе число
        переход __wait__ => __v2__
    - `operation_input`
        изменилась операция - запоминаем её
    - `equal`
        выполняем расчет
        __wait__ => __calculation__
    - `backspace`
        удаляем символ через объект дисплея
        переход __wait__ => __v2__

- __error__
    Выводит сообщение об ошибке пока не будет выполнен переход `ac`
    - `init`
        Выводит ссобщение `ERROR` на дисплей
    - `ac`
