let board, m, n; //Matrix, row, column

let startRender = 0; //Start render is row 0 and render 100 rows every time

let sortBy = true; //Sort Asc

const renderGridBtn = document.querySelector('.render-grid');

//Render grid
renderGridBtn.addEventListener('click', () => {
    let tableHeader = document.querySelector('.table-header');
    let tableGrid = document.querySelector('.table-grid');

    tableHeader && document.body.removeChild(tableHeader)
    tableGrid && document.body.removeChild(tableGrid)

    board = [];
    m = +document.querySelector('.row').value;
    n = +document.querySelector('.col').value;

    if (m <= 0 || n <= 0) {
        alert('Number > 0')
        return;
    }

    let k;
    for (let i = 0; i < m; i++) {
        k = [];
        for (let j = 0; j < n; j++) {
            k.push(random());
        }
        board.push(k);
    }

    //Render interface
    document.body.appendChild(renderHeader(n))
    document.body.appendChild(renderGrid(board, m, n))

    //Css
    tableHeader = document.querySelector('.table-header');
    tableGrid = document.querySelector('.table-grid');
    tableHeader.style.left = tableGrid.offsetLeft + 'px';

    const headers = Array.from(document.querySelectorAll('.header td'));

    //Sort grid
    headers.forEach(header => header.addEventListener('click', () => {
        let col = (+header.textContent) - 1;

        if (sortBy === true) {
            board = board.sort((a, b) => {
                return a[col] - b[col];
            })
        } else {
            board = board.sort((a, b) => {
                return b[col] - a[col];
            })
        }

        sortBy = !sortBy;

        //Render grid after sorting 
        tableGrid = document.querySelector('.table-grid');
        tableGrid && document.body.removeChild(tableGrid);
        document.body.appendChild(renderGrid(board, m, n))
    }))
})

function renderHeader(col) {
    let tableHeader = document.createElement('table');
    tableHeader.classList.add('table-header')
    let header = document.createElement('tr');
    header.classList.add('header');

    let headerContent = '';
    for (let i = 0; i < col; i++) {
        headerContent += `<td>${i + 1}</td>`;
    }
    header.innerHTML = headerContent;
    tableHeader.appendChild(header)
    return tableHeader;
}

function renderGrid(board, m, n) {
    let tableGrid = document.createElement('table');
    tableGrid.classList.add('table-grid')
    let row;
    m = (m < 100) ? m : 100;
    for (let i = 0; i < m; i++) { //Load 100 rows first
        row = document.createElement('tr');
        let xhtml = '';
        for (let j = 0; j < n; j++) {
            xhtml += `<td name='${i}'>${board[i][j]}</td>`;
        }
        row.innerHTML = xhtml;
        tableGrid.appendChild(row);
    }
    startRender = 100;
    return tableGrid;
}


//Load Infinity when scroll
window.addEventListener('scroll', () => {
    let tableGrid = document.querySelector('.table-grid');

    let currentPosBottom = document.getElementsByName(`${startRender - 1}`) && Array.from(document.getElementsByName(`${startRender - 1}`))[0].offsetTop;

    if ((currentPosBottom + tableGrid.offsetTop) < (window.scrollY + window.innerHeight)) {
        //Load more 100 rows
        if (startRender >= m) return;
        let row;
        for (let i = startRender; i < startRender + 100; i++) {
            row = document.createElement('tr');
            let xhtml = '';
            for (let j = 0; j < n; j++) {
                xhtml += `<td name='${i}'>${board[i][j]}</td>`;
            }
            row.innerHTML = xhtml;
            tableGrid.appendChild(row);
        }
        startRender += 100;
    }
})

//Ramdom from 1 to 10000
function random() {
    return Math.round(Math.random() * (1000 - 1) + 1);
}