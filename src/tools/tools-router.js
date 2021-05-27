const path = require("path");
const express = require("express");
const xss = require("xss");
const ToolsService = require("./tools-service");

const toolsRouter = express.Router();
const jsonParser = express.json();

const serializeTool = (tool) => ({
  id: tool.id,
  user_id: tool.user_id,
  tool_name: xss(tool.tool_name),
  details: xss(tool.details),
  quantity: tool.quantity,
});

toolsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ToolsService.getAllTools(knexInstance)
      .then((tools) => {
        res.json(tools.map(serializeTool));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { user_id, tool_name, details, quantity } = req.body;
    const newTool = { user_id, tool_name, details, quantity };

    for (const [key, value] of Object.entries(newTool))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    ToolsService.insertTool(req.app.get("db"), newTool)
      .then((tool) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tool.id}`))
          .json(serializeTool(tool));
      })
      .catch(next);
  });

toolsRouter.route("/my-tools/:user_id").all((req, res, next) => {
  if (isNaN(parseInt(req.params.user_id))) {
    return res.status(404).json({
      error: {
        message: `Invalid id`,
      },
    });
  }
  ToolsService.getToolsByUserId(req.app.get("db"), req.params.user_id)
    .then((tools) => {
      res.json(tools.map(serializeTool));
    })
    .catch(next);
});

toolsRouter
  .route("/:tool_id")
  .all((req, res, next) => {
    ToolsService.getById(req.app.get("db"), req.params.tool_id)
      .then((tool) => {
        if (!tool) {
          return res.status(404).json({
            error: { message: `Tool doesn't exist` },
          });
        }
        res.tool = tool;
        next();
      })
      .catch(next);
  })

  .get((req, res, next) => {
    res.json(serializeTool(res.tool));
  })

  .delete((req, res, next) => {
    ToolsService.deleteTool(req.app.get("db"), req.params.tool_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { user_id, tool_name, details, quantity } = req.body;
    const toolToUpdate = { user_id, tool_name, details, quantity };

    const numberOfValues = Object.values(toolToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'tool_name', 'details', or 'quantity'.`,
        },
      });

    ToolsService.updateTool(req.app.get("db"), req.params.tool_id, toolToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = toolsRouter;
