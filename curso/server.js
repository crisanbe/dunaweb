/* jshint expr: false */
/*jshint esversion: 6 */
var express = require('express');
var  exphbs   = require ( 'express-handlebars' ) ;
var  bodyParser  = require('body-parser') ;
var mysql = require('mysql');




var admin = require("firebase-admin");

var app = express();//llamamos esta funcion


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

app.use(bodyParser.json());
app. use( bodyParser . urlencoded ( {  extended : true } ));//se ejecute de forma extendida verdadera
app.use(express.static('public'));//donde vamos a crear css,html





// Fetch the service account key JSON file contents
var serviceAccount = require("./garcia-1ab89-firebase-adminsdk-76n3e-9ed408753f.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://garcia-1ab89.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();




app.get('/', function (req, res) {
  res.render('home',{title:'Bienvenido'});
});

app.get('/productos', function (req, res) {
  var list;
   db.ref('productos').on('value', function(snapshot){
  list = snapshot.val();
  //Console.log('list:', list);
  res.render('agregarproducto',{title:'Bienvenido',list:list});
   });
});



var mysqlConnection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'3209198407velez',
  database:'duna',
  multipleStatements: true
});

mysqlConnection.connect((err) => {
if(!err)
console.log('BD connection completa');
else
console.log('DB connection faild \n Error:'+ JSON.stringify(err,undefined,2));
});



app.listen(3000,()=>console.log('Example app listening on port 3000!'));

app.get('/productos' ,(req,res)=> {
    mysqlConnection.query('SELECT * FROM productos',(err,rows,fields)=>{
      if(!err)
       //console.log(rows);
       res.send(rows);
       else
       console.log(err);
      // db.ref('listaproductos').on('value', function(snapshot){
        // err = snapshot.val()
         res.render('agregarproducto', {title:'productos', descripcion:'Estos son mis productos'});

       });

    });


app.get('/productos/:id',(req,res)=> {
  mysqlConnection.query('SELECT * FROM productos WHERE idproductos = ?',[req.params.id],(err, rows, fields)=>{
    if(!err)
     res.send(rows);
     //res.send('eliminado ');
     else
     console.log(err);
  });
     
});


app.delete('/productos/:id',(req,res)=> {
  mysqlConnection.query('DELETE  FROM productos WHERE idproductos = ?',[req.params.id],(err, rows, fields)=>{
    if(!err)
     res.send('eliminado ');
     else
     console.log(err);
  });
     
});


app.post('/productos', function (req, res) {
  let pro = req.body;
  var sql = "SET @idproductos = ?;SET @nombrepro = ?;SET @codproducto = ?;SET @descripcion = ?;SET @precio = ?; \ CALL cliente_procedure(@idproductos,@nombrepro,@codproducto,@descripcion,@precio);";
  mysqlConnection.query(sql, [pro.idproductos, pro.nombrepro, pro.codproducto, pro.descripcion, pro.precio], (err, rows, fields)=>{
    if(!err)
     rows.forEach(element => {
        if (element.constructor == Array)
        res.send('Producto guardado id : '+element[0].idproductos),
        db.ref('productos').push(pro),
        res.render('agregarproducto', {title:req.body.nombrepro, descripcion:'Estos son mis productos'});
        
        
     });
     else
     console.log(err);
     //console.log('llego',req.body);
     
     
  });
     
});


//res:responsi req:
/*app.post('/guardar', function (req, res) {
   
  var newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };
 db.ref("usuarios").push(newUser),

 console.log('LLEGO',req.body);

 res.render('home', {title:req.body.firstname, descripcion:'Esta es mi primera api'});
});

*/
