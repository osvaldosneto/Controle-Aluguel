/*
const now = new Date('28/02/2020'); // Data de hoje
const past = new Date('03/03/2020'); // Outra data no passado
const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

// Mostra a diferença em dias
console.log('Entre 2020-04-01 até agora já se passaram ' + days + ' dias');
*/
// Digamos que este é o formato das suas datas
let data = '30/03/2019';

// Precisamos quebrar a string para retornar cada parte
const dataSplit = data.split('/');

const day = dataSplit[0]; // 30
const month = dataSplit[1]; // 03
const year = dataSplit[2]; // 2019

// Agora podemos inicializar o objeto Date, lembrando que o mês começa em 0, então fazemos -1.
data = new Date(year, month - 1, day);
data = year+"-"+month+"-"+day;
console.log(data)