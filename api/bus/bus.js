const BusModel = require("../../models/bus");
const mongoose = require("mongoose");

// 조회 : [GET] /bus

const list = (req, res) => {
  const userid = res.locals.userid;

  BusModel.find({ userid }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다." });
    }
    res.status(200).json(result);
  });
};

// 최근 n개 조회 : [GET] /bus/recent

const recentList = (req, res) => {
  const limit = 15;
  const userid = res.locals.userid;

  BusModel.find({ userid }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다." });
    }
    return res.status(200).json(result);
  })
    .limit(limit)
    .sort({ _id: -1 });
};

// 등록 : [POST] /bus

const create = (req, res) => {
  let { location, route, number, type, year } = req.body;

  locaiton = location || "-";
  route = route || "-";
  number = number || "-";
  type = type || "-";
  year = year || "-";

  const userid = res.locals.userid;

  BusModel.create(
    { userid, location, route, number, type, year },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "서버에 오류가 발생했습니다." });
      }
      return res.status(201).end();
    }
  );
};

// 수정 : [PUT] /bus/:id

const update = (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "잘못된 요청입니다." });
  }

  const { location, route, number, type, year } = req.body;

  BusModel.findByIdAndUpdate(
    id,
    { location, route, number, type, year },
    { new: true },
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "서버에 오류가 발생했습니다. 01" });
      }
      if (!result) {
        return res.status(404).json({ error: "해당 객체를 찾을 수 없습니다." });
      }
      return res.status(200).json(result);
    }
  );
};

// 삭제 : [DELETE] /bus/:id

const remove = (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "잘못된 요청입니다." });
  }

  BusModel.findByIdAndRemove(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다." });
    }
    if (!result) {
      return res.status(404).json({ error: "해당 객체를 찾을 수 없습니다." });
    }
    return res.status(200).end();
  });
};

module.exports = { list, create, update, remove, recentList };
