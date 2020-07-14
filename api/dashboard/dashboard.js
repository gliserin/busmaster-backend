const UserModel = require("../../models/user");
const BusModel = require("../../models/bus");
const express = require("express");

// 내가 등록한 버스 개수 : [GET] /dashboard/mybuscount

const myBusCount = (req, res) => {
  const userid = res.locals.userid;

  BusModel.find({ userid }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다. 01" });
    }
    return res.status(200).json({ count: result.length });
  });
};

// 나의 등수 : [GET] /dashboard/myplace

const myPlace = (req, res) => {
  const userid = res.locals.userid;

  let obj = {};

  UserModel.find((err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다." });
    }
    for (let i = 0; i < result.length; i++) {
      obj[`${result[i].id}`] = 0;
    }
    BusModel.find((err2, result2) => {
      if (err2) {
        return res
          .status(500)
          .json({ error: "서버에 오류가 발생했습니다. 02" });
      }
      for (let j = 0; j < result2.length; j++) {
        obj[`${result2[j].userid}`]++;
      }
      let array = [];
      for (let key in obj) {
        array.push({ userid: key, count: obj[`${key}`] });
      }
      array.sort(function (a, b) {
        return a.count > b.count ? -1 : 1;
      });
      let p = 1,
        s = 0;
      array[0].place = p;
      for (let j = 1; j < array.length; j++) {
        if (array[j].count === array[j - 1].count) {
          array[j].place = p;
          s++;
        } else {
          array[j].place = ++p + s;
          p += s;
          s = 0;
        }
      }
      for (let j = 0; j < array.length; j++) {
        if (array[j].userid === userid) {
          return res
            .status(200)
            .json({ place: array[j].place, entire: result.length });
        }
      }
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    });
  });
};

// 사용자 순위 : [GET] /dashboard/ranking

const ranking = (req, res) => {
  const userid = res.locals.userid;
  let obj = {};

  UserModel.find((err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다. 01" });
    }
    for (let i = 0; i < result.length; i++) {
      obj[`${result[i].id}`] = { c: 0, name: result[i].name };
    }
    BusModel.find((err2, result2) => {
      if (err2) {
        return res
          .status(500)
          .json({ error: "서버에 오류가 발생했습니다. 02" });
      }
      for (let j = 0; j < result2.length; j++) {
        obj[`${result2[j].userid}`].c++;
      }
      let array = [];
      for (let key in obj) {
        array.push({
          userid: key,
          name: obj[`${key}`].name,
          count: obj[`${key}`].c,
        });
      }
      array.sort(function (a, b) {
        return a.count > b.count ? -1 : 1;
      });
      let p = 1,
        s = 0;
      array[0].place = p;
      for (let j = 1; j < array.length; j++) {
        if (array[j].count === array[j - 1].count) {
          array[j].place = p;
          s++;
        } else {
          array[j].place = ++p + s;
          p += s;
          s = 0;
        }
      }

      return res.status(200).json(array);
    });
  });
};

module.exports = { myBusCount, myPlace, ranking };
