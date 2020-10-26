const Sequelize = require('sequelize');
const sequelize2= new Sequelize(
  'ict',
  'admin',
  '48834883',
  {
    'host' : 'ict.cor8kkyfcogd.ap-northeast-2.rds.amazonaws.com',
    'dialect' : 'mysql'
  }
);
const sequelize = new Sequelize(
  'ICT', // database name
  'yoonseok', // id
  '12341234', // pw
  {
    'host': 'localhost', // host
    'dialect': 'mariadb' // db type
  }
);
const user2=sequelize2.define('User', {
  ID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userID: {
    type: Sequelize.STRING
  },
  userPW: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  name:
  {
      type: Sequelize.STRING
  },
  birth:
  {
      type:Sequelize.DATE
  },
  gender:
  {
      type:Sequelize.INTEGER
  },
  isLawyer:
  {
      type:Sequelize.INTEGER
  }
},{freezeTableName: true,timestamps: false});
const post=sequelize.define('post',{
  postID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userID: {
    type: Sequelize.INTEGER
  },
  boardCategory: {
    type: Sequelize.INTEGER
  },
  title: {
    type: Sequelize.STRING
  },
  content:
  {
      type: Sequelize.STRING
  },
  writtenDate:
  {
      type: Sequelize.DATE
  }
},{freezeTableName: true,timestamps: false});


const user=sequelize.define('user', {
    ID: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    userID: {
      type: Sequelize.STRING
    },
    userPW: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    name:
    {
        type: Sequelize.STRING
    },
    birth:
    {
        type:Sequelize.DATE
    },
    gender:
    {
        type:Sequelize.INTEGER
    },
    isLawyer:
    {
        type:Sequelize.INTEGER
    }
  },{freezeTableName: true,timestamps: false});

const express = require('express');
const app = express();
//app.use(express.urlencoded());
app.use(express.json()); 
app.use(require('cors')());
app.get('/user/:id',(req,res) => {
  user.findOne({
    where : {ID: req.params.id}
  }).then((data) =>{
    res.json(data);
  })})
app.post('/user/register',(req,res) => {
  user.create(req.body).then( result => {
  res.json({success:true});  
})
.catch( err => {
  res.json({success: false});  
})
});
app.get('/boards/posts',(req,res)=>{
 // console.log("hi");
  post.findAll()
  .then((data) => {
   //console.log(data);
   res.json(data);
  }
  )
});
app.get('/boards/:id',(req,res)=>{
  console.log(req.params.id);
  post.findOne({
    where: {postID:req.params.id}
  }).then(result=>{
    res.json(result);
  })
})
app.post('/boards/write',(req,res) => {
  post.create(req.body).then( result => {
    res.json({success:true});  
  })
  .catch( err => {
    res.json({success: false});  
  })
});
app.delete('/boards/:id',(req,res) =>{
  post.destroy({
    where : {postID : req.params.id}
  }).then(
    console.log("Hi")
  )
  res.json({success:true});
})
app.post('/user/login', (req, res) => {
  user.findOne({
    where: { userID: req.body.userID }
  })
  .then((user) => {
    console.log(user.dataValues);
    if (user===null)
    {
        res.json({success:false});
    }
    else
    {
        if (user.dataValues.userPW==req.body.userPW)
        {
            res.json({success:true,id:user.dataValues.ID});
        }
        else
        {
            res.json({success:false});
        }
    }

  });
});

app.listen(8080);