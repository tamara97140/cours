// Function to create a new person
function createPerson(name, age, isInfected, isImmunized = false, group = null, personDown = null, personUp = null) {
  return {
    name,
    age,
    isInfected,
    isImmunized,
    group,
    personDown,
    personUp,
  };
}

// Function to join a person to a group
function joinGroup(person, group) {
  return {
    ...person,
    group,
  };
}

// Function to heal a person
function guerir(person) {
  return {
    ...person,
    isInfected: false,
  };
}

// Function to immunize a person
function immuniser(person) {
  return {
    ...person,
    isImmunized: true,
  };
}

// Function to kill a person
function mourir(person) {
  return {
    ...person,
    isInfected: false,
  };
}

// Function to propagate infection to the person below
function propagateDown(person) {
  if (person.personDown) {
    const infectedPersonDown = infect(person.personDown);
    return updatePersonDown(person, infectedPersonDown);
  }
  return person;
}

// Function to propagate infection to the person above
function propagateUp(person) {
  if (person.personUp) {
    const infectedPersonUp = infect(person.personUp);
    return updatePersonUp(person, infectedPersonUp);
  }
  return person;
}

// Function to infect a person
function infect(person) {
  return {
    ...person,
    isInfected: true,
  };
}

// Function to update the person below
function updatePersonDown(person, personDown) {
  return {
    ...person,
    personDown,
  };
}

// Function to update the person above
function updatePersonUp(person, personUp) {
  return {
    ...person,
    personUp,
  };
}

// Function to create a new group
function createGroup() {
  return {
    members: [],
  };
}

// Function to add a person to a group
function addMemberToGroup(group, person) {
  return {
    ...group,
    members: [...group.members, person],
  };
}

// Function to spread infection to all members of a group
function spreadInfection(group) {
  return {
    ...group,
    members: group.members.map(member => (!member.isImmunized ? infect(member) : member)),
  };
}

// Function to check if all members of a group are infected or immunized
function areAllMembersInfected(group) {
  return group.members.every(member => member.isInfected || member.isImmunized);
}

// Function to create a new vaccine
function createVaccine() {
  return {
    immunity: false,
  };
}

// Function to heal a person based on the vaccine's action
function soigner(vaccine, person) {
  if (!vaccine.immunity) {
    const updatedPerson = action(vaccine, person);
    return immuniser(updatedPerson);
  }
  return person;
}

// Abstract function to be implemented in vaccine-specific functions
function action(vaccine, person) {
  // To be implemented in each vaccine-specific function
  return person;
}

// Function to create VaccinA1
function createVaccinA1() {
  return createVaccine();
}

// Function to create VaccinB1
function createVaccinB1() {
  return createVaccine();
}

// Function to create VaccinUltime
function createVaccinUltime() {
  return {
    ...createVaccine(),
    immunity: true,
  };
}

// Function to heal a person based on VaccinA1 action
function actionVaccinA1(person) {
  return guerir(person.age >= 0 && person.age <= 30 ? person : person);
}

// Function to heal a person based on VaccinB1 action
function actionVaccinB1(person) {
  return Math.random() < 0.5 ? mourir(person) : guerir(person);
}

// Function to heal a person based on VaccinUltime action
function actionVaccinUltime(person) {
  return person;
}

// Function to apply vaccines to a person based on infecting variants
function traiterAvecVaccins(person, variants) {
  const vaccins = [];

  // Add the appropriate vaccines based on the variants
  if (variants.includes("Zombie-A") || variants.includes("Zombie-32")) {
    vaccins.push(createVaccinA1());
  }

  if (variants.includes("Zombie-B") || variants.includes("Zombie-C")) {
    vaccins.push(createVaccinB1());
  }

  if (variants.includes("Zombie-Ultime")) {
    vaccins.push(createVaccinUltime());
  }

  // Apply vaccines to the person
  return vaccins.reduce((accPerson, vaccine) => soigner(vaccine, accPerson), person);
}

// Recursive function to spread infection through groups
function spreadInfectionRecursive(currentPerson, infectedGroups) {
  if (currentPerson.isInfected && currentPerson.group) {
    const currentGroup = currentPerson.group;

    if (!infectedGroups.has(currentGroup) && !areAllMembersInfected(currentGroup)) {
      const updatedGroup = spreadInfection(currentGroup);
      infectedGroups.add(updatedGroup);
    }

    if (areAllMembersInfected(currentGroup)) {
      return;
    }
  }

  if (currentPerson.group) {
    currentPerson.group.members.forEach(member => {
      const infectedMember = traiterAvecVaccins(member, ["Zombie-C"]);
      spreadInfectionRecursive(propagateDown(infectedMember), infectedGroups);
      spreadInfectionRecursive(propagateUp(infectedMember), infectedGroups);
    });
  }
}

// Example usage
const personA = createPerson("Alice", 25, false);
const personB = createPerson("Bob", 30, false);
const personC = createPerson("Charlie", 22, true);

const group1 = createGroup();
const group2 = createGroup();

const personAInGroup1 = joinGroup(personA, group1);
const personBInGroup1 = joinGroup(personB, group1);
const personCInGroup2 = joinGroup(personC, group2);

const group1WithMembers = addMemberToGroup(group1, personAInGroup1);
const group1WithMembersAndPersonB = addMemberToGroup(group1WithMembers, personBInGroup1);
const group2WithMembers = addMemberToGroup(group2, personCInGroup2);

const group1Infected = spreadInfection(group1WithMembersAndPersonB);
const group2Infected = spreadInfection(group2WithMembers);

spreadInfectionRecursive(personCInGroup2, new Set());

const updatedPersonA = traiterAvecVaccins(personAInGroup1, ["Zombie-A"]);
const updatedPersonB = traiterAvecVaccins(personBInGroup1, ["Zombie-B"]);
const updatedPersonC = traiterAvecVaccins(personCInGroup2, ["Zombie-C"]);

console.log(updatedPersonA.isInfected);
console.log(updatedPersonB.isInfected);
console.log(updatedPersonC.isInfected);
console.log(updatedPersonA.isImmunized);
console.log(updatedPersonB.isImmunized);
console.log(updatedPersonC.isImmunized);
