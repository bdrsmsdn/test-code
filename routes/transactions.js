const router = require('express').Router();
const Book = require('../models/books');
const Member = require('../models/members');

/**
 * @swagger
 * /trx/borrow:
 *   post:
 *     summary: Borrow a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Borrow'
 *     responses:
 *       201:
 *         description: Borrowed book successfully
 */
router.post('/borrow', async (req, res) => {
  try {
    const member = await Member.findOne({ code: req.body.memberCode });
    if (!member) return res.status(404).json({ error: true, message: 'Member not found' });

    const currentDate = new Date();
    if (currentDate < member.timePenalty) {
      return res.status(403).json({ error: true, message: 'Member is under penalty' });
    }

    if (member.borrowedBook.length >= 2) {
      return res.status(400).json({ error: true, message: 'Member can only borrow up to 2 books' });
    }

    const book = await Book.findOne({ code: req.body.bookCode });
    if (!book) {
      return res.status(404).json({ error: true, message: 'Book not found' });
    }

    if(book.stock === 0){
      return res.status(400).json({ error: true, message: 'Book already borrowed by another member' });
    }

    book.stock -= 1;
    member.borrowedBook.push({ bookCode: book.code, borrowDate: currentDate });
    member.isPenalty = false;
    member.timePenalty = null;

    await book.save();
    await member.save();

    res.status(200).json({ error: false, message: 'Book borrowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /trx/return:
 *   post:
 *     summary: Return a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Borrow'
 *     responses:
 *       201:
 *         description: Returned book successfully
 */
router.post('/return', async (req, res) => {
  try {
    const member = await Member.findOne({ code: req.body.memberCode });
    if (!member) return res.status(404).json({ error: true, message: 'Member not found' });

    const book = await Book.findOne({ code: req.body.bookCode });
    if (!book) return res.status(400).json({ error: true, message: 'Book not found' });

    const borrowedIndex = member.borrowedBook.findIndex(b => b.bookCode === book.code);
    if (borrowedIndex === -1) {
      return res.status(400).json({ error: true, message: 'Book not borrowed by this member' });
    }

    const borrowedBook = member.borrowedBook[borrowedIndex];
    const borrowDate = new Date(borrowedBook.borrowDate);
    const dayReturn = new Date();
    const dayBorrowed = Math.floor((dayReturn - borrowDate) / (1000 * 60 * 60 * 24));

    book.stock += 1;
    member.borrowedBook.splice(borrowedIndex, 1);

    if (dayBorrowed > 7) {
      member.isPenalty = true;
      member.timePenalty = new Date(dayReturn.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    await book.save();
    await member.save();

    res.status(200).json({ error: false, message: 'Book returned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

module.exports = router;
