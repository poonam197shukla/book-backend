const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.set('debug', true);

mongoose.connect('mongodb://localhost:27017/booklist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model('Book', bookSchema);

// CRUD operations
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post('/books', async (req, res) => {
  const newBook = new Book(req.body);
  await newBook.save();
  res.json(newBook);
});

app.put('/books/:id', async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBook);
});

app.delete('/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
