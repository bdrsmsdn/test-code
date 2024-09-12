const router = require('express').Router();
const Book = require('../models/books');

function getDate() {
  var date = new Date();
  var year = date.toLocaleString('id-ID', { year: 'numeric' });
  var month = date.toLocaleString('id-ID', { month: '2-digit' });
  var day = date.toLocaleString('id-ID', { day: '2-digit' });
  var hour = date.toLocaleString('id-ID', { hour: '2-digit' });
  var minute = date.toLocaleString('id-ID', { minute: '2-digit' });
  var second = date.toLocaleString('id-ID', { second: '2-digit' });
  var formattedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  return formattedDate;
}

/**
 * @swagger
 * /books/createBook:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Books'
 *     responses:
 *       201:
 *         description: Created book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 */
router.post('/createBook', async (req, res) => {
  try {
    await Book.create({
      timeStamp: getDate(),
      code: req.body.code,
      name: req.body.name,
      author: req.body.author,
      title: req.body.title,
      stock: req.body.stock
    });
    res.status(201).json({ error: false, message: 'Add data successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /books/getAllBooks:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Books'
 */
router.get('/getAllBooks', async (req, res) => {
  try {
    let books = await Book.find({ stock: {$gt: 0} }).sort({ timeStamp: 1 });

    if(books.length > 0){
      res.status(200).json(books);
    } else {
      res.status(200).json({ error: false, message: 'Data not found' });
    }

  } catch (err) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// router.delete('/:id', async (req, res) => {
//   try {
//     // Find user by id
//     let books = await Book.findById(req.params.id);

//     // Delete user from db
//     await Books.remove();
//     res.status(200).json({ error: false, message: 'Delete data successfully' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: true, message: 'Internal Server Error' });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     let books = await Book.findById(req.params.id);

//     const data = {
//       name: req.body.name || members.name,
//       code: req.body.code || members.code,
//       timeStamp: getDate(),
//     };

//     members = await Book.findByIdAndUpdate(req.params.id, data, { new: true });

//     res.status(201).json({ error: false, message: 'Edit data successfully.' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: true, message: 'Internal Server Error' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     // Find user by id
//     let books = await Book.findById(req.params.id);
//     res.status(200).json(members);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: true, message: 'Internal Server Error' });
//   }
// });

module.exports = router;