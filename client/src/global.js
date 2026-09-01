const API = "http://localhost:8080";

const ICONS_PATH = "/assets/icons/";

const NAME_LENGTH_MIN = 4;
const NAME_LENGTH_MAX = 18;

const PASS_LENGTH_MIN = 4;
const PASS_LENGTH_MAX = 18;

let CURRENT_USER = null;

let FORM_TYPE = null;
let FORM_ERROR = null;

let PASSWORD_RESET_TOKEN = null;

let DARK_MODE = false;

let NOTIFICATION = null;
let NOTIFICATION_TIMEOUT = null;

const AUDIO = {
  capture: new Audio("/assets/audio/capture.mp3"),
  delete: new Audio("/assets/audio/delete.mp3"),
  send: new Audio("/assets/audio/send.mp3"),
  click: new Audio("/assets/audio/click.wav"),
};


