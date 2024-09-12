const router = require('express').Router();
const Member = require('../models/members');

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
 * /members/createMember:
 *   post:
 *     summary: Create a new member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Members'
 *     responses:
 *       201:
 *         description: Created member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Members'
 */
router.post('/createMember', async (req, res) => {
  try {
    await Member.create({
      timeStamp: getDate(),
      code: req.body.code,
      name: req.body.name
    });
    res.status(201).json({ error: false, message: 'Add data successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /members/getAllMembers:
 *   get:
 *     summary: Get all members
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Members'
 */
router.get('/getAllMembers', async (req, res) => {
  try {
    let members = await Member.find().sort({ timeStamp: 1 });

    res.status(200).json(members);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Find user by id
    let members = await Member.findById(req.params.id);

    // Delete user from db
    await members.remove();
    res.status(200).json({ error: false, message: 'Delete data successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    let members = await Member.findById(req.params.id);

    const data = {
      name: req.body.name || members.name,
      code: req.body.code || members.code,
      timeStamp: getDate(),
    };

    members = await Member.findByIdAndUpdate(req.params.id, data, { new: true });

    res.status(201).json({ error: false, message: 'Edit data successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find user by id
    let members = await Member.findById(req.params.id);
    res.status(200).json(members);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

module.exports = router;