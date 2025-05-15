const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

button.addEventListener('click', function () {
    if (input.value.trim() !== '') {
        // Criar os elementos
        const li = document.createElement('li');
        const deleteButton = document.createElement('button');

        // Definir os conteúdos
        li.textContent = input.value;
        deleteButton.textContent = '❌';

        // Adicionar botão ao item da lista
        li.append(deleteButton);

        // Adicionar item à lista
        list.append(li);

        // Adicionar funcionalidade de deletar
        deleteButton.addEventListener('click', function () {
            list.removeChild(li);
            input.focus();
        });

        // Limpar o campo de entrada
        input.value = '';
    }

    // Focar novamente no input
    input.focus();
});
