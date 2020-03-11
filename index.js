const express = require('express')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Product = require('./mongoose')
const upload = require('./uploadConfig');
const parser = require('body-parser').urlencoded({ extended: false })
const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
   Product.find()
      .then(products => res.render('index', { products }))
      .catch(err => res.send(err.message))
})

app.get('/remove/:id', (req, res) => {
   const { id } = req.params
   Product.findOneAndDelete({ _id: id })
      .then(() => res.redirect('/'))
      .catch(err => res.send(err.message))
})
app.get('/add', (req, res) => res.render('add'))

app.post('/add', upload.single('image'), (req, res) => {
   const { name, video, desc } = req.body
      //nếu k tải lên file thì nó sẽ k request cho file nên phải kiểm tra
      // nếu k tải file thì req.file= undifined + .filename =>server sẽ bị die
      // nếu mà có file thì lấy filename còn không có thì gửi lên hình ảnh mặc định
   const image = req.file ? req.file.filename : 'default.jpg'
   const product = new Product({ name, video, desc, image }) // trong object thì đảo vịt trí cũng không ảnh hưởng
   product.save()
      .then(() => res.redirect('/'))
      .catch(err => res.send(err.message))
      //    res.send({ name, video, desc, image }) check
})

const uri = 'mongodb://localhost:27017/mydb';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })


mongoose.connection.once('open', () => {
   app.listen(3000, () => console.log('servser started'))

})