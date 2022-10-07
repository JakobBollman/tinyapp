const { getUserByEmail } = require('../helpers.js');
const { assert } = require('chai');

const testUsers = {
  '4bTa9': {
    id: "4bTa9",
    email: "user1@example.com",
    password: 'Chopsuey'
  },
  'T5h2a': {
    id: "T5h2a",
    email: "user2@example.com",
    password: 'Brassmonkey'
  },
};


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user1@example.com", testUsers)
    const expectedUserID = "4bTa9";
    assert.equal(user,expectedUserID);
  });
});