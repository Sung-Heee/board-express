const { ObjectId } = require('mongodb');
const mongoClient = require('./mongoConnect');

const UNEXPECTED_MSG = '<br><a href="/">메인 페이지로 이동</a>';

const getAllArticles = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const board = client.db('hee').collection('board');

    const allArticleCursor = board.find({});
    const ARTICLE = await allArticleCursor.toArray();

    res.render('db_board', {
      ARTICLE,
      articleCounts: ARTICLE.length,
      userId: req.session.userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message + UNEXPECTED_MSG);
  }
};

const writeArticle = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const board = client.db('hee').collection('board');

    // console.log(req.file);

    const newArticle = {
      USER_ID: req.session.userId,
      TITLE: req.body.title,
      CONTENT: req.body.content,
      IMAGE: req.file ? req.file.filename : null, // 저장했으면 filename 넣어주고, 아니면 null 값 넣어줌
    };
    await board.insertOne(newArticle);
    res.redirect('/dbBoard');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message + UNEXPECTED_MSG);
  }
};

const getArticle = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const board = client.db('hee').collection('board');

    const selectedArticle = await board.findOne({
      _id: ObjectId(req.params.id),
    });
    res.render('db_board_modify', { selectedArticle });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message + UNEXPECTED_MSG);
  }
};

const modifyArticle = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const board = client.db('hee').collection('board');

    // 수정한 사진에 대한 정보가 콘솔에 제대로 찍히는지 확인
    // console.log(req.file);

    const modify = {
      TITLE: req.body.title,
      CONTENT: req.body.content,
    };

    if (req.file) modify.IMAGE = req.file.filename;
    await board.updateOne({ _id: ObjectId(req.params.id) }, { $set: modify });
    res.status(200);
    res.redirect('/dbBoard');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message + UNEXPECTED_MSG);
  }
};

const deleteArticle = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const board = client.db('hee').collection('board');

    await board.deleteOne({ _id: ObjectId(req.params.id) });
    res.status(200).json('삭제되었습니다.');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message + UNEXPECTED_MSG);
  }
};

module.exports = {
  getAllArticles,
  writeArticle,
  getArticle,
  modifyArticle,
  deleteArticle,
};

// const boardDB = {
//   // 모든 게시글 가져오기
//   getAllArticles: async (cb) => {
//     connection.query('SELECT * from mydb1.board', (err, data) => {
//       if (err) throw err;
//       cb(data);
//     });
//   },
//   // 게시글 추가하기
//   writeArticle: (newArticle, cb) => {
//     connection.query(
//       `INSERT INTO mydb1.board(USER_ID, TITLE, CONTENT)
//        values ('${newArticle.userId}', '${newArticle.title}', '${newArticle.content}');`,
//       (err, data) => {
//         if (err) throw err;
//         cb(data);
//       },
//     );
//   },
//   // 특정 ID 값을 가지는 게시글 찾기
//   getArticle: (id, cb) => {
//     connection.query(
//       `SELECT * FROM mydb1.board WHERE ID_PK = ${id};`,
//       (err, data) => {
//         if (err) throw err;
//         cb(data);
//       },
//     );
//   },
//   // 특정 ID를 가지는 게시글을 수정하는 컨트롤러
//   modifyArticle: (id, modifyArticle, cb) => {
//     connection.query(
//       `UPDATE mydb1.board SET TITLE = '${modifyArticle.title}', CONTENT = '${modifyArticle.content}' WHERE ID_PK = ${id};`,
//       (err, data) => {
//         if (err) throw err;
//         cb(data);
//       },
//     );
//   },
//   // 특정 ID를 가지는 게시글 삭제하기
//   deleteArticle: (id, cb) => {
//     connection.query(
//       `DELETE FROM mydb1.board WHERE ID_PK = ${id}`,
//       (err, data) => {
//         if (err) throw err;
//         cb(data);
//       },
//     );
//   },
// };

// module.exports = boardDB;
