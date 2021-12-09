const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find((c) => c.cpf === cpf);

    if (!customer) return response.status(400).json({ error: "Customer not found" });

    request.customer = customer;

    return next();
}

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists) return res.status(400).json({ error: "Customer already exists" });

    const id = uuidv4();

    customers.push({
        cpf,
        name,
        id,
        statement: [],
    });

    return res.status(201).send();
});

//app.use(verifyIfExistsAccountCPF);

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer.statement);
});

app.listen(3333);
