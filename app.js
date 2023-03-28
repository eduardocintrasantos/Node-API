const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware..');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
/*  EXEMPLOS

app.get('/', (req, res) => {
    res.status(200).send('teste');
});

app.post('/', (req, res) => {
    res.status(200)
    .send('Post...');
});

app.get('/produtos', (req, res) => {
    res
    .status(200)
    .json({
        Produto: 'Caneta', 
        Cor: 'Azul'
    });
});
*/

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// 2) ROUTER HANDLERS

const getAllTours  = (req, res) => {
    res.status(200)
    .json({
        requestAt: req.requestTime,
        status: 'Sucesso',
        results: tours.length,
        data: {
            tours
        }
    });
}

const getTour = (req, res) => {
    console.log(req.params); // req.params, pega todos os parametros passados na URL, dois pontos : define que é um parametro
                             // caso o parametro tenha um ponto de interrogação na frente, isso define ele como opcional :x?

    const id = req.params.id * 1; // Multiplicar um numero string, transforma ele para o tipo numerico automaticamente 
    const tour = tours.find(elemento => elemento.id === id);

    //if(id > tours.length) {
    if(!tour) {
        return res.status(404)
                  .json({
                    status: 'Fail',
                    message: 'Id invalido'
                  });
    };

    res.status(200)
    .json({
        status: 'Sucesso',
        data: {
            tour
        }
    });
}

const createTour = (req, res) => {
    //console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body)

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour
            }
        });
    })
}

const updateTour = (req, res) => {
    // put recebe todos os dados para serem atualizados
    // patch recebe apenas os dados que vão ser atualizados

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'Sucesso',
        data: {
            tour: '<Update tour here... >'
        }
    })
}

const deleteTour = (req, res) => {

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'Sucesso',
        data: null
    })
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'Rota não definida.'
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'Rota não definida.'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'Rota não definida.'
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'Rota não definida.'
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'Error',
        message: 'Rota não definida.'
    })
}

// 3) ROUTERS
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTour);

tourRouter
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

userRouter  
    .route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter
    .route('/:id') 
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 4) START SERVER

const port = 3000;
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
});