const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await db("posts");
  //const posts = await db.select('*').from('posts');
  try {
    res.status(200).json(posts);
  } catch ({ error }) {
    res.status(500).json({ error, message: "Error retrieving post" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [post] = await db("posts").where({ id });
  // const post = await db.select("*").from('posts').where({id});

  try {
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: `Post with the id of ${id} does not exist` });
    }
  } catch ({ error }) {
    res.status(500).json({ error, message: "Error retrieving post" });
  }
});

router.post("/", async (req, res) => {
  const postData = req.body;
  const post = await db("posts").insert(postData);

  try {
    res.status(201).json(post);
  } catch ({ error }) {
    res.status(500).json({ error, message: "could not add your post" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  const count = await db("posts")
    .where("id", "=", id)
    .update(changes);
  // const count = await db('posts').where({id}).update(changes);
  try {
    if (count) {
      res.status(200).json({ updated: count });
    } else {
      res.status(404).json({ message: `could not find post ${id}` });
    }
  } catch ({ error }) {
    res.status(500).json({ error, message: "could not update post" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const count = await db("posts")
    .where({ id })
    .del();

  try {
    if (count) {
      res.status(200).json({
        message: `Post with id of ${id} successfully removed`,
        deleted: count
      });
    } else {
      res
        .status(404)
        .json({ message: `post with id of ${id} could not be found.` });
    }
  } catch ({ error }) {
    res.status(500).json({ error, message: "Could not delete post" });
  }
});

module.exports = router;
