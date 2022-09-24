const bcrypt = require('bcrypt'); 
const Validator = require('fastest-validator');
const v = new Validator();
const {User} = require('../../../models');

module.exports = async (req, res) => {
  const {name, email, password, profession} = req.body;

  const schema = {
    name: 'string|empty:false',
    email: 'email|empty:false',
    password: 'string|min:6',
    profession: 'string|optional'
  }

  const validate = v.validate(req.body, schema);

  if(validate.length){
    return res.status(400).json({
      status: 'error',
      message: validate
    });
  }

  const isEmailExist = await User.findOne({
    where: {email}
  });

  if(isEmailExist){
    return res.status(409).json({
      status: 'error',
      message: 'email already exist'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = {
    name,
    email,
    password: hashedPassword,
    profession,
    role: 'student'
  }

  const createdUser = await User.create(data);

  return res.json({
    status: 'success',
    data: {
      id: createdUser.id
    }
  })
}