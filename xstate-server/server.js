const express = require("express");
const toggleMachine = require("./machine");
const { interpret } = require("xstate");
const cors = require("cors");
const dashboardMachine = require("./dashboard");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080", // Allow requests from this origin (front-end)
    methods: ["GET", "POST", "DELETE", "PUT"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization", 'Access-Control-Allow-Origin'], 
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const port = 3000;


app.post("/dashboard", (req, res) => {
  const sendingFunction = (ctx) => {
    res.json(ctx);
  };

  const httpReq = req.body;

  const newMachine = dashboardMachine.withConfig({
    actions: {
      sendCtx: (context, event) => {
        sendingFunction(context);
      },
    },
  });
  const service = interpret(newMachine);

  service.start();

  service.onTransition((state) => {
    console.log("ON STATE: ", state.value);
    console.log("NextEvents: ", state.nextEvents);

  });
  console.log("httpReq.data=", httpReq.data);

  service.send({ type: httpReq.transition, value: httpReq.data });

  service.onStop(() => {
    console.log(
      "---------------------!!! Machine STOPPED !!!---------------------"
    );
  });
});

app.post("/", (req, res) => {
  const sendingFunction = (ctx) => {
    res.json(ctx);
  };

  const httpReq = req.body;

  const newMachine = toggleMachine.withConfig({
    actions: {
      sendCtx: (context, event) => {
        sendingFunction(context);
      },
    },
  });
  const service = interpret(newMachine);

  service.start();

  service.onTransition((state) => {
    console.log("ON STATE: ", state.value);
    console.log("NextEvents: ", state.nextEvents);
  });
  console.log("httpReq.data=", httpReq.data);

  service.send({ type: httpReq.transition, value: httpReq.data });

  service.onStop(() => {
    console.log(
      "---------------------!!! Machine STOPPED !!!---------------------"
    );
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
