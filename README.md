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
    - `number_input`
        вводим первое число
    - `operation_input`
        запоминаем операцию и переходим
        __v1__ => __v2__
- __v2__
    - `number_imput`
        запомниаем второе число
    - `operation_input`
        вводим операцию
        переходим __v2__ => __calculation__
    - `equal`
        проверяем крайние случаи 
        и переходим __v2__ => __calculation__

- __calculation__
    выполняет дейстаия над v1 op v2. Результат выводится на дисплей и присваивается в переменную v1.
    - `result`
    - `to_error`
- __result__
    В жтом состоянии на дисплее отображается результат выполненной операции.
    Переходы
    - `number_input`
        при вводе числа сбрасывается значение на дисплее 
        с результата на только что введенное значение v2
        выполняется переход __result__ => __v2__
    - `equal`
        уже должны быть v1, v2 и операция
        выполняем переход __result__ => __calculation__
- __error__
    Выводит сообщение об ошибке пока не будет выполнен переход `ac`
    - `init`
    - `ac`
- [ ] надо сбросить число на дисплее, если калькулятор перешел в состояние v2 после ввода операции