const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)); 

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        });
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Sem informações'
        })
    }
    next();
}

exports.getAllTours  = (req, res) => {
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

exports.getTour = (req, res) => {
    console.log(req.params); // req.params, pega todos os parametros passados na URL, dois pontos : define que é um parametro
                             // caso o parametro tenha um ponto de interrogação na frente, isso define ele como opcional :x?

    const id = req.params.id * 1; // Multiplicar um numero string, transforma ele para o tipo numerico automaticamente 
    const tour = tours.find(elemento => elemento.id === id);

    res.status(200)
    .json({
        status: 'Sucesso',
        data: {
            tour
        }
    });
}

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    // put recebe todos os dados para serem atualizados
    // patch recebe apenas os dados que vão ser atualizados

    res.status(200).json({
        status: 'Sucesso',
        data: {
            tour: '<Update tour here... >'
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'Sucesso',
        data: null
    });
};