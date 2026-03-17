const login = document.querySelector(".login");
const loginForm = login.querySelector(".login-form");
const loginInput = login.querySelector(".login-input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat-form");
const chatInput = chat.querySelector(".chat-input");
const chatMessages = chat.querySelector(".chat-messages");

const loadingScreen = document.getElementById("loading");

const user = {
  id: "",
  name: "",
  color: "",
};

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

let websocket;

const getRandomColor = function () {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");

  div.classList.add("message-self");

  div.innerHTML = content;
  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message-other");
  span.classList.add("message-sender");
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
};

const processMessage = ({ data }) => {
  try {
    const parsedData = JSON.parse(data);

    // Verifica se 'parsedData' tem a propriedade 'message' (mensagem do servidor)
    if (parsedData && parsedData.message) {
      const serverMessage = parsedData.message;

      // Lógica para lidar com mensagens do servidor (se necessário)
      console.log("Conectado ao Chat!:", serverMessage);
    } else if (
      parsedData &&
      parsedData.userId &&
      parsedData.userName &&
      parsedData.userColor &&
      parsedData.content
    ) {
      const { userId, userName, userColor, content } = parsedData;

      const message =
        userId === user.id
          ? createMessageSelfElement(content)
          : createMessageOtherElement(content, userName, userColor);

      chatMessages.appendChild(message);

      scrollScreen();
    } else {
      console.error("A mensagem recebida não tem o formato esperado:", data);
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
  }
};

const handleLogin = function (event) {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  loadingScreen.style.display = "flex";

  // 1. Criar a instância
  websocket = new WebSocket("wss://chat-online-pjla.onrender.com");

  // 2. Definir os eventos ANTES de atribuir à variável global (se possível) ou logo em seguida
  ws.onopen = () => {
    console.log("Conectado com sucesso!");
    loadingScreen.style.display = "none";
    chat.style.display = "flex";
  };

  ws.onmessage = processMessage;
  ws.onerror = (err) => console.error("Erro no WS:", err);

  websocket = ws; // Atribui à variável global 'let websocket'
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));

  chatInput.value = "";
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);

//websocket = new WebSocket("wss://chat-online-pjla.onrender.com");
//websocket = new WebSocket("ws://localhost:8081");
