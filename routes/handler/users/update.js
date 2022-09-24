const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();
const { User } = require("../../../models");

module.exports = async (req, res) => {
  const id = req.params.id;
  const { name, email, password, profession, avatar } = req.body;

  const schema = {
    name: "string|empty:false",
    email: "email|empty:false",
    password: "string|min:6",
    profession: "string|optional",
    avatar: "string|optional"
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "user not found",
    });
  }

  if(email){
    const checkEmail = await User.findOne({
      where: { email },
    });

    if(checkEmail && email !== user.email){
      return res.status(409).json({
        status: "error",
        message: "email already exist",
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await user.update({
    name,
    email,
    password: hashedPassword,
    profession,
    avatar
  });

  return res.json({
    status: "success",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
    },
  });
};
