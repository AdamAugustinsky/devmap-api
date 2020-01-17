const axios = require("axios");
const Dev = require("../models/Dev");
const StringToArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = response.data;

      const techsArray = StringToArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      const sendSocketMessageTo = findConnections(
        {latitude, longitude},
        techsArray,
      );

        sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json(dev);
  },

  async show(req, res) {
    const { github_username } = req.params;
    const dev = await Dev.findOne({ github_username });
    return res.json(dev);
  },

  async update(req, res) {
    const { github_username } = req.params;

    const body = req.body;
    delete body.github_username;

    if (body.longitude && body.latitude) {
      location = {
        type: "Point",
        coordinates: [body.longitude, body.latitude]
      };
      body.location = location;
      delete body.latitude;
      delete body.longitude;
    }

    if (body.techs) {
      body.techs = StringToArray(body.techs);
    }

    const dev = await Dev.findOneAndUpdate({ github_username }, body, {
      new: true
    });

    return res.json(dev);
  },
  
  async destroy(req, res) {
    const { github_username } = req.params;

    const dev = await Dev.findOneAndRemove({ github_username });

    return res.json(dev);
  }
};