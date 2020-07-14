const UserModel = require("../../models/user");
const BusModel = require("../../models/bus");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

// 회원가입 : [POST] /user/register

const signup = (req, res) => {
  const { name, id, password } = req.body;

  if (!name || !id || !password) {
    return res.status(400).json({ error: "모든 정보를 입력하세요." });
  }

  UserModel.findOne({ id }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다. 01" });
    }
    if (result) {
      return res.status(409).json({ error: "이미 사용중인 아이디입니다." });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "서버에 오류가 발생했습니다. 02" });
      }
      const user = new UserModel({ name, id, password: hash });
      user.save((err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "서버에 오류가 발생했습니다. 03" });
        }
        return res.status(201).end();
      });
    });
  });
};

// 로그인 & 토큰 요청 : [POST] /user/login

const login = (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ error: "아이디와 비밀번호를 입력하세요." });
  }
  UserModel.findOne({ id }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다. 01" });
    }
    if (!user) {
      return res.status(401).json({ error: "존재하지 않는 아이디입니다." });
    }

    bcrypt.compare(password, user.password, (err, isSame) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "서버에 오류가 발생했습니다. 02" });
      }
      if (!isSame) {
        return res.status(401).json({ error: "비밀번호가 틀립니다." });
      }

      const token = jwt.sign(user._id.toHexString(), "feelspecial");

      UserModel.findOneAndUpdate(
        { _id: user._id },
        { token },
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "서버에 오류가 발생했습니다. 03" });
          }
          res.cookie("token", token, { httpOnly: true });
          res.json({ token });
        }
      );
    });
  });
};

// 로그아웃 : [POST] /user/logout

const logout = (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, "feelspecial", (err, _id) => {
    if (err) {
      res.clearCookie("token");
      return res.status(500).json({
        error: "서버에 오류가 발생했습니다. 01",
      });
    }
    UserModel.findByIdAndUpdate(_id, { token: "" }, (err, result) => {
      if (err) {
        res.clearCookie("token");
        return res.status(500).json({
          error: "서버에 오류가 발생했습니다. 02",
        });
      }
      res.clearCookie("token");
      return res.status(200).end();
    });
  });
};

// 자동로그인 체크 : [GET] /user/check

const check = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(404).end();
  }

  jwt.verify(token, "feelspecial", (err, _id) => {
    if (err) {
      res.clearCookie("token");
      return res.status(500).end();
    }
    UserModel.findOne({ _id, token }, (err, result) => {
      if (err || !result) {
        res.clearCookie("token");
        return res.status(500).end();
      }

      BusModel;

      return res.status(200).end();
    });
  });
};

// 탈퇴 : [POST] /user/resign

const resign = (req, res) => {
  const { id } = req.body;
  const token = req.cookies.token;

  jwt.verify(token, "feelspecial", (err, _id) => {
    if (err) {
      return res.status(500).json({ error: "서버에 오류가 발생했습니다. 01" });
    }
    UserModel.findOne({ _id, token }, (err2, result2) => {
      if (err2 || !result2) {
        return res
          .status(500)
          .json({ error: "서버에 오류가 발생했습니다. 02" });
      }
      console.log(result2.id, id);
      if (result2.id !== id) {
        return res
          .status(403)
          .json({ error: "아이디를 정확하게 입력해주세요." });
      }

      BusModel.remove({ userid: result2.id }, (err3, result3) => {
        if (err3) {
          return res
            .status(500)
            .json({ error: "서버에 오류가 발생했습니다. 03" });
        }
        UserModel.findOneAndRemove({ _id: result2._id }, (err4, result4) => {
          if (err4) {
            return res
              .status(500)
              .json({ error: "서버에 오류가 발생했습니다. 04" });
          }
          res.clearCookie("token");
          return res.status(200).end();
        });
      });
    });
  });
};

// 토큰 체크 : 미들웨어

const checkAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    if (
      req.url === "/api/user/login" ||
      req.url === "/api/user/signup" ||
      req.url === "/api/user/check"
    ) {
      // 토큰 없는 페이지 설정
      return next();
    } else {
      res.clearCookie("token");
      return res.status(401).json({
        error: "토큰이 올바르지 않습니다. 다시 로그인해주시기 바랍니다.",
      });
    }
  }

  jwt.verify(token, "feelspecial", (err, _id) => {
    if (err) {
      res.clearCookie("token");
      return res.status(500).json({
        error: "서버에 오류가 발생했습니다. 01",
      });
    }

    UserModel.findOne({ _id, token }, (err, result) => {
      if (err) {
        res.clearCookie("token");
        return res.status(500).json({
          error: "서버에 오류가 발생했습니다. 02",
        });
      }
      if (!result) {
        res.clearCookie("token");
        return res.status(401).json({
          error: "잘못된 사용자 정보입니다. 다시 로그인해주시기 바랍니다.",
        });
      }
      res.locals.userid = result.id;
      next();
    });
  });
};

module.exports = { signup, login, checkAuth, logout, check, resign };
