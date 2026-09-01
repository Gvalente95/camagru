const API = "http://localhost:8080";

const ICONS_PATH = "/assets/icons/";

const NAME_LENGTH_MIN = 4;
const NAME_LENGTH_MAX = 18;

const PASS_LENGTH_MIN = 4;
const PASS_LENGTH_MAX = 18;

let CURRENT_USER = null;

let FORM_TYPE = null;
let FORM_ERROR = null;
let NOTIFICATION = null;

let PASSWORD_RESET_TOKEN = null;

let DARK_MODE = false;
