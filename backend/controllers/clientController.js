const Client = require('../models/Client');

const getClients = async (req, res) => {
  const salonId = req.user.salonId;
  const clients = await Client.find({ salonId });
  res.json(clients);
};

const createClient = async (req, res) => {
  const salonId = req.user.salonId;
  const client = await Client.create({ ...req.body, salonId });
  res.status(201).json(client);
};

module.exports = { getClients, createClient };
