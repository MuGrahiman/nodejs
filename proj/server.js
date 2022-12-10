// let http = require('http');
// let fs = require('fs')
 
// let server = http.createServer((req,res)=>{
     
//     let path = './view';
//     switch (req.url) {
//         case '/':
//             path += '/index.html';
//             break;
//     case '/about':
//         path += '/about.html';
//         break;
//         default:
//             path += '/404.html';
//             break;
//     }
//     fs.readFile(path,(err,data)=>{
//         if (err) {
//             console.log(err);
//             res.end()
//         } else {
//             res.write(data)
//             res.end();
//         }     
//     })
// })
// server.listen(3000)

// let express = require('express');
// let app= express();
// app.set('view engine ','ejs');

// app.listen(3000);
 
// app.get('/',(req,res)=>{
//     res.sendFile('./view/index.html',{root : __dirname})
// })
// app.get('/about',(req,res)=>{
//     res.sendFile('./view/about.html',{root : __dirname})
// })
// app.use((req,res)=>{
//     res.statusCode(404).res.sendFile('./view/404.html',{root :{__dirname}})
// })