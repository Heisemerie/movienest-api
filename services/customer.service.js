const CustomerRepo = require("../repo/CustomerRepo");

async function getAll() {
  return await CustomerRepo.findAllSortedByName();
}

async function getById(id) {
  return await CustomerRepo.findById(id);
}

async function create(data) {
  const customer = await CustomerRepo.create({
    name: data.name,
    isGold: data.isGold,
    phone: data.phone,
  });

  return customer;
}

async function update(id, data) {
  const customer = await CustomerRepo.update(id, {
    name: data.name,
    isGold: data.isGold,
    phone: data.phone,
  });

  return customer;
}

async function remove(id) {
  return await CustomerRepo.delete(id);
}

module.exports = { getAll, getById, create, update, remove };
