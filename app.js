const username = 'Diego';
const password = '1234';

// Função de login
document.getElementById('loginBtn').addEventListener('click', () => {
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;

    if (inputUsername === '' || inputPassword === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (inputUsername === username && inputPassword === password) {
        alert('Login bem-sucedido!');
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadClients();
    } else {
        alert('Usuário ou senha inválidos!');
    }
});

// Função para carregar os clientes
function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientTable = document.getElementById('clientTable');
    let tableContent = '<table><tr><th>Nome Completo</th><th>Email</th><th>Telefone</th><th>Pontos</th></tr>';
    
    clients.forEach(client => {
        tableContent += `
            <tr>
                <td>${client.fullName}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.points}</td>
            </tr>
        `;
    });
    
    tableContent += '</table>';
    clientTable.innerHTML = tableContent;
}

// Função para salvar um cliente
document.getElementById('saveClientBtn').addEventListener('click', () => {
    const clientFullName = document.getElementById('clientFullName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPoints = parseInt(document.getElementById('clientPoints').value);

    if (!clientFullName || !clientPhone || !clientEmail) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const newClient = {
        fullName: clientFullName,
        phone: clientPhone,
        email: clientEmail,
        points: clientPoints
    };

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));
    loadClients();
    document.getElementById('clientFullName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPoints').value = 0;
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchClient').value.toLowerCase();

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const filteredClients = clients.filter(client => client.fullName && client.fullName.toLowerCase().includes(searchTerm));

    const clientSelect = document.getElementById('clientSelect');
    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';

    filteredClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.fullName;
        option.textContent = client.fullName;
        clientSelect.appendChild(option);
    });
});

// Adicionar pontos ao cliente selecionado
document.getElementById('addPointsBtn').addEventListener('click', () => {
    const selectedClientName = document.getElementById('clientSelect').value;
    const pointsToAdd = parseInt(document.getElementById('points').value);

    if (!selectedClientName || !pointsToAdd) {
        alert('Selecione um cliente e adicione pontos!');
        return;
    }

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientIndex = clients.findIndex(client => client.fullName === selectedClientName);

    if (clientIndex !== -1) {
        clients[clientIndex].points += pointsToAdd;
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
        alert(`Pontos adicionados com sucesso ao cliente ${selectedClientName}`);
    }
});

// Zerar clientes (limpar o localStorage)
document.getElementById('resetClientsBtn').addEventListener('click', () => {
    localStorage.removeItem('clients');
    loadClients();
    alert('Todos os clientes foram removidos!');
});

// Função para exportar clientes
document.getElementById('exportBtn').addEventListener('click', () => {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const blob = new Blob([JSON.stringify(clients, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Função para importar clientes
document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedClients = JSON.parse(e.target.result);
                localStorage.setItem('clients', JSON.stringify(importedClients));
                loadClients();
                alert('Clientes importados com sucesso!');
            } catch (error) {
                alert('Erro ao importar o arquivo. Certifique-se de que o arquivo está no formato correto.');
            }
        };
        reader.readAsText(file);
    }
});

// Função para exibir os clientes e seus pontos
function displayClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientList = document.getElementById('clients');
    clientList.innerHTML = '';  // Limpa a lista de clientes

    clients.forEach(client => {
        const listItem = document.createElement('li');
        listItem.textContent = `${client.fullName} - Pontos: ${client.points || 0}`;

        // Cria o botão de WhatsApp se o cliente tiver 10 pontos
        if (client.points >= 10) {
            const whatsappButton = document.createElement('button');
            whatsappButton.textContent = 'Enviar Voucher';
            whatsappButton.addEventListener('click', () => sendVoucher(client));
            listItem.appendChild(whatsappButton);
        }

        clientList.appendChild(listItem);
    });
}

// Função para atualizar os pontos do cliente (exemplo)
function updateClientPoints(clientId, points) {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex > -1) {
        clients[clientIndex].points += points;  // Adiciona pontos
        localStorage.setItem('clients', JSON.stringify(clients));  // Atualiza o localStorage
        displayClients();  // Recarrega a lista de clientes
    }
}

// Chama a função para exibir os clientes ao carregar a página
displayClients();
