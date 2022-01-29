const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./database/connection.js')

const app = express()


//Ler e mandar JSON na req e na res 
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

//Definir a view engine como handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//Especifica a caminho dos arquivos estáticos
app.use(express.static('public'))

//Rota adiciona um livro no banco de dados
app.post('/books/insertbook', (req, res) => {
  const title = req.body.titulo
  const editora = req.body.editora
  const capa = req.body.capa
  const autor = req.body.autor

  const query = `INSERT INTO public."books" (titulo, editora, capa, autor) VALUES ('${title}', '${editora}', '${capa}', '${autor}')`

  //Executa a query
  pool.query(query, err => {
    if (err) {
      //Se ocorrer um erro exibe um erro
      console.log(err)
      return
    }
    
    //Se não redireciona para a home
    res.redirect('/')
  })
})

//Rota pega os dados de todos os livros no banco de dados
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books'

  pool.query(query, (err, data) => {
    if (err) {
      console.log(err)
      return
    }

    const books = data.rows

  
    res.render('books', { books })
  })
})

//Rota pega os dado de um livro baseado no ID
app.get('/books/:id', (req, res) => {
  const id = req.params.id

  const query = `SELECT * FROM books WHERE id = ${id}`

  pool.query(query, (err, data) => {
    if (err) {
      console.log(err)
      return
    }

    //Ira retornar somento o primeiro resultado
    const book = data.rows[0]

    res.render('book', { book })
  })

  
})

//Rota edita as informações de um livro
//A ação de editar terá duas toras, a rota para pegar as informações para que possam ser editadas
//a rota que enviará os dados editados para o banco de dados
app.get('/books/edit/:id', (req, res) => {

  const id = req.params.id

  const query = `SELECT * FROM books WHERE id = ${id} `

  pool.query(query, (err, data) => {
    if (err) {
      console.log(err)
      return
    }

    //Ira retornar somento o primeiro resultado
    const book = data.rows[0]

    res.render('editbook', { book })
  })
})

//Rota envia os dados atualizados para o banco de dados
app.post('/books/updatebook', (req, res) => {

  const id = req.body.id
  const title = req.body.titulo
  const editora = req.body.editora
  const capa = req.body.capa
  const autor = req.body.autor

  const query = `UPDATE books SET titulo = '${title}', editora = '${editora}', capa = '${capa}', autor = '${autor}' WHERE id = ${id}`

  pool.query(query, (err) => {
    if (err) {
      console.log(err)
      return
    }

    res.redirect('/books')
  })
  
})

//
app.post('/books/remove/:id', (req, res) => {
  const id = req.params.id

  const query = `DELETE FROM books WHERE id = ${id}`

  pool.query(query, (err) => {
    if (err) {
      console.log(err)
    }

    res.redirect('/books')
  })
})

app.get('/', (req, res) => {
  res.render('home')
})


app.listen(3000, () => {
  console.log('Servidor rodando!')
})
